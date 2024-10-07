import React, { forwardRef } from "react";
import { TimePicker } from "antd";
import moment from "moment";
import { useFormContext } from "react-hook-form";
import { FieldError } from "../FieldError/FieldError";
import { v4 } from "uuid";
import { isEmpty, isNaN } from "lodash";
import dayjs from "dayjs";
const { RangePicker } = TimePicker;
const ComTimePickerRange = forwardRef(
  (
    {
      name,
      label,
      required,
      className,
      format = "HH:mm",
      rules,

      onChangeValue,
      onChange,
      disabledDate = () => false,
      ...props
    },
    ref
  ) => {
    const {
      watch,
      formState: { errors },
      setValue,
    } = useFormContext();
    const valueWatch = watch(name);
    const error = errors[name];
    const inputId = v4();
    const handleChange = (dates, dateStrings) => {
      if (!dateStrings[0]) {
        setValue(name, []);
      } else {
        setValue(name, dateStrings);
      }
      onChangeValue?.(name, dateStrings);
      console.log(name);
      //   setValue(name, 1111);
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
            </div>
          )}
          <div className="grid">
            <RangePicker
              ref={ref}
              id={inputId}
              size="large"
              placeholder={["Filled", ""]}
              value={props.value}
              format={format}
              defaultValue={[
                dayjs(valueWatch[0], format),
                dayjs(valueWatch[1], format),
              ]}
              onChange={handleChange}
              status={error && "error"}
              disabledDate={disabledDate}
              {...props}
            />
            {error && (
              <FieldError className="text-red-500">
                {error.message?.toString()}
              </FieldError>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default ComTimePickerRange;
