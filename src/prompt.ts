// add model
import  { ChatOllama } from '@langchain/ollama';
// define Message
import {HumanMessage} from '@langchain/core/messages';

// service
import { createServer } from 'node:http';

const chatOllama = new ChatOllama(
    {
        model: 'qwen3:0.6b',
        // temperature: 0.5,
        // top_p: 0.9,
        // frequency_penalty: 0.5,
        // presence_penalty: 0.5
        // top_k: 50
    }
);



const app = createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    
    try {
        const aiRes = await chatOllama.invoke(
            [
                ['system','You are a helpful assistant.'],
            new HumanMessage('你好，我是一名前端开发,正在学习LLM模型。请你介绍一下自己？'),    
            ]
        )


        res.end(aiRes.content)
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        console.error(error);
        res.end('Error occurred while processing the request');
    }



});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});