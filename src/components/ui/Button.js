import Link from "next/link";
import { ArrowIcon } from "./Icons";

const VARIANTS = {
  ivory: "bg-ivory text-ink",
  ink: "bg-ink text-ivory",
  ember: "bg-ember text-ivory",
  outline: "border border-current text-current",
};

/**
 * Pill button whose label rolls up on hover. Renders a Next <Link> for
 * internal paths and a plain <a> for tel:, mailto: and external URLs.
 */
export default function Button({ href, children, variant = "ink", icon = <ArrowIcon />, className = "", ...props }) {
  const classes = `group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full py-2 pl-6 pr-2 text-sm font-medium tracking-wide transition-transform duration-500 ease-out-expo active:scale-[0.97] ${VARIANTS[variant]} ${className}`;

  const content = (
    <>
      <span className="relative block overflow-hidden py-1.5">
        <span className="block transition-transform duration-700 ease-out-expo group-hover/btn:-translate-y-full">
          {children}
        </span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full py-1.5 transition-transform duration-700 ease-out-expo group-hover/btn:translate-y-0">
          {children}
        </span>
      </span>
      <span className="grid size-9 place-items-center rounded-full bg-current/10 transition-transform duration-700 ease-out-expo group-hover/btn:rotate-45">
        {icon}
      </span>
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  );
}
