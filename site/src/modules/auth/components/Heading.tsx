import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const Heading = ({ label, center }: { label?: string; center?: boolean }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        center && "justify-center items-center"
      )}
    >
      <Logo />
      <h2 className="h2">{label}</h2>
    </div>
  );
};
export default Heading;
