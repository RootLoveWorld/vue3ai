
import { tool, ToolInterface } from "@langchain/core/tools";
import { Pool } from "pg";
import { z } from "zod";

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

const dbToolSchema = z.object({
  query: z.string().describe("The SQL query to execute"),
});

export function createDbTool(): ToolInterface {
  return tool(
    async ({ query }: z.infer<typeof dbToolSchema>) => {
      try {
        // 安全检查
        if (query.toLowerCase().match(/(delete|drop|alter|insert)/)) {
          throw new Error("拒绝执行危险SQL操作");
        }
        
        console.log(`[DB工具] 执行SQL: ${query}`);
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        
        // 限制结果数量
        const limitedRows = result.rows.slice(0, 5);
        return limitedRows.map(row => 
          Object.entries(row)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        ).join("\n");
      } catch (error) {
        console.error("数据库错误:", error);
        if (error instanceof Error) {
          return `查询失败: ${error.message}`;
        }
        return "查询失败: 未知错误";
      }
    },
    {
      name: "database_query",
      description: "执行数据库查询以获取实时信息",
      schema: dbToolSchema,
    }
  );
}