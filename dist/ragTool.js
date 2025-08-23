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
exports.createRetrievalChain = createRetrievalChain;
const pgvector_1 = require("@langchain/community/vectorstores/pgvector");
const ollama_1 = require("@langchain/ollama");
const text_1 = require("langchain/document_loaders/fs/text");
const text_splitter_1 = require("langchain/text_splitter");
const pg_1 = require("pg");
//const mdLoader = new UnstructuredLoader('knowledge_base/vacation-policy.md')
// 配置数据库
const pool = new pg_1.Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'document',
});
const embeddings = new ollama_1.OllamaEmbeddings({
    baseUrl: 'http://localhost:11434',
    model: 'qwen3:0.6b',
});
const vectorStore = new pgvector_1.PGVectorStore(embeddings, {
    pool,
    tableName: 'documents'
});
// 初始化语言模型并导出
exports.model = new ollama_1.Ollama({
    baseUrl: "http://localhost:11434",
    model: "qwen3:0.6b",
});
/**
 * 创建检索链
 */
function createRetrievalChain(_a) {
    return __awaiter(this, arguments, void 0, function* ({ model }) {
        const retriever = vectorStore.asRetriever(3); // 检索top3结果
        // 返回一个带有 invoke 方法的对象
        return {
            invoke: (input) => __awaiter(this, void 0, void 0, function* () {
                const query = input.input;
                const docs = yield retriever.invoke(query);
                const context = docs.map(d => d.pageContent).join("\n\n");
                const response = yield model.invoke(`请基于以下公司政策回答问题：
        <政策上下文>
        ${context}
        </政策上下文>
        
        用户问题：${query}
        
        回答要求：
        1. 直接回答问题，不要复述政策
        2. 回答简洁专业
        3. 如政策未包含则回答"未找到相关政策"
        `);
                return { answer: response, sources: docs };
            })
        };
    });
}
function ingestData() {
    return __awaiter(this, void 0, void 0, function* () {
        // 向数据库中添加文档
        // const loader = new DirectoryLoader('knowledge_base',{'.txt':(path) => new TextLoader(path)})
        const loader = new text_1.TextLoader('knowledge_base/test.txt');
        // const loader = new CSVLoader('knowledge_base/learn.csv')
        const docs = yield loader.load();
        // 切分文档
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter();
        const splittedDocs = yield splitter.splitDocuments(docs);
        // 向向量数据库中添加向量
        yield vectorStore.addDocuments(splittedDocs);
        console.log('文档添加完成');
        yield pool.end();
        console.log('数据库连接已关闭');
    });
}
// ingestData()
