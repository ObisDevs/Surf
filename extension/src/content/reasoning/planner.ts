interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

async function callApi(endpoint: string, body: unknown): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'SECURE_API_CALL', data: { endpoint, method: 'POST', body } },
      (response: ApiResponse) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(response);
      }
    );
  });
}

export interface ActionStep {
  type: 'click' | 'type' | 'scroll' | 'wait' | 'analyze';
  selector?: string;
  value?: string;
  x?: number;
  y?: number;
  reasoning: string;
}

export interface ExecutionPlan {
  goal: string;
  steps: ActionStep[];
  confidence: number;
}

export async function planTask(userId: string, goal: string, context: string): Promise<ExecutionPlan> {
  const response = await callApi('/api/plan', {
    userId,
    goal,
    context,
    url: window.location.href
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Planning failed');
  }

  return response.data.plan;
}
