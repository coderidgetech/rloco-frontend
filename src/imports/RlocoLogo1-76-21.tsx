import svgPaths from "./svg-vogobyc78s";

function Group() {
  return (
    <div className="absolute inset-[17.48%_37.57%_47.4%_37.57%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 318.2 359.591">
        <g id="Group">
          <path d={svgPaths.p1b643980} fill="url(#paint0_linear_34_486)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_34_486" x1="0" x2="0" y1="0" y2="359.64">
            <stop stopColor="#724B09" />
            <stop offset="1" stopColor="#F1B041" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[17.48%_37.57%_47.4%_37.57%]" data-name="Group">
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[17.48%_37.57%_47.4%_37.57%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[17.48%_37.57%_47.4%_37.57%]" data-name="Group">
      <Group2 />
    </div>
  );
}

function LogoLogo() {
  return (
    <div className="absolute contents inset-[17.48%_37.57%_47.4%_37.57%]" data-name="logo-logo">
      <Group3 />
    </div>
  );
}

function TextLogoPath() {
  return (
    <div className="absolute inset-[60.43%_15.54%_19.31%_15.72%]" data-name="text-logo-path-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 879.869 207.427">
        <g id="text-logo-path-0">
          <path d={svgPaths.p2629e000} fill="var(--fill-0, #B4770E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[60.43%_15.54%_19.31%_15.72%]" data-name="Group">
      <TextLogoPath />
    </div>
  );
}

function TextLogo() {
  return (
    <div className="absolute contents inset-[60.43%_15.54%_19.31%_15.72%]" data-name="text-logo">
      <Group4 />
    </div>
  );
}

function TaglineD3F01C9A824C4986A818082838C18832LogoPath() {
  return (
    <div className="absolute inset-[27.63%_39.44%_55.45%_47.26%]" data-name="tagline-d3f01c9a-824c-4986-a818-082838c18832-logo-path-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 170.176 173.346">
        <g id="tagline-d3f01c9a-824c-4986-a818-082838c18832-logo-path-0">
          <path d={svgPaths.p4c56680} fill="url(#paint0_linear_34_483)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_34_483" x1="-5.93637" x2="-5.93637" y1="-35.448" y2="187.406">
            <stop stopColor="#724B09" />
            <stop offset="1" stopColor="#F1B041" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[27.63%_39.44%_55.45%_47.26%]" data-name="Group">
      <TaglineD3F01C9A824C4986A818082838C18832LogoPath />
    </div>
  );
}

function TaglineD3F01C9A824C4986A818082838C18832Logo() {
  return (
    <div className="absolute contents inset-[27.63%_39.44%_55.45%_47.26%]" data-name="tagline-d3f01c9a-824c-4986-a818-082838c18832-logo">
      <Group5 />
    </div>
  );
}

export default function RlocoLogo() {
  return (
    <div className="relative size-full" data-name="Rloco logo 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1024">
        <g id="background-logo">
          <path d="M1280 0H0V1024H1280V0Z" fill="var(--fill-0, #FEFBF6)" id="Vector" />
        </g>
      </svg>
      <LogoLogo />
      <TextLogo />
      <TaglineD3F01C9A824C4986A818082838C18832Logo />
    </div>
  );
}