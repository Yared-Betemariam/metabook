import TradeComponent from "@/modules/trades/components/TradeComponent";
import { TradeState, tradeStateList } from "@/types";
import Link from "next/link";

type Props = {
  params: {
    state: string;
  };
};

const Page = async ({ params }: Props) => {
  const { state } = await params;

  if (!tradeStateList.includes(state)) {
    return (
      <p className="my-auto mx-auto text-muted-foreground max-w-md">
        Invalid url. Please click{" "}
        <Link
          href={"/dashboard"}
          className="underline underline-offset-2 text-blue-700"
        >
          here
        </Link>{" "}
        to go to the dashboard.
      </p>
    );
  }

  return <TradeComponent state={state as TradeState} />;
};

export default Page;
