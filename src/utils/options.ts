export const BOOLEAN_OPTIONS = [
  { label: "是", value: 1 },
  { label: "否", value: 0 },
];

export function getOptionItemByValue(options: (OptionItem & Record<string, any>)[],, value: any) {
  return options.find((item) => item.value === value);
}

export function getOptionLabelByValue(options: OptionItem[], value: any) {
  return options.find((item) => item.value === value)?.label || "";
}
