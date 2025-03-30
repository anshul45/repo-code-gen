export enum MessageType {
  JSON = 'json',
  JSON_BUTTON = 'json-button',
  JSON_FILES = 'json-files',
  CODE = 'code',
  TEXT = 'text',
  ERROR = 'error',
  UI_REFERENCE = 'ui-reference',
}

export interface Message {
  role: string;
  content: string | null;
  tool_calls?: {
    id: string;
    type: string;
    function: {
      name: string;
      arguments: string;
    };
  }[];
  tool_call_id?: string;
  type?: MessageType;
  agent_name?: string;
}
