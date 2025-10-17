export const pagination = {
  defaultPageSize: 10,
  requestPageKey: "page",
  requestPageSizeKey: "list_rows",
  responseTotalKey: "total",
  responseDataKey: "data",
} as const;

const config = {
  title: "Kirin Pro",
  description: "Element Pro 中后台前端/设计解决方案",
  logo: "/logo.svg",
  upload: {
    image: {
      limitExt: ["jpg", "png"],
      // 单位:KB
      limitSize: 0,
    },
    file: {
      limitExt: [],
      // 不限制
      limitSize: 0,
    },
  },
  pagination,
};

export default config;
