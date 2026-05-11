import { PremiumErpShell, screenFromModuleRoute } from "@/components/PremiumErpShell";

export default function ModulePage({
  params
}: {
  params: {
    module: string;
  };
}) {
  const moduleName = decodeURIComponent(params.module);
  return <PremiumErpShell initialScreen={screenFromModuleRoute(moduleName) ?? "projects"} />;
}
