import { ChatOllama } from '@langchain/ollama';
import { ChatPromptTemplate } from '@langchain/core/prompts';

async function generateDescription() {
    // init chatOllama
    const chatOllama = new ChatOllama({
        baseUrl: 'http://localhost:11434', // 替换为你的Ollama服务器地址
        model: 'qwen3:0.6b', // 替换为你的模型名称
    });
    // create variables Template
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ['system','你是一位营销专家，你的任务是为产品生成独特吸引人的中文描述'],
        ['human','产品名称：{productName}，产品特点：{productFeatures}'],
    ]);

    // use pipe link promptTemplate and chatOllama to chain
    const promptChain = promptTemplate.pipe(chatOllama);

    // execute chain with input variables
    const res = await promptChain.invoke({
        productName: 'AI 大模型',
        productFeatures: '多模态、多领域、多场景、多任务学习能力',
    });
    // get description from output message
    const description = res.content;

    return description;
}


generateDescription().then(description => {
    console.log(description);
});
