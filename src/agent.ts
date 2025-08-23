import {model,createRetrievalChain} from "./ragTool"
import {createReactAgent ,AgentExecutor} from "langchain/agents";

import {tool, ToolInterface} from "@langchain/core/tools"
import {z} from "zod"
import { ChatPromptTemplate } from "@langchain/core/prompts";


async function runAgent(question: string){

    // define Agent core's Prompt (teach Agent how to think and select tools)
    const agentPrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant that helps people find information."],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"]
    ]);


    // Rag Chain 包装成一个工具
    const ragChain = await createRetrievalChain({model});

/*     const companyPolicyTool = tool(
        async ( input: string ) => (await ragChain.invoke({ input })).answer, 
        {
        name: "company_policy",
        description: "get the company policy",
        schema: z.string(),
    }); */


    const dateTool = tool(()=> new Date().toLocaleDateString('zh-CN'), {
        name: 'get_current_date',
        description: 'get current date',
        schema: z.object({}).optional(),
    })


    // create Agent and Executor
    const tools:ToolInterface[] = [dateTool]; // companyPolicyTool

    const agent = await createReactAgent({
        llm:model,
        tools,
        prompt: agentPrompt,
    })

    const agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: true,
    });
  

    // execute Agent
    const result = await agentExecutor.invoke({input:question});

    console.log("\n Agent Result:",result.output);

}

runAgent("我们公司的年假政策是什么?")