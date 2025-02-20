import openai
from pydantic import BaseModel
from typing import List, Optional
import json, os
import inspect
from opik.integrations.openai import track_openai
from opik import track

class Agent:

    def __init__(
            self, 
            name: str, 
            model: str, 
            instructions: str, 
            temperature = 1, 
            tools=[], 
            base_url = "https://api.openai.com/v1", 
            api_key = os.getenv("OPENAI_API_KEY")
    ):

        # Open AI client
        self.client = openai.OpenAI(api_key=api_key,base_url=base_url)

        # Agent Attributes
        self.name = name
        self.model = model
        self.instructions = instructions

        self.tools = tools

        # if tools provided then create a tool map {tool name: tool object}
        if self.tools != []:
            # Creating a tool map
            self.tools_map = {tool.__name__: tool for tool in self.tools}
        
        self.temp = temperature

        self.thread = [{"role":"system","content":self.instructions}]


    def function_to_schema(self,func) -> dict:
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
    
    @track
    def execute_tool_call(self, tool_call, tools_map):
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)

        print(f"Assistant: {name}({args})")
        return tools_map[name](**args)

    def tools_to_toolschema(self) -> list:
        # for tool in self.tools:
        #     print(tool)
        return [self.function_to_schema(tool) for tool in self.tools]
    
    @track
    def run(self, query, stream=False):
        try:
            self.thread.append({"role":"user","content":query})

            if self.tools != []:
                tool_schemas = self.tools_to_toolschema()
                tools_map = {tool.__name__: tool for tool in self.tools}
                
                completion = self.client.chat.completions.create(
                        model=self.model,
                        messages=self.thread,
                        tools=tool_schemas,
                        temperature=self.temp,
                        stream=stream
                        )
                
                if stream:
                    return completion
                
                message = completion.choices[0].message
                self.thread.append(message)

                while completion.choices[0].message.tool_calls:
                    for tool_call in completion.choices[0].message.tool_calls:
                        print('tool call', tool_call)
                        print(tools_map)
                        result = self.execute_tool_call(tool_call, tools_map)

                        self.thread.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": json.dumps(result),
                        })

                    completion = self.client.chat.completions.create(
                            model=self.model,
                            messages=self.thread,
                            tools=tool_schemas,
                            temperature=self.temp
                            )
                    self.thread.append(completion.choices[0].message)
                return completion
                            
            else:
                completion = self.client.chat.completions.create(
                        model=self.model,
                        messages=self.thread,
                        temperature=self.temp,
                        stream=stream
                        )
                
                if stream:
                    return completion
                
                message = completion.choices[0].message.content
                self.thread.append({"role":"assistant", "content": str(message)})
                return completion
                
        except Exception as e: 
            print('Exception occured', e)
            raise e
            

    def call_function(self,resp):
        "This method is used to call the tool from the llms response"

        message = resp.choices[0].message

        function = message.tool_calls[0].function

        # Getting the tool info from func_obj
        name = function.name
        args = json.loads(function.arguments)

        return self.tools_map[name](**args)
    

    def run_pyd(self, query, pyd_model) -> dict:
        "This method is to use pydantic models for getting structured outputs"

        # Prepare the thread by adding the user query to it
        self.thread.append({"role":"user","content":query})

        response = self.client.beta.chat.completions.parse(
                model=self.model,
                messages=self.thread,
                response_format=pyd_model,
                temperature=self.temp
                )
        
        struct_msg = response.choices[0].message.parsed.model_dump()

        return struct_msg

# EXAMPLE

# load_dotenv()

# def getprice(thing: str,id: str):
#     "Gets the price of a thing with a ID"
#     print(f"for thing {thing} and ID: {id} price is 1000$")


# caps_agent = Agent(
#     name="Caps Agent",
#     model="gpt-4o-mini",
#     tools=[getprice],
#     instructions="decide if to use the function getprice to get a price of a thing with a given ID"
# )

# reply = caps_agent.run("Id like to know the price of ball with ID abc")


# print(reply)

# caps_agent.call_function(reply["func_obj"])
