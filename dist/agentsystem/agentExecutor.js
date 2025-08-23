"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
const agents_1 = require("langchain/agents");
const ragCore_1 = require("./ragCore");
const prompts_1 = require("@langchain/core/prompts");
const ragTool_1 = require("./tools/ragTool");
const dbTool_1 = require("./tools/dbTool");
const dateTool_1 = require("./tools/dateTool");
function runAgent(question) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // 创建工具集
            const tools = [
                yield (0, ragTool_1.createRagTool)(),
                (0, dbTool_1.createDbTool)(),
                (0, dateTool_1.createDateTool)()
            ];
            // 创建Agent提示模板
            const agentPrompt = yield prompts_1.ChatPromptTemplate.fromMessages([
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
            const agent = yield (0, agents_1.createReactAgent)({
                llm: ragCore_1.model,
                tools,
                prompt: agentPrompt,
            });
            // 创建执行器
            const executor = new agents_1.AgentExecutor({
                agent,
                tools,
                maxIterations: 5, // 防止无限循环
                verbose: true, // 输出详细过程
            });
            // 执行Agent
            const result = yield executor.invoke({ input: question });
            console.log("\n====== AGENT 结果 ======");
            console.log("问题:", question);
            console.log("回答:", result.output);
            if ((_a = result.intermediateSteps) === null || _a === void 0 ? void 0 : _a.length) {
                console.log("\n思考轨迹:");
                result.intermediateSteps.forEach((step, i) => {
                    console.log(`[${i + 1}] 使用工具: ${step.action.tool}`);
                    console.log(`   输入参数: ${JSON.stringify(step.action.toolInput)}`);
                    console.log(`   工具输出: ${step.observation}`);
                });
            }
            return result;
        }
        catch (error) {
            console.error("Agent执行失败:", error);
            return { output: "系统处理异常，请稍后再试" };
        }
    });
}
// 测试运行
runAgent("我们公司的年假政策是什么？");
runAgent("销售部有多少员工？");
runAgent("15天后是什么日期？");
