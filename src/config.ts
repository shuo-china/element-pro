export const pagination = {
  defaultPageSize: 10,
  requestPageKey: "page",
  requestPageSizeKey: "list_rows",
  responseTotalKey: "total",
  responseDataKey: "data",
} as const;

const config = {
  title: "Kirin Pro",
  logo: "/logo.svg",
  pagination,
};

export default config;
