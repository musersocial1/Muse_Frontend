import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href={RouterConstantUtil.auth.login as any} />;
}
