import { useEffect, useState } from "react";
import { useNotification } from "./../../../../Notification/Notification";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { firebaseImg } from "../../../../upImgFirebase/firebaseImg";
import { getData, putData } from "../../../../api/api";
import { handleErrors } from "../../../../Components/errorUtils/errorUtils";
import ComInput from "../../../../Components/ComInput/ComInput";
import ComDatePicker from "../../../../Components/ComDatePicker/ComDatePicker";
import { DateOfBirthElder } from "../../../../Components/ComDateDisabled/DateOfBirth";
import ComSelect from "../../../../Components/ComInput/ComSelect";
import ComTextArea from "../../../../Components/ComInput/ComTextArea";
import ComButton from "../../../../Components/ComButton/ComButton";
import { weightRegex } from "../../../../regexPatterns";

export default function EditHealth({ selectedData, onClose, tableRef }) {
  const { notificationApi } = useNotification();
  const [dataDisease, setDataDisease] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const CreateProductMessenger = yup.object({
    bloodType: yup.string().required("Vui lòng nhập nhóm máu"),
      weight: yup
        .string()
        .typeError("Vui lòng nhập cân nặng")
        .required("Vui lòng nhập cân nặng")
        .matches(weightRegex, "Cân nặng phải là số")
        .test(
          "min",
          "Cân nặng phải lớn hơn hoặc bằng 0",
          (value) => parseFloat(value) >= 0
        )
        .test(
          "max",
          "Cân nặng phải nhỏ hơn hoặc bằng 220",
          (value) => parseFloat(value) <= 220
        ),
      height: yup
        .string()
        .typeError("Vui lòng nhập chiều cao")
        .required("Vui lòng nhập chiều cao")
        .test(
          "min",
          "Chiều cao phải lớn hơn hoặc bằng 0 cm",
          (value) => parseFloat(value) >= 0
        )
        .test(
          "max",
          "Chiều cao phải nhỏ hơn hoặc bằng 200 cm",
          (value) => parseFloat(value) <= 200
        ),
      // underlyingDisease: yup.string().required("Vui lòng nhập đủ bệnh lý"),
      // note: yup.string().required("Vui lòng nhập ghi chú"),
  });
  const transformedArray = selectedData?.diseaseCategories?.map(
    (item) => item.id
  );
  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
    values: {
      ...selectedData,
      diseaseCategories: transformedArray,
    },
  });

  const { handleSubmit, register, setFocus, watch, setValue, setError } =
    methods;
  const onSubmit = (data) => {
    setDisabled(true);
    const diseaseCategories = data?.diseaseCategories?.map((item) => ({
      id: item,
    }));
    putData(`/medical-records`, selectedData.id, {
      ...data,
      diseaseCategories: diseaseCategories,
    })
      .then((e) => {
        notificationApi("success", "Cập nhật thành công", "Đã cập nhật");

        tableRef();
        setDisabled(false);
        onClose();
      })
      .catch((error) => {
        console.log(error);
        setDisabled(false);
        notificationApi("error", "Cập nhật không thành công ", "Cập nhật");
        handleErrors(error, setError, setFocus);
      });
  };

  useEffect(() => {
    reloadData();
    setValue("diseaseCategories", transformedArray);
  }, [selectedData]);

  const reloadData = () => {
    getData("/disease-category?SortDir=Desc")
      .then((e) => {
        const dataForSelect = e?.data?.contends.map((item) => ({
          value: item.id,
          label: `Tên: ${item.name}`,
        }));
        setDataDisease(dataForSelect);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  return (
    <div>
      <div className="p-4 bg-white ">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cập nhật thông tin sức khỏe
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-2 max-w-xl "
          >
            <div className="sm:col-span-2">
              <div className="mt-2.5">
                <ComSelect
                  size={"large"}
                  type="text"
                  label={"Nhóm máu"}
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  value={watch("bloodType")}
                  onChangeValue={(e, value) => {
                    if (value.length === 0) {
                      setValue("bloodType", null, {
                        shouldValidate: true,
                      });
                    } else {
                      setValue("bloodType", value, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  mode="default"
                  options={[
                    {
                      value: "Chưa có",
                      label: "Chưa có",
                    },
                    {
                      value: "A",
                      label: "A",
                    },
                    {
                      value: "B",
                      label: "B",
                    },
                    {
                      value: "AB",
                      label: "AB",
                    },
                    {
                      value: "O",
                      label: "O",
                    },
                    {
                      value: "A+",
                      label: "A+",
                    },
                    {
                      value: "A-",
                      label: "A-",
                    },
                    {
                      value: "B+",
                      label: "B+",
                    },
                    {
                      value: "B-",
                      label: "B-",
                    },
                    {
                      value: "AB+",
                      label: "AB+",
                    },
                    {
                      value: "AB-",
                      label: "AB-",
                    },
                    {
                      value: "O+",
                      label: "O+",
                    },
                    {
                      value: "O-",
                      label: "O-",
                    },
                    {
                      value: "hr+",
                      label: "hr+",
                    },
                    {
                      value: "hr-",
                      label: "hr-",
                    },
                  ]}
                  placeholder={"Vui lòng chọn nhóm máu"}
                  {...register("bloodType")}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <div className="mt-2.5">
                <ComInput
                  type="numberFloat"
                  label={"Cân nặng(KG)"}
                  placeholder={"Vui lòng nhập Cân nặng"}
                  {...register("weight")}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <div className="mt-2.5">
                <ComInput
                  type="numberFloat"
                  label={"Chiều cao(Cm)"}
                  placeholder={"Vui lòng nhập Chiều cao"}
                  {...register("height")}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="mt-2.5">
                <ComTextArea
                  type="text"
                  label={"Bệnh lý trước đó"}
                  placeholder={"Vui lòng nhập bệnh lý"}
                  rows={5}
                  {...register("underlyingDisease")}
                  // required
                />
              </div>
            </div>
      
            <div className="sm:col-span-2">
              <div className="mt-2.5">
                <ComTextArea
                  type="text"
                  label={"Ghi chú"}
                  placeholder={"Vui lòng nhập ghi chú"}
                  rows={5}
                  {...register("note")}
                  // required
                />
              </div>
            </div>

            <div className="mt-10">
              <ComButton
                htmlType="submit"
                type="primary"
                disabled={disabled}
                className="block w-full rounded-md bg-[#0F296D]  text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Cập nhật
              </ComButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
