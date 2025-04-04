const NEXT_PUBLIC_API_URL = "http://localhost:3001"
export interface CreateProjectResponse {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  codebase?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
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

export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/projects?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user projects');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }
}

export async function getProjectById(projectId: string): Promise<Project> {
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch project details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
} 