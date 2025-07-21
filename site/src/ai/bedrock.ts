import { BedrockChat } from "@langchain/community/chat_models/bedrock";

export const model_id = "us.meta.llama3-2-3b-instruct-v1:0";

export const llm = new BedrockChat({
  model: model_id,
  region: process.env.BEDROCK_AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
  },
  temperature: 0.3,
  maxTokens: 228,
  maxRetries: 2,
  modelKwargs: {
    stop: ["Human:", "User:", "Assistant:"],
  },
});
