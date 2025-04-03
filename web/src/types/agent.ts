export interface AgentResponse {
  content: string;
}

export interface ChatRequest {
  message: string;
  user_id: string;
  intent?: string;
  project_id?: string;
}
