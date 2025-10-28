import { executeAction, type Action } from '../actions/executor';
import { analyzePageWithVision } from '../vision/analyzer';
import { AIMouse } from '../ui/mouse';

const aiMouse = new AIMouse();
import type { ActionStep, ExecutionPlan } from './planner';

export interface ExecutionResult {
  success: boolean;
  completedSteps: number;
  totalSteps: number;
  error?: string;
  finalState?: string;
}

export async function executePlan(userId: string, plan: ExecutionPlan): Promise<ExecutionResult> {
  const results: ExecutionResult = {
    success: false,
    completedSteps: 0,
    totalSteps: plan.steps.length
  };

  try {
    aiMouse.show();

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      if (!step) continue;
      
      if (step.type === 'analyze') {
        const domElements: any[] = [];
        const screenshot = await new Promise<string>((resolve) => {
          chrome.runtime.sendMessage({ type: 'SCREENSHOT_CAPTURE' }, (response) => {
            resolve(response.data || '');
          });
        });
        const analysis = await analyzePageWithVision(userId, domElements, screenshot, step.reasoning);
        results.finalState = analysis.analysis;
        results.completedSteps++;
        continue;
      }

      if (step.type === 'wait') {
        await new Promise(resolve => setTimeout(resolve, step.value ? parseInt(step.value) : 1000));
        results.completedSteps++;
        continue;
      }

      const element = step.selector ? document.querySelector(step.selector) : null;
      
      if (element) {
        const rect = element.getBoundingClientRect();
        aiMouse.moveTo(rect.left + rect.width / 2, rect.top + rect.height / 2);
        await new Promise(resolve => setTimeout(resolve, 300));
        aiMouse.pulse();
      }

      await executeAction({
        type: step.type as Action['type'],
        selector: step.selector,
        value: step.value,
        x: step.x,
        y: step.y
      });

      results.completedSteps++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    results.success = true;
    return results;

  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Unknown error';
    return results;
  } finally {
    aiMouse.hide();
  }
}
