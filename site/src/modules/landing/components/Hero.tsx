import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
const Hero = () => {
  return (
    <>
      <section className="py-12 flex items-center">
        <section className="wrapper flex pt-28 flex-col items-center gap-12">
          <div className="flex relative flex-col items-center gap-8 w-full text-center">
            <Image
              src="/pattern.png"
              width={500}
              height={500}
              alt="pattern"
              className="absolute size-125 -top-1/4 -z-10 object-contain opacity-15 radial-mask"
            />
            <div className="flex gap-2 -mb-4">
              <span className="flex items-center gap-1">
                <Star className="bg-yellow-600 text-yellow-600 fill-white" />{" "}
                4.5 Avg. Rating
              </span>
              <span className="opacity-80 font-light">
                Trusted by traders worldwide
              </span>
            </div>
            <h1
              className={
                "text-5xl md:text-6xl font-medium leading-tight tracking-tight !max-w-[18ch]"
              }
            >
              <span className="text-secondary font-semibold">AI assisted</span>{" "}
              Trading Journal for Traders
            </h1>
            <ul className="flex flex-col gap-2">
              {[
                "Simple Interface",
                "Reports and Analytics",
                "AI powered Insights",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex text-lg md:text-xl items-center gap-3"
                >
                  <Check className="size-5 text-green-800 inline" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 items-center">
              <Link href={"#contact"} className="w-fit">
                <Button
                  size={"lg"}
                  className="cursor-pointer shadow-lg  px-6! text-lg flex items-center justify-between h-14"
                >
                  <span>Get started for </span>
                  <ArrowRight className="size-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          <Image
            src={"/screen.png"}
            alt="telegram"
            width={800}
            height={800}
            className="shadow-xl hidden md:block w-full max-w-4xl mx-auto border"
          />
          <Image
            src={"/mobile-screen.png"}
            alt="telegram"
            width={800}
            height={800}
            className="shadow-xl md:hidden w-full max-w-80 mx-auto border"
          />
        </section>
      </section>
    </>
  );
};
export default Hero;
