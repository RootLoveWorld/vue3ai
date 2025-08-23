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
exports.createDbTool = createDbTool;
const tools_1 = require("@langchain/core/tools");
const pg_1 = require("pg");
const zod_1 = require("zod");
const pool = new pg_1.Pool({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});
const dbToolSchema = zod_1.z.object({
    query: zod_1.z.string().describe("The SQL query to execute"),
});
function createDbTool() {
    return (0, tools_1.tool)((_a) => __awaiter(this, [_a], void 0, function* ({ query }) {
        try {
            // 安全检查
            if (query.toLowerCase().match(/(delete|drop|alter|insert)/)) {
                throw new Error("拒绝执行危险SQL操作");
            }
            console.log(`[DB工具] 执行SQL: ${query}`);
            const client = yield pool.connect();
            const result = yield client.query(query);
            client.release();
            // 限制结果数量
            const limitedRows = result.rows.slice(0, 5);
            return limitedRows.map(row => Object.entries(row)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")).join("\n");
        }
        catch (error) {
            console.error("数据库错误:", error);
            if (error instanceof Error) {
                return `查询失败: ${error.message}`;
            }
            return "查询失败: 未知错误";
        }
    }), {
        name: "database_query",
        description: "执行数据库查询以获取实时信息",
        schema: dbToolSchema,
    });
}
