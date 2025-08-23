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
exports.createRagTool = createRagTool;
const tools_1 = require("@langchain/core/tools");
const ragCore_1 = require("../ragCore");
const zod_1 = require("zod");
const ragToolSchema = zod_1.z.object({
    query: zod_1.z.string().describe("The question to ask the policy documents"),
});
function createRagTool() {
    return __awaiter(this, void 0, void 0, function* () {
        const ragChain = yield (0, ragCore_1.createRetrievalChain)();
        return (0, tools_1.tool)((_a) => __awaiter(this, [_a], void 0, function* ({ query }) {
            console.log(`[RAG工具] 查询: ${query}`);
            const result = yield ragChain(query);
            return result.answer;
        }), {
            name: "policy_search",
            description: "查询公司政策文档库",
            schema: ragToolSchema,
        });
    });
}
