import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";

/**
 * The school logo. Its black and green artwork needs a light ground, so over
 * dark surfaces (`plated`) it sits on an ivory plate; on light surfaces the
 * plate fades out without shifting layout.
 */
export default function Logo({ onClick, plated = false, className = "" }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${site.name} — home`}
      className={`group block shrink-0 rounded-2xl px-3 py-2 transition-[background-color,box-shadow] duration-700 ease-out-expo ${
        plated ? "bg-paper shadow-[0_10px_30px_-12px_rgb(0_0_0/0.45)]" : "bg-transparent"
      } ${className}`}
    >
      <Image
        src="/images/brand/logo.webp"
        alt=""
        width={1200}
        height={280}
        preload
        sizes="(min-width: 1024px) 240px, (min-width: 640px) 206px, 155px"
        className="h-9 w-auto max-w-none transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] sm:h-12 lg:h-14"
      />
    </Link>
  );
}
