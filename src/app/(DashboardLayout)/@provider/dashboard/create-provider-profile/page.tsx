import { redirect } from "next/navigation";
import CreateProviderProfile from "@/components/provider/CreateProviderProfile";
import { getProfile } from "@/services/provider.service";


export default async function Page() {
  const profile = await getProfile();

  console.log("this is provider:", profile)

  if (profile) {
    redirect("/dashboard");
  }

  return <CreateProviderProfile />;
}
