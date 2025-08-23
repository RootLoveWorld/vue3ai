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
const ollama_1 = require("@langchain/ollama");
const prompts_1 = require("@langchain/core/prompts");
function generateDescription() {
    return __awaiter(this, void 0, void 0, function* () {
        // init chatOllama
        const chatOllama = new ollama_1.ChatOllama({
            baseUrl: 'http://localhost:11434', // 替换为你的Ollama服务器地址
            model: 'qwen3:0.6b', // 替换为你的模型名称
        });
        // create variables Template
        const promptTemplate = prompts_1.ChatPromptTemplate.fromMessages([
            ['system', '你是一位营销专家，你的任务是为产品生成独特吸引人的中文描述'],
            ['human', '产品名称：{productName}，产品特点：{productFeatures}'],
        ]);
        // use pipe link promptTemplate and chatOllama to chain
        const promptChain = promptTemplate.pipe(chatOllama);
        // execute chain with input variables
        const res = yield promptChain.invoke({
            productName: 'AI 大模型',
            productFeatures: '多模态、多领域、多场景、多任务学习能力',
        });
        // get description from output message
        const description = res.content;
        return description;
    });
}
generateDescription().then(description => {
    console.log(description);
});
