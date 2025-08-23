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
const ollama_1 = require("@langchain/ollama");
const pgvector_1 = require("@langchain/community/vectorstores/pgvector");
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const text_1 = require("langchain/document_loaders/fs/text");
const text_splitter_1 = require("langchain/text_splitter");
// 配置PostgreSQL连接
const config = {
    postgresConnectionOptions: {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "123456",
        database: "document",
    },
    tableName: "documents",
    columns: {
        idColumnName: "id",
        embeddingColumnName: "embedding",
        contentColumnName: "content",
        textColumnName: "text",
        metadataColumnName: "metadata",
    },
};
// 初始化模型和嵌入
const ollama = new ollama_1.Ollama({
    baseUrl: "http://localhost:11434",
    model: "qwen3:0.6b",
});
const embeddings = new ollama_1.OllamaEmbeddings({
    model: "qwen3:0.6b", // 推荐嵌入模型
});
// 创建向量存储
let vectorStore;
function initVectorStore() {
    return __awaiter(this, void 0, void 0, function* () {
        vectorStore = yield pgvector_1.PGVectorStore.initialize(embeddings, config);
    });
}
// 注入新知识（PDF/文本文件）
function injectKnowledge(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let loader;
        if (filePath.endsWith(".pdf")) {
            loader = new pdf_1.PDFLoader(filePath);
        }
        else {
            loader = new text_1.TextLoader(filePath);
        }
        const rawDocs = yield loader.load();
        // 根据知识类型调整分块策略
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docs = yield splitter.splitDocuments(rawDocs);
        yield vectorStore.addDocuments(docs);
        console.log(`✅ 成功注入 ${docs.length} 个知识块`);
    });
}
// 执行RAG查询
function runRAG(query) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. 相似性检索
        const results = yield vectorStore.similaritySearch(query, 3);
        // 只搜索特定类别的文档
        // await vectorStore.similaritySearch(query, 3, { category: "technical" });
        // 混合检索
        // const results = await vectorStore.hybridSearch(query, 3);
        // 2. 构建提示词
        const context = results.map(r => r.pageContent).join("\n---\n");
        const prompt = `
    请基于以下上下文回答用户问题：
    ${context}
    
    用户问题：${query}
    要求：答案必须基于上下文，不允许编造信息。
  `;
        // 3. 调用模型生成
        return yield ollama.invoke(prompt);
    });
}
// 初始化系统
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield initVectorStore();
            // 注入初始知识（可选）
            // await injectKnowledge("./initial_data.pdf");
            // 示例查询
            const response = yield runRAG("LangChain的主要优势是什么？");
            console.log("🤖 回答：", response);
        }
        catch (error) {
            console.error("系统错误:", error);
        }
    });
}
main();
