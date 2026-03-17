import svgPaths from "@/imports/svg-ebb2dgopt5";

interface RlocoLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const sizeClasses = {
  xs: "h-4 w-auto",
  sm: "h-6 w-auto",
  md: "h-8 w-auto",
  lg: "h-10 w-auto",
  xl: "h-12 w-auto",
  "2xl": "h-16 w-auto",
  "3xl": "h-20 w-auto",
};

export function RlocoLogo({ className = "", size = "md" }: RlocoLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        className={`block ${sizeClasses[size]}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 250 44.8435"
      >
        <g id="Group 13">
          <g id="Group 12">
            <path d={svgPaths.p3df4e000} fill="#F1B041" id="L" />
            <path d={svgPaths.p3a478b70} fill="#F1B041" id="Subtract" />
          </g>
          <g id="LOKO">
            <path d={svgPaths.p3023e300} fill="#1A1A1A" />
            <path d={svgPaths.p1ab7cb00} fill="#1A1A1A" />
            <path d={svgPaths.p24b6c600} fill="#1A1A1A" />
            <path d={svgPaths.p114e3d80} fill="#1A1A1A" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default RlocoLogo;
