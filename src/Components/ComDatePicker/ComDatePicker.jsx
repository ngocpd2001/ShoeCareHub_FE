import React, { forwardRef, useEffect } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import { useFormContext } from "react-hook-form";
import { FieldError } from "../FieldError/FieldError";
import { v4 as uuidv4 } from "uuid";
import { isEmpty, get } from "lodash"; // Chỉ import isEmpty
import dayjs from "dayjs";

const ComDatePicker = forwardRef(
  (
    {
      name,
      label,
      required,
      className,
      format = "DD-MM-YYYY",
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
      trigger,
    } = useFormContext();

    const valueWatch = watch(name);

    // const error = errors[name];
    const error = get(errors, name);
    const inputId = uuidv4();

    const handleChange = (date, dateString) => {
        const formattedDate = dayjs(dateString, format).format("YYYY-MM-DD");
        setValue(name, formattedDate);
        onChangeValue?.(name, formattedDate);
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
            <DatePicker
              ref={ref}
              id={inputId}
              size="large"
              value={valueWatch ? dayjs(valueWatch, "YYYY-MM-DD") : null}
              format={format}
              onChange={handleChange}
              status={error && "error"}
              allowClear={false}
              disabledDate={disabledDate}
              {...props}
            />
            {error && (
              <div className="text-red-500">{error.message?.toString()}</div>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default ComDatePicker;
