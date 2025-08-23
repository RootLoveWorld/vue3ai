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
const ragTool_1 = require("./ragTool");
const agents_1 = require("langchain/agents");
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const prompts_1 = require("@langchain/core/prompts");
function runAgent(question) {
    return __awaiter(this, void 0, void 0, function* () {
        // define Agent core's Prompt (teach Agent how to think and select tools)
        const agentPrompt = prompts_1.ChatPromptTemplate.fromMessages([
            ["system", "You are a helpful assistant that helps people find information."],
            ["human", "{input}"],
            ["placeholder", "{agent_scratchpad}"]
        ]);
        // Rag Chain 包装成一个工具
        const ragChain = yield (0, ragTool_1.createRetrievalChain)({ model: ragTool_1.model });
        /*     const companyPolicyTool = tool(
                async ( input: string ) => (await ragChain.invoke({ input })).answer,
                {
                name: "company_policy",
                description: "get the company policy",
                schema: z.string(),
            }); */
        const dateTool = (0, tools_1.tool)(() => new Date().toLocaleDateString('zh-CN'), {
            name: 'get_current_date',
            description: 'get current date',
            schema: zod_1.z.string().optional(),
        });
        // create Agent and Executor
        const tools = [dateTool]; // companyPolicyTool
        const agent = yield (0, agents_1.createReactAgent)({
            llm: ragTool_1.model,
            tools,
            prompt: agentPrompt,
        });
        const agentExecutor = new agents_1.AgentExecutor({
            agent,
            tools,
            verbose: true,
        });
        // execute Agent
        const result = yield agentExecutor.invoke({ input: question });
        console.log("\n Agent Result:", result.output);
    });
}
runAgent("我们公司的年假政策是什么?");
