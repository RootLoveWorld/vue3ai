import { Ollama ,OllamaEmbeddings} from "@langchain/ollama";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";

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
const ollama = new Ollama({
  baseUrl: "http://localhost:11434", 
  model: "qwen3:0.6b",
});

const embeddings = new OllamaEmbeddings({
  model: "qwen3:0.6b", // 推荐嵌入模型
});

// 创建向量存储
let vectorStore: PGVectorStore;

async function initVectorStore() {
  vectorStore = await PGVectorStore.initialize(
    embeddings,
    config
  );
}

// 注入新知识（PDF/文本文件）
async function injectKnowledge(filePath: string) {
  let loader;
  
  if (filePath.endsWith(".pdf")) {
    loader = new PDFLoader(filePath);
  } else {
    loader = new TextLoader(filePath);
  }

  const rawDocs = await loader.load();
  // 根据知识类型调整分块策略
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const docs = await splitter.splitDocuments(rawDocs);
  
  await vectorStore.addDocuments(docs);
  console.log(`✅ 成功注入 ${docs.length} 个知识块`);
}

// 执行RAG查询
async function runRAG(query: string) {
  // 1. 相似性检索
   const results = await vectorStore.similaritySearch(query, 3);

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
  return await ollama.invoke(prompt);
}

// 初始化系统
async function main() {
  try {
    await initVectorStore();
    
    // 注入初始知识（可选）
    // await injectKnowledge("./initial_data.pdf");
    
    // 示例查询
    const response = await runRAG("LangChain的主要优势是什么？");
    console.log("🤖 回答：", response);
  } catch (error) {
    console.error("系统错误:", error);
  }
}

main();