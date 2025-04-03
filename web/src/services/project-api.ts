const NEXT_PUBLIC_API_URL = "http://localhost:3001"
export interface CreateProjectResponse {
  id: string;
  name: string;
}

export async function createProject(initialPrompt: string, userId: string): Promise<CreateProjectResponse> {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initialPrompt, userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
} 