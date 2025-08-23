import { Ollama ,OllamaEmbeddings} from "@langchain/ollama";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PoolConfig } from "pg";

// 配置PostgreSQL连接
const config: PoolConfig = {
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
};

// 初始化本地LLM
export const model = new Ollama({
  baseUrl: process.env.OLLAMA_BASE_URL,
  model: process.env.OLLAMA_MODEL || "llama3",
});

// 初始化嵌入模型
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: process.env.OLLAMA_BASE_URL,
});

// 初始化向量存储
export async function initVectorStore() {
  return PGVectorStore.initialize(embeddings, {
    postgresConnectionOptions: config,
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
    tableName: "company_policies",
  });
}

// 创建检索链
export async function createRetrievalChain() {
  const vectorStore = await initVectorStore();
  const retriever = vectorStore.asRetriever(3); // 获取top3结果

  return async (query: string) => {
    try {
      const docs = await retriever.invoke(query);
      const context = docs.map(d => d.pageContent).join("\n\n");
      
      // 使用本地LLM生成回答
      const response = await model.invoke(
        `请基于公司政策回答用户问题：
        <政策上下文>
        ${context}
        </政策上下文>
        
        用户问题：${query}
        
        回答要求：
        1. 如政策未包含则回答"未找到相关信息"
        2. 回答简洁准确`
      );
      
      return {
        answer: response,
        sources: docs.map(d => d.metadata.source || "未知来源")
      };
    } catch (error) {
      console.error("RAG检索失败:", error);
      return { answer: "知识检索服务暂时不可用" };
    }
  };
}