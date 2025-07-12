"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

const Features = () => {
  const miniCards = [
    {
      id: 1,
      image: "/feature-1.png",
      title: "Managing Trades",
      desc: "Manage your trades with ease and efficiency. Track orders, monitor performance, and optimize your trading strategies.",
    },
    {
      id: 2,
      image: "/feature-2.png",
      title: "AI Assistance with MetabookAI",
      desc: "Leverage the power of AI to enhance your trading decisions. Get insights, predictions, and recommendations tailored to your trading style.",
    },
  ];

  return (
    <section id="features" className="wrapper flex flex-col gap-12 py-28 ">
      <div className="flex flex-col gap-4">
        <h2 className={"h2"}>
          Metabook <span className="text-primary brightness-75">Features</span>
        </h2>
        <p className="body">
          Explore the powerful features of Metabook that enhance your trading
          experience.
        </p>
      </div>
      <div className="grid grid-cols-1 w-full md:grid-cols-2 divide-x divide-y border shadow-lg">
        {miniCards.map((item, i) => (
          <div
            key={item.title}
            className={cn(
              "p-8 px-10 overflow-hidden flex flex-col gap-4 flex-1 justify-center relative",
              i % 2 == 0 ? "pt-[19rem]" : "pb-[19rem]"
            )}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={400}
              className={cn(
                "w-[21rem] absolute left-1/2 bg-red-800 border -translate-x-1/2",
                i % 2 == 0 ? "-top-[0rem]" : "-bottom-[0rem]"
              )}
            />
            <p className={"h3"}>{item.title}</p>
            <p className="body">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Features;
