import svgPaths from "../../imports/svg-cbj800iajt";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Crescent Symbol with R */}
      <div className="relative w-8 h-8 mr-1">
        <svg 
          viewBox="0 0 318.2 359.591" 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient 
              id="logo-crescent-gradient" 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="359.64" 
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#724B09" />
              <stop offset="1" stopColor="#F1B041" />
            </linearGradient>
          </defs>
          <path 
            d={svgPaths.p1b643980} 
            fill="url(#logo-crescent-gradient)" 
          />
        </svg>
        <svg 
          viewBox="0 0 170.176 173.346" 
          className="absolute inset-0 w-[53%] h-[48%] left-[27%] top-[26%]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient 
              id="logo-r-gradient" 
              x1="-5.93637" 
              y1="-35.448" 
              x2="-5.93637" 
              y2="187.406" 
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#724B09" />
              <stop offset="1" stopColor="#F1B041" />
            </linearGradient>
          </defs>
          <path 
            d={svgPaths.p4c56680} 
            fill="url(#logo-r-gradient)" 
          />
        </svg>
      </div>
      {/* LOCO Text */}
      <svg 
        viewBox="0 0 692.826 168.293" 
        className="h-5"
        preserveAspectRatio="xMidYMid meet"
      >
        <path 
          d={svgPaths.p2d56c100} 
          fill="#B4770E" 
        />
      </svg>
    </div>
  );
}