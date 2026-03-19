/** Previously redirected mobile users to /onboarding; disabled for desktop-only flow. */
export function MobileOnboardingRedirect({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
