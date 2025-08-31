
import { OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Pool } from 'pg';


//const mdLoader = new UnstructuredLoader('knowledge_base/vacation-policy.md')


// 配置数据库
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'document',
});

const embeddings = new OllamaEmbeddings({
 // model: 'nomic-embed-text:latest',
 // baseUrl: 'http://localhost:11434',
    baseUrl: 'http://localhost:11434', // 替换为你的Ollama服务器地址
    model: 'qwen3:0.6b', // 替换为你的模型名称
});

// RAG

const text = "我是高伟，加油我正在学习AI，帮助我";

async function run() {
    // 存储
    const vectorStore = await MemoryVectorStore.fromDocuments([
        {
            pageContent: text,
            metadata: {
                name:"学习AI"
            },
        }
    ], embeddings);


    // 检索向量
    const vector = await embeddings.embedQuery('高伟在做什么？')

    // 检索内容
    const results = await vectorStore.similaritySearchVectorWithScore(vector, 1);

    console.log(results);

}



run()





