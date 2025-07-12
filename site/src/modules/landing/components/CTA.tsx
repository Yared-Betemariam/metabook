import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
const CTA = () => {
  return (
    <section className="relative bg-neutral-900 text-white">
      <section
        id="cta"
        className="wrapper pt-28 pb-44 md:pb-36 flex flex-col items-cente justify-cente gap-10 relative overflow-y-hidden"
      >
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <h2 className={"h2"}>Ready to level up your trades</h2>
          <p className="body">
            Have any questions? Contact us when ever you want.
          </p>
          <Link href={"/signin"} className="w-fit">
            <Button
              size={"xl"}
              className="cursor-pointer shadow-lg  px-6! text-lg flex items-center justify-between h-14"
            >
              <span>Get started for free</span>
              <ArrowRight className="size-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </section>
  );
};
export default CTA;
