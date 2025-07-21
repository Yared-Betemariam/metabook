import { tradingAssistantPrompt } from "@/ai/utils";
import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useUser } from "@/modules/auth/hooks";
import { useCalendarTrades } from "@/modules/trades/hooks";
import { trpc } from "@/trpc/client";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMessageStore } from "../store";
import Message from "./Message";

const Chat = () => {
  const { data: trades_data } = useCalendarTrades();
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [lineHeight, setLineHeight] = useState(24);

  const { messages, clearMessages, addMessages, removeLastMessage } =
    useMessageStore();

  const { mutate, isPending } = trpc.chats.chat.useMutation({
    onError: () => {
      toast.error("Something went wrong! Try again");

      removeLastMessage();
    },
    onMutate: (data) => {
      addMessages({ author: "user", content: data.message });
    },
    onSuccess: ({ data }) => {
      addMessages({ author: "ai", content: data });
    },
  });

  const send_message = () => {
    if (!input || isPending) return;

    if (messages.length <= 0) {
      addMessages({
        author: "metabook",
        content: tradingAssistantPrompt({
          trades_json: JSON.stringify(trades_data?.data, null, 2),
        }),
      });
    }

    mutate({
      messages: JSON.stringify(messages),
      message: input,
    });

    setInput("");
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // set base line height
      const computed = window.getComputedStyle(textarea);
      setLineHeight(parseInt(computed.lineHeight || "24"));
    }
  }, []);

  // textarea height adjustment
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = lineHeight * 5;

      textarea.style.height = `${Math.min(scrollHeight, maxHeight) + 1}px`;
    }
  }, [input, lineHeight]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, scrollRef]);

  return (
    <div className="h-full flex-1 flex flex-col w-full">
      {!messages.length ? (
        <div className="flex flex-1 items-center justify-center flex-col">
          <Image
            src={"/ai.png"}
            width={100}
            height={100}
            alt="AI"
            className={cn("w-32")}
          />

          <h2 className="text-2xl font-medium tracking-tight mb-1">
            Hi {user?.name || "there"}! I&apos;m Metabi
          </h2>
          <p className="opacity-70 text-sm">MetaBook&apos;s AI Assistance</p>
        </div>
      ) : (
        <>
          <span className="flex-1" />
          <ScrollAreaWrapper
            scrollRef={scrollRef}
            className="px-4 max-h-[calc(100vh-(3rem+8rem))] overflow-y-auto flex flex-col"
          >
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            {isPending && (
              <Message
                isLoading={true}
                message={{ author: "ai", content: "" }}
              />
            )}
          </ScrollAreaWrapper>
        </>
      )}

      {/* Chat input */}
      <div className="p-4 pt-0">
        <div className="bg-white drop-shadow-lg flex flex-col relative min-h-16 h-full">
          <Textarea
            placeholder="Ask Metabi"
            className="w-full resize-none px-3.5 py-2.5 focus:ring-0 transition focus-visible:ring-0 shadow-none overflow-auto min-h-10 border-none"
            rows={1}
            ref={textareaRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && input) {
                e.preventDefault();

                send_message();
              }
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex justify-end p-2 pt-0 gap-2 items-center">
            <Button
              disabled={!messages || isPending || !messages.length}
              onClick={() => clearMessages()}
              variant={"outline"}
              size={"sm"}
            >
              clear
            </Button>
            <Button
              onClick={() => {
                send_message();
              }}
              disabled={!messages || isPending || !input}
              size={"sm"}
              className="aspect-square size-8 grid place-content-center"
            >
              <ArrowUp className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
