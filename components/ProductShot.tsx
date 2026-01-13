import Image from "next/image";
import { BrowserFrame } from "./BrowserFrame";

interface ProductShotProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ProductShot({ 
  src, 
  alt, 
  width = 1200, 
  height = 800,
  priority = false 
}: ProductShotProps) {
  return (
    <BrowserFrame>
      <div className="relative w-full">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          priority={priority}
        />
      </div>
    </BrowserFrame>
  );
}

