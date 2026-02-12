import { redirect } from "next/navigation";
import CreateProviderProfile from "@/components/provider/CreateProviderProfile";
import { ProviderServerService } from "@/services/provider.service";

export default async function Page() {
  const profile = await ProviderServerService.getProfile();

  if (profile) {
    redirect("/dashboard");
  }

  return <CreateProviderProfile />;
}
