import svgPaths from "./svg-xr2xi1tchc";

function Group() {
  return (
    <div className="absolute inset-[13.02%_23.83%_13.06%_23.84%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 669.8 756.926">
        <g id="Group">
          <path d={svgPaths.p1d980d80} fill="url(#paint0_linear_34_492)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_34_492" x1="0" x2="0" y1="0" y2="757.028">
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
    <div className="absolute contents inset-[13.02%_23.83%_13.06%_23.84%]" data-name="Group">
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[13.02%_23.83%_13.06%_23.84%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[13.02%_23.83%_13.06%_23.84%]" data-name="Group">
      <Group2 />
    </div>
  );
}

function LogoLogo() {
  return (
    <div className="absolute contents inset-[13.02%_23.83%_13.06%_23.84%]" data-name="logo-logo">
      <Group4 />
    </div>
  );
}

function TaglineD3F01C9A824C4986A818082838C18832LogoPath() {
  return (
    <div className="absolute inset-[34.38%_27.77%_29.99%_44.25%]" data-name="tagline-d3f01c9a-824c-4986-a818-082838c18832-logo-path-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 358.214 364.886">
        <g id="tagline-d3f01c9a-824c-4986-a818-082838c18832-logo-path-0">
          <path d={svgPaths.p3add0f80} fill="url(#paint0_linear_34_495)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_34_495" x1="-12.4958" x2="-12.4958" y1="-74.6167" y2="394.482">
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
    <div className="absolute contents inset-[34.38%_27.77%_29.99%_44.25%]" data-name="Group">
      <TaglineD3F01C9A824C4986A818082838C18832LogoPath />
    </div>
  );
}

function TaglineD3F01C9A824C4986A818082838C18832Logo() {
  return (
    <div className="absolute contents inset-[34.38%_27.77%_29.99%_44.25%]" data-name="tagline-d3f01c9a-824c-4986-a818-082838c18832-logo">
      <Group5 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[13.02%_23.83%_13.06%_23.84%]">
      <LogoLogo />
      <TaglineD3F01C9A824C4986A818082838C18832Logo />
    </div>
  );
}

export default function RlocoLogo() {
  return (
    <div className="relative size-full" data-name="Rloco logo 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1024">
        <g id="background-logo">
          <path d="M1280 0H0V1024H1280V0Z" fill="var(--fill-0, #FEFBF6)" id="Vector" />
        </g>
      </svg>
      <Group3 />
    </div>
  );
}