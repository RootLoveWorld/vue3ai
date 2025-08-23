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
// add model
const ollama_1 = require("@langchain/ollama");
// define Message
const messages_1 = require("@langchain/core/messages");
// service
const node_http_1 = require("node:http");
const chatOllama = new ollama_1.ChatOllama({
    model: 'qwen3:0.6b',
    // temperature: 0.5,
    // top_p: 0.9,
    // frequency_penalty: 0.5,
    // presence_penalty: 0.5
    // top_k: 50
});
const app = (0, node_http_1.createServer)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    try {
        const aiRes = yield chatOllama.invoke([
            ['system', 'You are a helpful assistant.'],
            new messages_1.HumanMessage('你好，我是一名前端开发,正在学习LLM模型。请你介绍一下自己？'),
        ]);
        res.end(aiRes.content);
    }
    catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        console.error(error);
        res.end('Error occurred while processing the request');
    }
}));
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
