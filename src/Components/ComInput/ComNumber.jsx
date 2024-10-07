import {
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Input, InputNumber } from "antd";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { v4 } from "uuid";
import { isEmpty, isNaN, get } from "lodash";
import { FieldError } from "../FieldError/FieldError";
import BigNumber from "bignumber.js";

const checkValidType = (str, value) => {
  return value.split("").every((item) => str.split("").includes(item));
};
const HALF_SIZE_LIST =
  "!#$%&'()*+,-./:;<=>?@[]^_`{|}~" +
  '"' +
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ";
const isHalfSize = (value) => {
  return value.split("").every((item) => HALF_SIZE_LIST.indexOf(item) !== -1);
};
const integerRegex = /^-?\d*$/;
const positiveIntegerRegex = /^\d*$/;
const decimalRegex = /^-?\d*\.?\d*$/;
const positiveDecimalRegex = /^\d*\.?\d*$/;
const emailRegex = /^[A-Za-z0-9@.+-_]*$/g;
const passwordRegex = /([A-Z][a-z][0-9][~!@#$%^&*()_+`{}])\w*$/g;
const integerStr = "-0123456789";
const positiveIntegerStr = "0123456789";
const decimalStr = "-.0123456789";
const decimalPositiveStr = ".0123456789";

const toBigDecimal = (value, length) => {
  let valueTmp = value.toString();
  if (valueTmp.includes(".")) {
    const decimals = valueTmp.split(".")[1];
    if (decimals.length > (length ?? 0)) {
      valueTmp = valueTmp.split(".")[0] + "." + decimals.slice(0, length ?? 0);
    }
  }
  const myNumber = new BigNumber(valueTmp);
  if (
    myNumber.toString().split(".").length > 0 &&
    (myNumber.toString().split(".")[1] ?? "").length <= length
  ) {
    return myNumber.toString();
  }
  return myNumber.toFixed(length);
};

const ComNumber = React.forwardRef(
  (
    {
      label,
      required,
      className,
      onChangeValue,
      onChange,
      maxLength,
      search,
      min,
      max,
      money,
      subLabel,
      decimalLength,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const {
      watch,
      formState: { errors },
      setValue,
    } = useFormContext();
    const valueWatch = watch(props.name);
    // const error = errors[props.name];
    const error = get(errors, props.name);
    const inputId = v4();

    const onlyChangeWithCondition = (e) => {
      let value = e;
      value = e;

      switch (props.type) {
        case "emails":
          if (!isHalfSize(value) || !value.match(emailRegex)) {
            return;
          }
          break;
        case "code":
          if (!checkValidType(decimalPositiveStr, value)) {
            return;
          }
          break;
        case "money":
          const numericValues = e.toString();
          value = numericValues.replace(/[^0-9]/g, "");
          break;
        case "numbers":
          // if (!checkValidType(positiveIntegerStr, value)) {
          //   return;
          // }
          // if (e==='') {
          const numericValue = e.toString();
          value = numericValue.replace(/[^0-9]/g, "");
          // }
          break;
        default:
          break;
      }

      setValue(props.name, e);
      onChangeValue?.(props.name, value);
      // console.log(value);
    };
    return (
      <>
        <div className={`${className}`}>
          {label && (
            <div className="mb-4 flex justify-between">
              <label htmlFor={inputId} className="text-paragraph font-bold">
                {label}
                {required && (
                  <span className="text-paragraph font-bold text-error-7 text-red-500">
                    *
                  </span>
                )}
              </label>
              {subLabel && <span className="ml-8">{subLabel}</span>}
            </div>
          )}
          {money ? (
            <InputNumber
              id={inputId}
              style={{ width: "100%" }}
              ref={ref}
              size="large"
              {...props}
              // step={1}
              min={min}
              max={max}
              // formatter={formatterNumber}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              // parser={parserNumber}
              defaultValue={defaultValue}
              status={error && "error"}
              onChange={onlyChangeWithCondition}
            />
          ) : (
            <InputNumber
              id={inputId}
              style={{ width: "100%" }}
              ref={ref}
              size="large"
              {...props}
              min={min}
              max={max}
              defaultValue={defaultValue}
              status={error && "error"}
              onChange={onlyChangeWithCondition}
            />
          )}

          {error && (
            <FieldError className="text-red-500">
              {error.message?.toString()}
            </FieldError>
          )}
        </div>
      </>
    );
  }
);

export default ComNumber;
