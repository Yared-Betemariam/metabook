import CardWrapper from "@/modules/auth/components/AuthCardWrapper";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Signin",
  description: "Signin to your account",
};

const Page = () => {
  return (
    <CardWrapper headerLabel="Sign in to MetaBook" showSocial>
      <p>
        <span>By signing in you will be agreeing to the </span>
        <Link target="_blank" href={"#"} className="underline text-blue-950/80">
          Terms of services
        </Link>{" "}
        <span>and </span>
        <Link target="_blank" href={"#"} className="underline text-blue-950/80">
          Privacy policys
        </Link>
      </p>
    </CardWrapper>
  );
};

export default Page;
