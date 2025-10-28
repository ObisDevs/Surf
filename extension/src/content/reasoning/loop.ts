import { parseDOMToJSON } from '../dom/parser';
import { analyzePageWithVision } from '../vision/analyzer';
import { planTask } from './planner';
import { executePlan } from './executor';
import { storeMemory, recallSimilarTasks } from '../memory/storage';
import type { ExecutionResult } from './executor';

export interface ReasoningResult {
  success: boolean;
  goal: string;
  analysis?: string;
  plan?: any;
  execution?: ExecutionResult;
  learned: boolean;
  error?: string;
}

export async function reasonAndAct(userId: string, goal: string, useMemory = true): Promise<ReasoningResult> {
  const result: ReasoningResult = {
    success: false,
    goal,
    learned: false
  };

  try {
    // 1. RECALL: Check memory for similar tasks
    if (useMemory) {
      const memories = await recallSimilarTasks(userId, goal);
      if (memories.length > 0 && memories[0] && memories[0].success) {
        console.log('[SurfAI] Found similar successful task in memory');
      }
    }

    // 2. ANALYZE: Understand current page state
    const domData = parseDOMToJSON();
    const screenshot = await new Promise<string>((resolve) => {
      chrome.runtime.sendMessage({ type: 'SCREENSHOT_CAPTURE' }, (response) => {
        resolve(response.data || '');
      });
    });
    const vision = await analyzePageWithVision(userId, domData, screenshot, `Analyze page to accomplish: ${goal}`);
    result.analysis = vision.analysis;

    // 3. PLAN: Generate action sequence
    const context = JSON.stringify({
      dom: domData.slice(0, 50),
      vision: vision.analysis,
      url: window.location.href
    });

    const plan = await planTask(userId, goal, context);
    result.plan = plan;

    if (plan.confidence < 0.3) {
      throw new Error('Low confidence plan - task may not be achievable');
    }

    // 4. ACT: Execute the plan
    const execution = await executePlan(userId, plan);
    result.execution = execution;

    // 5. LEARN: Store experience in memory
    if (useMemory) {
      const actions = plan.steps
        .filter(s => s.type !== 'analyze' && s.type !== 'wait')
        .map(s => ({
          type: s.type as 'click' | 'type' | 'scroll',
          selector: s.selector,
          value: s.value,
          x: s.x,
          y: s.y
        }));
      await storeMemory(
        userId,
        goal,
        actions,
        domData,
        execution.success
      );
      result.learned = true;
    }

    result.success = execution.success;
    return result;

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
    
    // Store failure for learning
    if (useMemory) {
      await storeMemory(userId, goal, [], [], false);
      result.learned = true;
    }

    return result;
  }
}

export async function retryWithRecovery(userId: string, goal: string, maxRetries = 2): Promise<ReasoningResult> {
  let lastResult: ReasoningResult | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      console.log(`[SurfAI] Retry attempt ${attempt}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    lastResult = await reasonAndAct(userId, goal, true);

    if (lastResult.success) {
      return lastResult;
    }
  }

  return lastResult!;
}
