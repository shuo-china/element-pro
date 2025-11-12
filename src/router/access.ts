import type { ManagerInfo } from "@/store/manager";
import type { RouteMeta } from "vue-router";

export function access(managerInfo: ManagerInfo, meta?: RouteMeta) {
  return meta?.roles && !managerInfo.isTop
    ? meta.roles.some((role) => managerInfo.roles.includes(role))
    : true;
}
