import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  black?: boolean;
  logo?: boolean;
  className?: string;
}

const Logo = ({ className, logo }: Props) => {
  return (
    <Link href="/" className={cn("w-fit", className)}>
      {logo ? (
        <Image
          src="/logo.png"
          alt="Metabook Logo"
          width={80}
          height={80}
          className="w-10"
        />
      ) : (
        <>
          <Image
            src="/logo_wide.png"
            alt="Metabook Logo"
            width={140}
            height={140}
            className="w-34 md:w-40"
          />
        </>
      )}
    </Link>
  );
};
export default Logo;
