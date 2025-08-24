const express = require('express');
const path = require('path');
const esbuild = require('esbuild');
const fs = require('fs');


const app = express();
const port = 3000;

// 中间件设计 AOP
app.get('/',(req,res,next) =>{
    res.sendFile(path.resolve(__dirname,'./index.html'))
})


// 需要注意 express 版本
/*
app.get(/^\/(.*)\.js$/, (req,res)=>{
    try{
    const reqPath = req.path;
    const file = fs.readFileSync(path.resolve(__dirname,`.${reqPath}`),'utf-8');

    // TODO:处理逻辑
    // 1. 编译处理（esbuild\swc\babel\rollup）
    // 2. 插件处理
    // 3. 产物处理、压缩、混淆
    res.type('js')
    res.send(file); 
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error')
    }
})
*/


app.get(/^\/(.*)\.ts$/,async (req,res)=>{
    try{
    const reqPath = req.path;
    const file = fs.readFileSync(path.resolve(__dirname,`.${reqPath}`),'utf-8');


    // TODO:处理逻辑
    // 1. 编译处理（esbuild\swc\babel\rollup）
    // 2. 插件处理
    // 3. 产物处理、压缩、混淆
    // 4. 优化（编译内容缓存、增量编译、HMR）
    // 打包使用rollup 【ES5及以下不支持、】
    const result = await esbuild.transform(file,{
        loader:'ts',
        minify:true,
        format:'esm',
        target:'es6',
        sourcemap:true
    })
    console.log(result);

    
    res.type('js')
    res.send(result.code); //file //result.code
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error')
    }
   // res.send('Miracle Hello')
})
 
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})