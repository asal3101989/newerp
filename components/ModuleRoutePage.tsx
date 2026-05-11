import { PremiumErpShell } from "@/components/PremiumErpShell";

export function ModuleRoutePage({ screen }: { screen: string }) {
  return <PremiumErpShell initialScreen={screen} />;
}
