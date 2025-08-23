import {PGVectorStore} from '@langchain/community/vectorstores/pgvector';
import { OllamaEmbeddings } from '@langchain/ollama';
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
 // model: 'gpt2-large',
 // baseUrl: 'http://localhost:5000',
    baseUrl: 'http://localhost:11434', // 替换为你的Ollama服务器地址
    model: 'qwen3:0.6b', // 替换为你的模型名称
});

const vectorStore = new PGVectorStore(embeddings, {
    pool,
    tableName: 'documents'});


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

ingestData()

