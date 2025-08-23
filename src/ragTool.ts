import {PGVectorStore} from '@langchain/community/vectorstores/pgvector';
import { OllamaEmbeddings , Ollama } from '@langchain/ollama';
import {DirectoryLoader} from 'langchain/document_loaders/fs/directory';
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import {UnstructuredLoader} from  '@langchain/community/document_loaders/fs/unstructured'
import {PDFLoader} from  '@langchain/community/document_loaders/fs/pdf' 
import {TextLoader} from 'langchain/document_loaders/fs/text';
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter';
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
    baseUrl: 'http://localhost:11434',
    model: 'qwen3:0.6b',
});

const vectorStore = new PGVectorStore(embeddings, {
    pool,
    tableName: 'documents'
});

// 初始化语言模型并导出
export const model = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "qwen3:0.6b",
});

/**
 * 创建检索链
 */

export async function createRetrievalChain({model}:{ model : Ollama }) {
  
  const retriever = vectorStore.asRetriever(3); // 检索top3结果

  // 返回一个带有 invoke 方法的对象
  return {
    invoke: async (input: { input: string }) => {
      const query = input.input;
      const docs = await retriever.invoke(query);
      const context = docs.map(d => d.pageContent).join("\n\n");
      
      const response = await model.invoke(
        `请基于以下公司政策回答问题：
        <政策上下文>
        ${context}
        </政策上下文>
        
        用户问题：${query}
        
        回答要求：
        1. 直接回答问题，不要复述政策
        2. 回答简洁专业
        3. 如政策未包含则回答"未找到相关政策"
        `
      );
      
      return { answer: response, sources: docs };
    }
}
}



async function ingestData(){
    // 向数据库中添加文档
    // const loader = new DirectoryLoader('knowledge_base',{'.txt':(path) => new TextLoader(path)})
    const loader = new TextLoader('knowledge_base/test.txt')
    // const loader = new CSVLoader('knowledge_base/learn.csv')
    const docs = await loader.load()
    // 切分文档
    const splitter = new RecursiveCharacterTextSplitter()
    const splittedDocs = await splitter.splitDocuments(docs)
    // 向向量数据库中添加向量
    await vectorStore.addDocuments(splittedDocs)
    console.log('文档添加完成')


    await  pool.end()
    console.log('数据库连接已关闭')
}

// ingestData()

