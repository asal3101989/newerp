import { redirect } from "next/navigation";

export function ModuleRedirectPage({ screen }: { screen: string }) {
  return redirect(`/#screen=${screen}`);
}
