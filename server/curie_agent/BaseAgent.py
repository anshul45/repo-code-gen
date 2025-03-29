import json, os
import inspect
from openai import AsyncAzureOpenAI, AsyncOpenAI
from dotenv import load_dotenv
from anthropic import AsyncAnthropic
from tools.redis_cache import RedisCache

load_dotenv()


class BaseAgent:
    @staticmethod
    def execute_tool_call(tool_call, tools_map):
        """Execute a tool call with the given arguments."""
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)

        print(f"Assistant: {name}({args})")
        return tools_map[name](**args)

    @staticmethod
    def function_to_schema(func) -> dict:
        """Convert a function to an OpenAI function schema format."""
        type_map = {
            str: "string",
            int: "integer",
            float: "number",
            bool: "boolean",
            list: "array",
            dict: "object",
            type(None): "null",
        }

        try:
            signature = inspect.signature(func)
        except ValueError as e:
            raise ValueError(
                f"Failed to get signature for function {func.__name__}: {str(e)}"
            )

        parameters = {}
        for param in signature.parameters.values():
            try:
                param_type = type_map.get(param.annotation, "string")
            except KeyError as e:
                raise KeyError(
                    f"Unknown type annotation {param.annotation} for parameter {param.name}: {str(e)}"
                )
            parameters[param.name] = {"type": param_type}

        required = [
            param.name
            for param in signature.parameters.values()
            if param.default == inspect._empty
        ]

        return {
            "type": "function",
            "function": {
                "name": func.__name__,
                "description": (func.__doc__ or "").strip(),
                "parameters": {
                    "type": "object",
                    "properties": parameters,
                    "required": required,
                },
            },
        }

    def __init__(
            self,
            name: str,
            model: str,
            instructions: str,
            session_id=None,
            temperature=1,
            tools=None,
            base_url=os.getenv("LLM_BASE_URL"),
            api_key=os.getenv('LLM_API_KEY'),
            client_type=os.getenv('LLM_CLIENT_TYPE'),
    ):

        # Open AI client
        if tools is None:
            tools = []

        self.client = AsyncOpenAI(
            base_url=base_url,
            api_key=api_key,
        )

        self.client_type = client_type

        if client_type == "azure":
            self.client = AsyncAzureOpenAI(
                api_key=api_key,
                azure_endpoint=base_url,
                azure_deployment='gpt-4o-mvp-dev',
                api_version='2024-02-15-preview'
            )

        if client_type == 'anthropic':
            self.client = AsyncAnthropic(
                api_key=os.getenv('ANTHROPIC_API_KEY'),
            )

        self.redis_cache = RedisCache()
        self.name = name
        self.model = model
        self.instructions = instructions

        self.tools = tools
        self.session_id = session_id

        if self.tools:
            self.tools_map = {tool.__name__: tool for tool in self.tools}

        self.temp = temperature

        self.thread = self.redis_cache.get(self.name + self.session_id)
        self.overall_thread = self.redis_cache.get('conversation:' + self.session_id)

        if self.thread is None:
            self.thread = [{"role": "system", "content": self.instructions}]

        if self.overall_thread is None:
            self.overall_thread = [{"role": "system", "content": self.instructions}]

    def tools_to_tool_schema(self) -> list:
        return [self.function_to_schema(tool) for tool in self.tools]

    async def run(self, query, response_format=None, max_tool_calls=1):
        """
        Run the agent with fixed tool calling sequence
        """
        try:
            self.thread.append({"role": "user", "content": str(query)})
            self.overall_thread.append({"role": "user", "content": str(query)})

            if not self.tools:
                if self.client_type == 'anthropic':

                    response = await self.client.messages.create(
                        model='claude-3-5-sonnet-latest',
                        max_tokens=8192,
                        messages=[
                            {
                                "role": "user",
                                "content": query
                            }
                        ],
                        system=self.instructions
                    )
                    message = response.content[0].text
                    self.thread.append(
                        {"role": "assistant", "content": json.dumps({"message": message, "type": "code"})})
                    self.overall_thread.append(
                        {"role": "assistant", "content": json.dumps({"message": message, "type": "code"})})

                else:
                    response = await self.client.chat.completions.create(
                        model=self.model,
                        messages=self.thread,
                        temperature=self.temp,
                        response_format={'type': 'json_object'} if response_format == 'json' else None
                    )
                    message = response.choices[0].message.content

                    self.thread.append({"role": "assistant", "content": str(message)})
                    self.overall_thread.append({"role": "assistant", "content": str(message)})
                self.save_thread()
                return self.overall_thread

            tool_schemas = self.tools_to_tool_schema()
            tools_map = {tool.__name__: tool for tool in self.tools}
            tool_call_count = 0

            while tool_call_count < max_tool_calls:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=self.thread,
                    tools=tool_schemas,
                    temperature=self.temp,
                    response_format={'type': 'json_object'} if response_format == 'json' else None
                )

                message = response.choices[0].message

                assistant_message = {
                    "role": "assistant",
                    "content": message.content if message.content else None,
                    "type": "text",
                    "agent_name": self.name,
                }

                if message.tool_calls:
                    assistant_message["tool_calls"] = [
                        {
                            "id": tool_call.id,
                            "type": tool_call.type,
                            "function": {
                                "name": tool_call.function.name,
                                "arguments": tool_call.function.arguments
                            }
                        }
                        for tool_call in message.tool_calls
                    ]

                self.thread.append(assistant_message)
                self.overall_thread.append(assistant_message)

                if not message.tool_calls:
                    break

                for tool_call in message.tool_calls:
                    if tool_call.function.name in tools_map:
                        try:
                            print('calling tool: ', tool_call.function)
                            result = self.execute_tool_call(tool_call, tools_map)
                            tool_response = {
                                "role": "tool",
                                "tool_call_id": tool_call.id,
                                "name": tool_call.function.name,
                                "content": json.dumps(result) if result is not None else "{}",
                                "agent_name": self.name,
                                "type": "json-files" if tool_call.function.name in [
                                    'get_files_with_description'] else 'json-button' if tool_call.function.name in [
                                    'get_activities_by_activity_name',
                                    'get_hotels'] else 'code' if self.name == 'coder_agent' else 'text'
                            }
                            self.thread.append(tool_response)
                            self.overall_thread.append(tool_response)
                        except Exception as e:
                            print(f"Tool execution error: {str(e)}")
                            tool_response = {
                                "role": "tool",
                                "tool_call_id": tool_call.id,
                                "name": tool_call.function.name,
                                "content": json.dumps({"error": str(e)})
                            }
                            self.thread.append(tool_response)
                            self.overall_thread.append(tool_response)
                    else:
                        print(f"Warning: Tool {tool_call.function.name} not found!")

                tool_call_count += 1

            self.save_thread()
            return self.overall_thread

        except Exception as e:
            print('Exception occurred:', e)
            raise

    def save_thread(self):
        self.redis_cache.set(self.name + self.session_id, self.thread)
        self.redis_cache.set('conversation:' + self.session_id, self.overall_thread)

    def call_function(self, resp):
        "This method is used to call the tool from the llms response"

        message = resp.choices[0].message

        function = message.tool_calls[0].function

        name = function.name
        args = json.loads(function.arguments)

        return self.tools_map[name](**args)

    async def run_pyd(self, query, pyd_model) -> dict:
        "This method is to use pydantic models for getting structured outputs"

        self.thread.append({"role": "user", "content": query})
        self.overall_thread.append({"role": "user", "content": query})

        response = await self.client.beta.chat.completions.parse(
            model=self.model,
            messages=self.thread,
            response_format=pyd_model,
            temperature=self.temp
        )

        struct_msg = response.choices[0].message.parsed.model_dump()

        return struct_msg
