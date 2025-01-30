import subprocess
import uuid
from agents.manage_agent import ManagerAgent
import gradio as gr
from typing import Any, List, Tuple
from dotenv import load_dotenv
import os
import sys
from cache.cache import GlobalCache
import git
from pathlib import Path
import shutil
import pyperclip

os.environ["OPIK_PROJECT_NAME"] = "code-gen"

if not (3, 10) <= sys.version_info < (3, 12):
    raise RuntimeError("This project requires Python >= 3.10 and < 3.12.")

class CustomStyles:
    @staticmethod
    def get_css() -> str:
        return """
        .container {
            max-width: 1200px !important;
            margin: auto;
            padding: 20px;
        }
        .chatbot-container {
            height: 600px !important;
            overflow-y: auto;
        }
        .message-box {
            height: 100px !important;
            font-size: 16px !important;
        }
        .sidebar {
            border-left: 1px solid #ccc;
            padding-left: 20px;
        }
        .clone-status {
            margin-top: 10px;
            padding: 10px;
            border-radius: 4px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
        }
        """

class GitHandler:
    def __init__(self):
        self.repos_dir = Path("cloned_repos")
        self.repos_dir.mkdir(exist_ok=True)
    
    def clean_repo_name(self, url: str) -> str:
        """Extract repository name from URL."""
        return url.rstrip("/").split("/")[-1].replace(".git", "")
    
    def clone_repository(self, url: str, user_id: str) -> Tuple[bool, str]:
        """Clone a GitHub repository."""
        if not url.strip():
            return False, "Please provide a valid GitHub URL"
        
        try:
            # Create user-specific directory
            user_dir = self.repos_dir / user_id
            user_dir.mkdir(exist_ok=True)
            
            # Clean existing repo if it exists
            repo_name = self.clean_repo_name(url)
            repo_path = user_dir / repo_name
            if repo_path.exists():
                shutil.rmtree(repo_path)
            
            # Clone the repository
            git.Repo.clone_from(url, repo_path)
            return True, f"Successfully cloned repository: {repo_name}"
            
        except git.GitCommandError as e:
            return False, f"Failed to clone repository: {str(e)}"
        except Exception as e:
            return False, f"An error occurred: {str(e)}"

class ChatbotHandler:
    def __init__(self, user_id: str):
        self.manager_agent = ManagerAgent()
        self.user_id = user_id
        self.github_url = ""
        self.git_handler = GitHandler()
    
    def process_message(self, user_input: str, chat_history: List[Tuple[str, str]], github_url: str) -> Tuple[List[Tuple[str, str]], List[Tuple[str, str]]]:
        if not user_input.strip():
            return chat_history, chat_history
            
        self.github_url = github_url
        response = self.manager_agent.generate_response(user_input, self.user_id)
        chat_history.append((user_input, response))
        
        return chat_history, chat_history
    
    def get_repo_name(self, url):
        # Split the URL and get the last part
        parts = url.rstrip('/').split('/')
        return parts[-1] if len(parts) > 1 else None

    def clear_chat(self) -> Tuple[str, List[Tuple[str, str]], str, str]:
        self.manager_agent.clear_conversation(self.user_id)
        return "", [], "", ""
    
    def handle_clone(self, github_url: str) -> str:
        success, message = self.git_handler.clone_repository(github_url, self.user_id)
        command = f"code2prompt cloned_repos/{self.user_id}/{self.get_repo_name(github_url)} --exclude='*.json,*.yaml' --exclude-from-tree"
        subprocess.run(command, shell=True)
        project_prompt = pyperclip.paste()
        print("project_prompt", project_prompt[:100])
        cache = GlobalCache()
        cache.set(self.user_id, project_prompt)
        return gr.update(value=message, visible=True, elem_classes=("success" if success else "error"))

class UIComponents:
    def __init__(self):
        self.chatbot = None
        self.message = None
        self.send_button = None
        self.clear_button = None
        self.chat_history = None
        self.github_url = None
        self.clone_button = None
        self.clone_status = None

    def create_header(self) -> gr.Markdown:
        return gr.Markdown("""
            Welcome to your personal coding assistant. How can I help you today?
            """)

    def create_chat_interface(self) -> None:
        with gr.Row():
            with gr.Column(scale=9):
                self.chatbot = gr.Chatbot(
                    label="Conversation",
                    elem_classes="chatbot-container",
                    height=500,
                    show_label=False,
                )
                
                with gr.Row():
                    self.message = gr.Textbox(
                        label="Your message",
                        placeholder="Type your message here...",
                        elem_classes="message-box",
                        show_label=False,
                    )
                    self.send_button = gr.Button(
                        "Send",
                        variant="primary",
                        size="lg",
                        scale=0.15,
                    )
            
            with gr.Column(scale=3, elem_classes="sidebar"):
                gr.Markdown("### Repository Settings")
                with gr.Row():
                    self.github_url = gr.Textbox(
                        label="GitHub Repository URL",
                        placeholder="https://github.com/username/repo",
                        show_label=True,
                        scale=4
                    )
                    self.clone_button = gr.Button(
                        "Clone",
                        variant="secondary",
                        size="sm",
                        scale=1
                    )
                self.clone_status = gr.Markdown(
                    visible=False,
                    elem_classes="clone-status"
                )

    def create_clear_button(self) -> None:
        self.clear_button = gr.Button("Clear Conversation", size="sm")
        self.chat_history = gr.State([])

class CodingAssistant:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.ui = UIComponents()
        self.chatbot_handler = ChatbotHandler(user_id)
        self.styles = CustomStyles()

    def setup_event_handlers(self) -> None:
        self.ui.message.submit(
            self.chatbot_handler.process_message,
            inputs=[self.ui.message, self.ui.chat_history, self.ui.github_url],
            outputs=[self.ui.chatbot, self.ui.chat_history],
        ).then(
            lambda: "",
            None,
            self.ui.message,
        )

        self.ui.send_button.click(
            self.chatbot_handler.process_message,
            inputs=[self.ui.message, self.ui.chat_history, self.ui.github_url],
            outputs=[self.ui.chatbot, self.ui.chat_history],
        ).then(
            lambda: "",
            None,
            self.ui.message,
        )

        self.ui.clear_button.click(
            self.chatbot_handler.clear_chat,
            outputs=[
                self.ui.message,
                self.ui.chatbot,
                self.ui.github_url,
                self.ui.clone_status
            ],
            show_progress=False,
        )
        
        self.ui.clone_button.click(
            self.chatbot_handler.handle_clone,
            inputs=[self.ui.github_url],
            outputs=[self.ui.clone_status],
        )

    def create_interface(self) -> gr.Blocks:
        with gr.Blocks(css=CustomStyles.get_css()) as demo:
            with gr.Column(elem_classes="container"):
                self.ui.create_header()
                self.ui.create_chat_interface()
                self.ui.create_clear_button()
                self.setup_event_handlers()
                
        return demo

def main(user_id: str):
    load_dotenv()
    assistant = CodingAssistant(user_id)
    demo = assistant.create_interface()
    return demo

if __name__ == "__main__":
    test_user_id = str(uuid.uuid4())
    demo = main(test_user_id)
    demo.launch()