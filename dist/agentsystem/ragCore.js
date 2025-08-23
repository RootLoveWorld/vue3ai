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
exports.model = void 0;
exports.initVectorStore = initVectorStore;
exports.createRetrievalChain = createRetrievalChain;
const ollama_1 = require("@langchain/ollama");
const pgvector_1 = require("@langchain/community/vectorstores/pgvector");
// 配置PostgreSQL连接
const config = {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
};
// 初始化本地LLM
exports.model = new ollama_1.Ollama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: process.env.OLLAMA_MODEL || "llama3",
});
// 初始化嵌入模型
const embeddings = new ollama_1.OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: process.env.OLLAMA_BASE_URL,
});
// 初始化向量存储
function initVectorStore() {
    return __awaiter(this, void 0, void 0, function* () {
        return pgvector_1.PGVectorStore.initialize(embeddings, {
            postgresConnectionOptions: config,
            columns: {
                idColumnName: "id",
                vectorColumnName: "vector",
                contentColumnName: "content",
                metadataColumnName: "metadata",
            },
            tableName: "company_policies",
        });
    });
}
// 创建检索链
function createRetrievalChain() {
    return __awaiter(this, void 0, void 0, function* () {
        const vectorStore = yield initVectorStore();
        const retriever = vectorStore.asRetriever(3); // 获取top3结果
        return (query) => __awaiter(this, void 0, void 0, function* () {
            try {
                const docs = yield retriever.invoke(query);
                const context = docs.map(d => d.pageContent).join("\n\n");
                // 使用本地LLM生成回答
                const response = yield exports.model.invoke(`请基于公司政策回答用户问题：
        <政策上下文>
        ${context}
        </政策上下文>
        
        用户问题：${query}
        
        回答要求：
        1. 如政策未包含则回答"未找到相关信息"
        2. 回答简洁准确`);
                return {
                    answer: response,
                    sources: docs.map(d => d.metadata.source || "未知来源")
                };
            }
            catch (error) {
                console.error("RAG检索失败:", error);
                return { answer: "知识检索服务暂时不可用" };
            }
        });
    });
}
