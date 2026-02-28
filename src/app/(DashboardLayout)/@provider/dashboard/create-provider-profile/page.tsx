import { redirect } from "next/navigation";
import CreateProviderProfile from "@/components/provider/CreateProviderProfile";
import { getProfile } from "@/services/provider";


export default async function Page() {
  const profile = await getProfile();

  if (profile) {
    redirect("/dashboard");
  }

  return <CreateProviderProfile />;
}
