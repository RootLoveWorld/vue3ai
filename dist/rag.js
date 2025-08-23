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
    // model: 'gpt2-large',
    // baseUrl: 'http://localhost:5000',
    baseUrl: 'http://localhost:11434', // 替换为你的Ollama服务器地址
    model: 'qwen3:0.6b', // 替换为你的模型名称
});
const vectorStore = new pgvector_1.PGVectorStore(embeddings, {
    pool,
    tableName: 'documents'
});
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
ingestData();
