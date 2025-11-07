import type { ConfigType } from "@/api/config";

export const transformReceiveValue = (type: ConfigType, value: string) => {
  switch (type) {
    case "number":
      return Number(value);
    case "switch":
      return value === "1" ? true : false;
    case "tags":
      return value.split(",");
    default:
      return value;
  }
};

export const transformSubmitValue = (type: ConfigType, value: any) => {
  switch (type) {
    case "number":
      return String(value);
    case "switch":
      return value ? "1" : "0";
    case "tags":
      return value.join(",");
    default:
      return value;
  }
};

export const transformReceiveOptions = (options: string): OptionItem[] => {
  return options.split("\n").map((item) => {
    const splitedArr = item.split(":");
    return {
      label: splitedArr[0]!,
      value: splitedArr[1]!,
    };
  });
};

export const transformSubmitOptions = (options: OptionItem[]): string => {
  return options.map((item) => `${item.label}:${item.value}`).join("\n");
};
