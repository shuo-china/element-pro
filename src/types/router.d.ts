import "vue-router";

export {};

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    icon?: string;
    roles?: string[];
    hidden?: boolean;
  }
}
