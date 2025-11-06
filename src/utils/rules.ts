import type { FormItemRule } from "element-plus";

export const mobileRule: FormItemRule = {
  pattern: /^1[3-9]\d{9}$/,
  message: "请输入正确的手机号码",
};

export const idCardRule: FormItemRule = {
  validator: (_rule, value, callback) => {
    if (!value) {
      return callback();
    }

    const reg = /^\d{17}[\dXx]$/;
    if (!reg.test(value)) {
      return callback(new Error("请输入正确的身份证号码"));
    }

    const weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCode = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += value[i] * weight[i]!;
    }
    const code = checkCode[sum % 11];

    if (code === value[17].toUpperCase()) {
      return callback();
    } else {
      return callback(new Error("请输入正确的身份证号码"));
    }
  },
};
