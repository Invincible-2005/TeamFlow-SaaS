import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

function BrandLogo({
  className,
  children,
  viewBox = "0 0 24 24",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={viewBox}
      fill="currentColor"
      aria-hidden
      className={cn(className)}
      {...props}
    >
      {children}
    </svg>
  )
}

export function Bolt(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo {...props}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </BrandLogo>
  )
}

export function VercelFull(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo {...props}>
      <path d="M12 2L2 22h20L12 2z" />
    </BrandLogo>
  )
}

export function SupabaseFull(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo viewBox="0 0 109 113" {...props}>
      <path d="M63.7 110.3c-3.4 4.2-10.3.6-9.4-4.8l8.7-51.4c1.1-6.5 9.5-7.9 12.5-2.1l16.6 31.2c2.8 5.3-.2 11.8-6.2 12.7L63.7 110.3z" />
      <path d="M45.3 2.7c3.4-4.2 10.3-.6 9.4 4.8L46 58.9c-1.1 6.5-9.5 7.9-12.5 2.1L16.9 29.8c-2.8-5.3.2-11.8 6.2-12.7l22.2-14.4z" />
    </BrandLogo>
  )
}

export function Hulu(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo viewBox="0 0 88 24" {...props}>
      <path d="M8.4 4.2h3.2v15.6H8.4V4.2zm12 0c4.8 0 8.4 3.4 8.4 7.8s-3.6 7.8-8.4 7.8c-2.2 0-4-.8-5.2-2.2v2h-3.2V4.2h3.2v9.4c1.2-1.4 3-2.2 5.2-2.2zm0 3c-2.6 0-4.6 2-4.6 4.8s2 4.8 4.6 4.8 4.6-2 4.6-4.8-2-4.8-4.6-4.8zM44.2 4.2h3.2l5.4 15.6h-3.6l-1-3h-5.4l-1 3h-3.6l5.4-15.6zm2.8 9.2-1.8-5.2-1.8 5.2h3.6zM64 4.2h3.2v15.6H64V4.2z" />
    </BrandLogo>
  )
}

export function Spotify(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo {...props}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 14.4c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.2-.8-.5s.2-.7.5-.8c4.1-.9 7.6-.5 10.5 1.2.3.2.4.6.2.9zm1.2-2.7c-.2.4-.7.5-1 .3-2.9-1.8-7.2-2.3-10.6-1.3-.5.1-1-.3-1.1-.8s.3-1 .8-1.1c3.9-1.1 8.6-.5 11.9 1.5.4.2.5.7.3 1zm.1-2.8C14.7 8.1 8.6 7.9 5.2 9c-.5.2-1.1-.1-1.3-.6s.1-1.1.6-1.3c3.9-1.2 10.5-1 14.6 1.3.5.3.7.9.4 1.4s-.9.7-1.4.4z" />
    </BrandLogo>
  )
}

export function FirebaseFull(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo viewBox="0 0 24 24" {...props}>
      <path d="M5.3 18.7 2 22.2l10.6 1.2-7.3-4.7zm16.4-12.3L12.7 1.5 1.4 15.2l4.6-.2 6.7-6.3 3.4 12.1 5.6-12.6z" />
    </BrandLogo>
  )
}

export function Beacon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo {...props}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
    </BrandLogo>
  )
}

export function Claude(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandLogo viewBox="0 0 24 24" {...props}>
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3zm0 2.2 5.5 3.1v6.4L12 17.8 6.5 14.7V8.3L12 5.2z" />
    </BrandLogo>
  )
}
