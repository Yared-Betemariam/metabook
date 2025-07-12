import CardWrapper from "@/modules/auth/components/AuthCardWrapper";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Error occurred",
  description: "An error occurred during authentication",
};

const Page = () => {
  return (
    <CardWrapper headerLabel="Authentication Error">
      <p className="text-red-600">
        An error occurred while trying to sign in. Please try again later.
      </p>
      <p className="mt-4">
        If the problem persists, please contact support or try signing in with a
        different method.
      </p>
      <Link
        href="/signin"
        className="mt-6 inline-block text-blue-600 underline"
      >
        Go back to Sign In
      </Link>
    </CardWrapper>
  );
};

export default Page;
