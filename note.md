
## 编译完后dist目录下执行
- node dist/prompt.js


## 启动 ollama
- ollama run qwen3:0.6b



  # 文档存储
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  text TEXT,
  embedding VECTOR(1024),  -- 维度需匹配您的嵌入模型
  metadata JSONB
);

## 确保embedding列的维度与您使用的嵌入模型输出维度一致。

