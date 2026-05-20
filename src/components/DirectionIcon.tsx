import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type DirectionIconProps = SVGProps<SVGSVGElement> & {
  id: string;
};

const iconTone = {
  fill: "fill-slate-50/95 dark:fill-slate-50/10",
  stroke: "stroke-slate-950/90 dark:stroke-slate-50",
  soft: "stroke-slate-400 dark:stroke-slate-500",
};

const accentTone: Record<string, string> = {
  "full-stack": "stroke-blue-600 dark:stroke-blue-300",
  "cloud-computing": "stroke-sky-500 dark:stroke-sky-300",
  "ai-infra": "stroke-teal-500 dark:stroke-teal-300",
  "creative-design": "stroke-pink-500 dark:stroke-pink-300",
  agent: "stroke-violet-500 dark:stroke-violet-300",
  startup: "stroke-orange-500 dark:stroke-orange-300",
  "finance-quant": "stroke-emerald-600 dark:stroke-emerald-300",
};

export function DirectionIcon({ id, className, ...props }: DirectionIconProps) {
  const accent = accentTone[id] ?? "stroke-sky-500 dark:stroke-sky-300";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn("overflow-visible", className)}
      {...props}
    >
      {id === "full-stack" && (
        <>
          <rect className={cn(iconTone.fill, iconTone.soft)} x="106" y="130" width="300" height="210" rx="34" strokeWidth="12" />
          <path className={iconTone.soft} d="M106 184h300" strokeWidth="12" />
          <path className={accent} d="M218 238l-36 32 36 32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18" />
          <path className={accent} d="M294 238l36 32-36 32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18" />
          <path className={iconTone.stroke} d="M270 226l-28 88" strokeLinecap="round" strokeWidth="16" />
          <path className={iconTone.soft} d="M176 374h160" strokeLinecap="round" strokeWidth="14" />
          <path className={iconTone.soft} d="M256 340v56" strokeLinecap="round" strokeWidth="14" />
          <circle className={accent} cx="176" cy="374" r="14" strokeWidth="12" />
          <circle className={accent} cx="256" cy="396" r="14" strokeWidth="12" />
          <circle className={accent} cx="336" cy="374" r="14" strokeWidth="12" />
        </>
      )}

      {id === "cloud-computing" && (
        <>
          <path className={cn(iconTone.fill, iconTone.soft)} d="M170 318c-42 0-74-29-74-67 0-35 28-64 65-67 19-42 60-68 109-68 63 0 113 45 121 104 31 9 53 36 53 68 0 39-32 70-74 70H170z" strokeWidth="12" strokeLinejoin="round" />
          <path className={accent} d="M174 378h164" strokeLinecap="round" strokeWidth="14" />
          <path className={accent} d="M256 318v78" strokeLinecap="round" strokeWidth="14" />
          <circle className={iconTone.stroke} cx="174" cy="378" r="16" strokeWidth="12" />
          <circle className={iconTone.stroke} cx="256" cy="396" r="16" strokeWidth="12" />
          <circle className={iconTone.stroke} cx="338" cy="378" r="16" strokeWidth="12" />
        </>
      )}

      {id === "ai-infra" && (
        <>
          <rect className={cn(iconTone.fill, iconTone.soft)} x="142" y="126" width="228" height="228" rx="42" strokeWidth="12" />
          <rect className={iconTone.stroke} x="192" y="176" width="128" height="128" rx="26" strokeWidth="14" />
          <path className={accent} d="M222 240c18-26 50-26 68 0-18 26-50 26-68 0z" strokeLinejoin="round" strokeWidth="14" />
          <path className={accent} d="M256 214v52" strokeLinecap="round" strokeWidth="14" />
          <path className={iconTone.soft} d="M188 96v46M256 96v46M324 96v46M188 354v46M256 354v46M324 354v46M112 188h46M112 256h46M112 324h46M354 188h46M354 256h46M354 324h46" strokeLinecap="round" strokeWidth="12" />
        </>
      )}

      {id === "creative-design" && (
        <>
          <path className={cn(iconTone.fill, iconTone.soft)} d="M252 110c-82 0-146 56-146 128 0 78 64 132 142 132h22c20 0 29-24 15-38-10-10-2-28 14-28h38c43 0 69-30 69-72 0-70-66-122-154-122z" strokeWidth="12" strokeLinejoin="round" />
          <circle className={accent} cx="178" cy="226" r="20" strokeWidth="12" />
          <circle className={iconTone.stroke} cx="242" cy="180" r="20" strokeWidth="12" />
          <circle className={accent} cx="314" cy="198" r="20" strokeWidth="12" />
          <path className={iconTone.stroke} d="M176 404c72-76 152-106 240-90" strokeLinecap="round" strokeWidth="18" />
          <path className={accent} d="M284 344l104-130" strokeLinecap="round" strokeWidth="22" />
          <path className={iconTone.soft} d="M248 380l48-54 34 34-54 48c-20 18-48-8-28-28z" strokeLinejoin="round" strokeWidth="12" />
        </>
      )}

      {id === "agent" && (
        <>
          <rect className={cn(iconTone.fill, iconTone.soft)} x="156" y="132" width="200" height="200" rx="56" strokeWidth="12" />
          <path className={accent} d="M256 100v42" strokeLinecap="round" strokeWidth="14" />
          <circle className={accent} cx="256" cy="84" r="14" strokeWidth="10" />
          <circle className={iconTone.stroke} cx="222" cy="228" r="9" strokeWidth="10" />
          <circle className={iconTone.stroke} cx="290" cy="228" r="9" strokeWidth="10" />
          <path className={accent} d="M230 270c17 16 35 16 52 0" strokeLinecap="round" strokeWidth="14" />
          <path className={iconTone.soft} d="M118 354h276" strokeLinecap="round" strokeWidth="14" />
          <circle className={cn(iconTone.fill, accent)} cx="118" cy="354" r="30" strokeWidth="12" />
          <circle className={cn(iconTone.fill, accent)} cx="256" cy="354" r="30" strokeWidth="12" />
          <circle className={cn(iconTone.fill, accent)} cx="394" cy="354" r="30" strokeWidth="12" />
        </>
      )}

      {id === "startup" && (
        <>
          <path className={cn(iconTone.fill, iconTone.soft)} d="M256 102c70 46 116 113 132 199l-76 76-177-177 76-76c15-15 30-22 45-22z" strokeWidth="12" strokeLinejoin="round" />
          <circle className={accent} cx="286" cy="210" r="30" strokeWidth="14" />
          <path className={iconTone.stroke} d="M206 326c-28 9-52 32-66 66 34-14 57-38 66-66z" strokeLinejoin="round" strokeWidth="12" />
          <path className={accent} d="M128 370h-44M166 408h-68" strokeLinecap="round" strokeWidth="14" />
          <path className={iconTone.soft} d="M326 116c22 22 48 48 70 70" strokeLinecap="round" strokeWidth="14" />
        </>
      )}

      {id === "finance-quant" && (
        <>
          <rect className={cn(iconTone.fill, iconTone.soft)} x="106" y="130" width="300" height="230" rx="34" strokeWidth="12" />
          <path className={iconTone.soft} d="M154 302h204M154 246h204M154 190h204M204 166v156M264 166v156M324 166v156" strokeLinecap="round" strokeWidth="6" />
          <path className={accent} d="M154 292c34-54 66-70 102-34 33 33 67 13 102-68" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
          <path className={iconTone.stroke} d="M170 394h172" strokeLinecap="round" strokeWidth="14" />
          <circle className={accent} cx="170" cy="394" r="14" strokeWidth="12" />
          <circle className={accent} cx="256" cy="394" r="14" strokeWidth="12" />
          <circle className={accent} cx="342" cy="394" r="14" strokeWidth="12" />
        </>
      )}
    </svg>
  );
}
