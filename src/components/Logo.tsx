"use client";

import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
  alt?: string;
}

export default function Logo({ 
  size = 40, 
  className = "", 
  alt = "Out Snake the Jake Logo" 
}: LogoProps) {
  return (
    <Image
      src="/file.png"
      alt={alt}
      width={size}
      height={size}
      className={`${className}`}
      priority
    />
  );
}
