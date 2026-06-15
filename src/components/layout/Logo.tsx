import Image from "next/image";
import { LogoProps } from "@/types/Logo";

const Logo = ({ white }: LogoProps) => {
  return (
    <Image src="/logo.png" alt="Logo" width={150} height={150} className="" />
  );
};

export default Logo;
