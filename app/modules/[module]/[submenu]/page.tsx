import { PremiumErpShell, screenFromModuleRoute } from "@/components/PremiumErpShell";

export default function ModuleSubmenuPage({
  params
}: {
  params: {
    module: string;
    submenu: string;
  };
}) {
  const moduleName = decodeURIComponent(params.module);
  const submenuName = decodeURIComponent(params.submenu);
  return <PremiumErpShell initialScreen={screenFromModuleRoute(moduleName, submenuName) ?? "projects"} />;
}
