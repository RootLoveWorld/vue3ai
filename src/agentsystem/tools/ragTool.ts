
import { tool, ToolInterface } from "@langchain/core/tools";
import { createRetrievalChain } from "../ragCore";
import { z } from "zod";

const ragToolSchema = z.object({
  query: z.string().describe("The question to ask the policy documents"),
});

export async function createRagTool(): Promise<ToolInterface> {
  const ragChain = await createRetrievalChain();
  
  return tool(
    async ({ query }: z.infer<typeof ragToolSchema>) => {
      console.log(`[RAG工具] 查询: ${query}`);
      const result = await ragChain(query);
      return result.answer;
    },
    {
      name: "policy_search",
      description: "查询公司政策文档库",
      schema: ragToolSchema,
    }
  );
}