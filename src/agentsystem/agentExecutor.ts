import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ToolInterface } from "@langchain/core/tools";
import { model } from "./ragCore";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRagTool } from "./tools/ragTool";
import { createDbTool } from "./tools/dbTool";
import { createDateTool } from "./tools/dateTool";

export async function runAgent(question: string) {
  try {
    // 创建工具集
    const tools: ToolInterface[] = [
      await createRagTool(),
      createDbTool(),
      createDateTool()
    ];

    // 创建Agent提示模板
    const agentPrompt = await ChatPromptTemplate.fromMessages([
      ["system", `你是一个企业AI助手，可以调用工具解决问题：
          可用工具：
          ${tools.map(t => `• ${t.name}: ${t.description}`).join("\n")}
          
          决策规则：
          1. 涉及政策、制度 → 使用 ${tools[0].name}
          2. 需要查询数据 → 使用 ${tools[1].name}
          3. 涉及日期 → 使用 ${tools[2].name}
          4. 每次只使用一个工具
      `],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"]
    ]);

    // 创建React Agent
    const agent = await createReactAgent({
      llm: model,
      tools,
      prompt: agentPrompt,
    });

    // 创建执行器
    const executor = new AgentExecutor({
      agent,
      tools,
      maxIterations: 5, // 防止无限循环
      verbose: true,    // 输出详细过程
    });

    // 执行Agent
    const result = await executor.invoke({ input: question });
    
    console.log("\n====== AGENT 结果 ======");
    console.log("问题:", question);
    console.log("回答:", result.output);
    
    if (result.intermediateSteps?.length) {
      console.log("\n思考轨迹:");
      result.intermediateSteps.forEach((step: any, i: number) => {
        console.log(`[${i+1}] 使用工具: ${step.action.tool}`);
        console.log(`   输入参数: ${JSON.stringify(step.action.toolInput)}`);
        console.log(`   工具输出: ${step.observation}`);
      });
    }
    
    return result;
  } catch (error) {
    console.error("Agent执行失败:", error);
    return { output: "系统处理异常，请稍后再试" };
  }
}

// 测试运行
runAgent("我们公司的年假政策是什么？");
runAgent("销售部有多少员工？");
runAgent("15天后是什么日期？");