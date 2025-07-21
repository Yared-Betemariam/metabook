import { llm } from "@/ai/bedrock";
import { ChatMessage } from "@/types";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const chatsRouter = createTRPCRouter({
  chat: protectedProcedure
    .input(
      z.object({
        messages: z.string().optional(),
        message: z.string(),
      })
    )
    .mutation(async (opts) => {
      const parsed_messages: ChatMessage[] = JSON.parse(
        opts.input.messages || "[]"
      );

      console.log(parsed_messages);

      parsed_messages.push({
        author: "user",
        content: opts.input.message,
      });

      const res = await llm.invoke(
        parsed_messages.map((item) => ({
          role:
            item.author == "user"
              ? "user"
              : item.author == "metabook"
              ? "system"
              : "assistant",
          content: item.content,
        }))
      );

      return {
        success: true,
        message: "Chat successfully updated!",
        data: res.content.toString(),
      };
    }),
});
