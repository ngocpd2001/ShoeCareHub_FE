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

export default function EditDisease({ selectedData, onClose, tableRef }) {
  const { notificationApi } = useNotification();
  const [dataDisease, setDataDisease] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const CreateProductMessenger = yup.object({});
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
    getData("/disease-category?State=Active&SortDir=Desc")
      .then((e) => {
        const dataForSelect = e?.data?.contends.map((item) => ({
          value: item.id,
          label: `${item.name}`,
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
          Cập nhật bệnh đang mắc phải
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
                  label={"Các loại bệnh đang mắc phải"}
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  onChangeValue={(e, value) => {
                    if (value.length === 0) {
                      setValue("diseaseCategories", null, {
                        shouldValidate: true,
                      });
                    } else {
                      setValue("diseaseCategories", value, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  value={watch("diseaseCategories")}
                  // mode="default"
                  options={dataDisease}
                  mode="multiple"
                  placeholder={"Vui lòng chọn căn bệnh"}
                  {...register("diseaseCategories")}
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
