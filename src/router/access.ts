import type { UserInfo } from "@/store/user";
import type { RouteMeta } from "vue-router";

export function access(userInfo: UserInfo, meta?: RouteMeta) {
  return meta?.roles
    ? meta.roles.some((role) => userInfo.roles.includes(role))
    : true;
}
