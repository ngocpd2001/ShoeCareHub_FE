import React, { useEffect, useState } from "react";
import ComButton from "./../../../Components/ComButton/ComButton";
import { FormProvider, useForm } from "react-hook-form";
import ComInput from "./../../../Components/ComInput/ComInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import ComUpImg from "./../../../Components/ComUpImg/ComUpImg";
import { useNotification } from "./../../../Notification/Notification";
import { getData, postData } from "../../../api/api";
import ComUpImgOne from "./../../../Components/ComUpImg/ComUpImgOne";
import { firebaseImg } from "./../../../upImgFirebase/firebaseImg";
import ComDatePicker from "../../../Components/ComDatePicker/ComDatePicker";
import {
  DateOfBirth,
  DateOfBirthElder,
  DateOfContract,
  DateOfLastDay,
} from "../../../Components/ComDateDisabled/DateOfBirth";
import ComSelect from "../../../Components/ComInput/ComSelect";
import ComTextArea from "../../../Components/ComInput/ComTextArea";
import {
  addressRegex,
  cccdRegex,
  nameRegex,
  weightRegex,
} from "./../../../regexPatterns";
import { handleErrors } from "../../../Components/errorUtils/errorUtils";
import moment from "moment";
import ComNumber from "../../../Components/ComInput/ComNumber";
import { differenceInMonths } from "date-fns";
import { MonyNumber } from "../../../Components/MonyNumber/MonyNumber";

export default function CreateElder({ onClose, tableRef }) {
  const [image, setImages] = useState(null);
  const [image1, setImages1] = useState([]);
  const { notificationApi } = useNotification();
  const [dataUser, setDataUser] = useState([]);
  const [dataDisease, setDataDisease] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [dataRoom, setDataRoom] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState();
  const [selectedPackage, setSelectedPackage] = useState();
  const [dataPackage, setDataPackage] = useState([]);
  const [endDate, setEndDate] = useState(false);
  const [startDate, setStartDate] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const CreateProductMessenger = yup.object({
    name: yup
      .string()
      .matches(
        nameRegex,
        "Vui lòng nhập tên hợp lệ (chỉ chứa chữ cái và dấu cách)"
      )
      .required("Vui lòng nhập tên")
      .min(2, "Tên quá ngắn, vui lòng nhập tối thiểu 2 ký tự")
      .max(50, "Tên quá dài, vui lòng nhập tối đa 50 ký tự"),
    // phoneNumber: yup.string().required("Vui lòng nhập đủ họ và tên"),
    dateOfBirth: yup.string().required("Vui lòng nhập đủ ngày tháng năm sinh"),
    roomId: yup.string().required("Vui lòng chọn phòng"),
    userId: yup.string().required("Vui lòng chọn người thân"),
    gender: yup.string().required("Vui lòng chọn chọn giới tính"),
    relationship: yup.string().required("Vui lòng chọn mối quan hệ"),
    // habits: yup.string().required("Vui lòng nhập nhập thói quen sinh hoạt"),
    time: yup.string(),
    cccd: yup
      .string()
      .matches(cccdRegex, "Vui lòng nhập đúng số CMND/CCCD (9 hoặc 12 chữ số)")
      .required("Vui lòng nhập đủ số CMND/CCCD"),
    address: yup
      .string()
      .matches(addressRegex, "Vui lòng nhập địa chỉ hợp lệ")
      .required("Vui lòng nhập địa chỉ")
      .min(5, "Địa chỉ quá ngắn, vui lòng nhập tối thiểu 5 ký tự")
      .max(100, "Địa chỉ quá dài, vui lòng nhập tối đa 100 ký tự"),
    // notes: yup.string().required("Vui lòng nhập ghi chú"),
    // medicalRecord: yup.object({
    //   bloodType: yup.string().required("Vui lòng nhập nhóm máu"),
    //   weight: yup
    //     .string()
    //     .typeError("Vui lòng nhập cân nặng")
    //     .required("Vui lòng nhập cân nặng")
    //     .matches(weightRegex, "Cân nặng phải là số")
    //     .test(
    //       "min",
    //       "Cân nặng phải lớn hơn hoặc bằng 0",
    //       (value) => parseFloat(value) >= 0
    //     )
    //     .test(
    //       "max",
    //       "Cân nặng phải nhỏ hơn hoặc bằng 220",
    //       (value) => parseFloat(value) <= 220
    //     ),
    //   height: yup
    //     .string()
    //     .typeError("Vui lòng nhập chiều cao")
    //     .required("Vui lòng nhập chiều cao")
    //     .test(
    //       "min",
    //       "Chiều cao phải lớn hơn hoặc bằng 0 cm",
    //       (value) => parseFloat(value) >= 0
    //     )
    //     .test(
    //       "max",
    //       "Chiều cao phải nhỏ hơn hoặc bằng 200 cm",
    //       (value) => parseFloat(value) <= 200
    //     ),
    //   // underlyingDisease: yup.string().required("Vui lòng nhập đủ bệnh lý"),
    //   // note: yup.string().required("Vui lòng nhập ghi chú"),
    // }),
    // trường hợp đồng
    contract: yup.object({
      name: yup.string().required("Vui lòng nhập số hợp đồng"),
      signingDate: yup.string().required("Vui lòng nhập ngày ký hợp đồng"),
      startDate: yup.string().required("Vui lòng nhập ngày bắt đầu hợp đồng"),
      endDate: yup.string().required("Vui lòng nhập ngày kết thúc hợp đồng"),
      // content: yup.string().required("Vui lòng nhập nội dung hợp đồng"),
      // imageUrl: yup
      //   .string()
      //   .url("Vui lòng nhập URL hợp lệ")
      //   .required("Vui lòng nhập URL hình ảnh"),
      // notes: yup.string().required("Vui lòng nhập ghi chú"),
      // description: yup.string().required("Vui lòng nhập mô tả"),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
  });
  const { handleSubmit, register, setFocus, watch, setValue, setError } =
    methods;
  function convertUrlsToObjects(urls) {
    return urls.map((url) => ({ imageUrl: url }));
  }
  // console.log(watch);
  const disabledDateEnd = (current) => {
    const oneMonths = moment().add(0, "months");
    const tenYearsLater = moment().add(10, "years");
    const startDate = watch("contract.startDate");
    const fixedFutureDate = startDate
      ? moment(startDate).add(1, "months")
      : null;
    return (
      current &&
      (current > tenYearsLater ||
        (fixedFutureDate && current < fixedFutureDate))
    );
  };
  const disabledDateStart = (current) => {
    const oneMonths = moment().add(0, "months");

    const tenYearsLater = moment().add(1, "months");
    const startDate = watch("contract.signingDate");
    const fixedFutureDate = startDate
      ? moment(startDate).add(0, "months")
      : null;
    return (
      current &&
      (current > tenYearsLater ||
        (fixedFutureDate && current < fixedFutureDate))
    );
  };
  useEffect(() => {
    setEndDate((e) => !e);
    setValue("contract.endDate", null);
    setTimeout(() => {
      handleDurationChange(watch("time"));
    }, 100);
  }, [watch("contract.startDate")]);

  useEffect(() => {
    setStartDate((e) => !e);
    setValue("contract.startDate", null);
  }, [watch("contract.signingDate")]);

  const handleDurationChange = (value) => {
    setValue("time", value);
    if (watch("contract.startDate")) {
      const startDate = new Date(watch("contract.startDate"));
      let endDate;

      switch (value) {
        case "0.5":
          endDate = new Date(startDate.setMonth(startDate.getMonth() + 6));
          break;
        case "1":
          endDate = new Date(
            startDate.setFullYear(startDate.getFullYear() + 1)
          );
          break;
        case "2":
          endDate = new Date(
            startDate.setFullYear(startDate.getFullYear() + 2)
          );
          break;
        case "3":
          endDate = new Date(
            startDate.setFullYear(startDate.getFullYear() + 3)
          );
          break;
        case "5":
          endDate = new Date(
            startDate.setFullYear(startDate.getFullYear() + 5)
          );
          break;
        case "10":
          endDate = new Date(
            startDate.setFullYear(startDate.getFullYear() + 10)
          );
          break;
        default:
          endDate = null;
      }
      if (endDate) {
        setValue("contract.endDate", endDate.toISOString().split("T")[0]);
      }
    }
  };

  const onSubmit = (data) => {
    setDisabled(true);
    console.log(1111, data);
    const diseaseCategories = data?.medicalRecord?.diseaseCategories?.map(
      (item) => ({
        id: item,
      })
    );

    const change = MonyNumber(
      data.contract.price,
      (message) => setError("contract.price", { message }), // Đặt lỗi nếu có
      () => setFocus("contract.price") // Đặt focus vào trường price nếu có lỗi
    );
    if (change !== null) {
      setValue("contract.price", change);
      if (!image) {
        setDisabled(false);
        return notificationApi(
          "error",
          "Vui lòng chọn ảnh",
          "Vui lòng chọn hình ảnh người cao tuổi "
        );
      }
      if (Array.isArray(image1) && image1.length === 0) {
        setDisabled(false);
        notificationApi(
          "error",
          "Vui lòng chọn ảnh",
          "Vui lòng chọn hình ảnh hợp đồng "
        );
      } else {
        firebaseImgs(image1).then((dataImg1) => {
          setValue("contract.images", convertUrlsToObjects(dataImg1));
          firebaseImg(image).then((dataImg) => {
            postData("/elders", {
              ...data,
              imageUrl: dataImg,
              price: change,
              medicalRecord: {
                ...data?.medicalRecord,
                diseaseCategories: diseaseCategories,
              },
            })
              .then((e) => {
                notificationApi("success", "Thành công", "Đã tạo thành công");
                setDisabled(false);
                setTimeout(() => {
                  if (tableRef.current) {
                    // Kiểm tra xem ref đã được gắn chưa
                    tableRef?.current.reloadData();
                  }
                }, 100);
                onClose();
              })
              .catch((error) => {
                console.log(error);
                setDisabled(false);
                handleErrors(error, setError, setFocus);
                notificationApi("error", "Không thành công", "Vui lòng thử lại");
              });
          });
        });
      }
    } else {
      setDisabled(false);
    }
  };
  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    if (typeof number === "number") {
      return number.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
  }
  useEffect(() => {
    reloadData();
  }, []);
  const handleChange = (e, value) => {
    // setSelectedUser(value);
    if (value.length === 0) {
      setValue("userId", null, { shouldValidate: true });
    } else {
      setValue("userId", value, { shouldValidate: true });
    }
  };
  const handleChangeRoom = (e, value) => {
    setSelectedRoom(value);
    if (value.length === 0) {
      setValue("roomId", null, { shouldValidate: true });
    } else {
      setValue("roomId", value, { shouldValidate: true });
    }
  };
  const handleChange2 = (e, value) => {
    setSelectedPackage(value);
    setSelectedRoom(null);
    setValue("roomId", null);
    getData(`/room?NursingPackageId=${value}`)
      .then((e) => {
        console.log(e?.data?.contends);
        const dataForSelect = e?.data?.contends
          .filter((item) => item.totalBed - item.totalElder > 0)
          .map((item) => ({
            value: item.id,
            label: `Phòng:${item.name}
          Khu:${item.name}
          Số giường trống:${item.totalBed - item.totalElder}
          Số người ở hiện tại:${item.totalElder}`,
          }));
        setDataRoom(dataForSelect);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
    if (value.length === 0) {
      setValue("nursingPackageId", null, { shouldValidate: true });
    } else {
      setValue("nursingPackageId", value, { shouldValidate: true });
    }
  };
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
    getData("/users?RoleName=Customer&SortDir=Asc")
      .then((e) => {
        const dataForSelect = e?.data?.contends.map((item) => ({
          value: item.id,
          label: `Tên: ${item.fullName} 
          Số Đt: ${item.phoneNumber} 
          CCCD: ${item.cccd}`,
        }));
        setDataUser(dataForSelect);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
    getData(`/room?NursingPackageId=${selectedPackage}`)
      .then((e) => {
        console.log(e?.data?.contends);
        const dataForSelect = e?.data?.contends
          .filter((item) => item.totalBed - item.totalElder > 0)
          .map((item) => ({
            value: item.id,
            label: `Phòng:${item.name}
          Khu:${item.name}
          Số giường trống:${item.totalBed - item.totalElder}
          Số người ở hiện tại:${item.totalElder}`,
          }));
        setDataRoom(dataForSelect);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
    getData("/nursing-package?State=Active&SortDir=Desc")
      .then((e) => {
        const dataForSelects = e?.data?.contends.map((item) => ({
          value: item.id,
          label: `${item.name} - ${formatCurrency(item.price)}/tháng`,
          price: item.price,
        }));
        setDataPackage(dataForSelects);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };
  const onChange = (data) => {
    const selectedImages = data;
    console.log([selectedImages]);
    setImages(selectedImages);
  };

  const onChange1 = (data) => {
    const selectedImages = data;
    const newImages = selectedImages.map((file) => file.originFileObj);
    setImages1(newImages);
  };
  const calculatePrice = () => {
    const selectedPackagePrice =
      dataPackage.find((pkg) => pkg.value === selectedPackage)?.price || 0;
    const totalPrice =
      selectedPackagePrice *
        differenceInMonths(
          watch("contract.endDate"),
          watch("contract.startDate")
        ) || 0;

    setValue("contract.price", totalPrice);
  };

  useEffect(() => {
    calculatePrice();
  }, [
    watch("contract.endDate"),
    watch("contract.startDate"),
    watch("nursingPackageId"),
  ]);
  console.log("====================================");
  console.log(watch("medicalRecord.diseaseCategories"));
  console.log("====================================");
  return (
    <div>
      <div className="p-4 bg-white ">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Tạo mới người cao tuổi
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-2 max-w-xl "
          >
            <div className=" p-2">
              <div
                className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
                // style={{ height: "65vh" }}
              >
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComInput
                      type="name"
                      label={"Họ và Tên"}
                      placeholder={"Vui lòng nhập Họ và Tên"}
                      {...register("name")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComDatePicker
                      type="numbers"
                      disabledDate={DateOfBirthElder}
                      label={"Ngày tháng năm sinh"}
                      placeholder={"Vui lòng nhập Ngày tháng năm sinh "}
                      {...register("dateOfBirth")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComInput
                      type="numbers"
                      label={"Số CMND/CCCD "}
                      placeholder={"Vui lòng nhập số CMND/CCCD "}
                      {...register("cccd")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Chọn giới tính"
                      placeholder="Giới tính"
                      onChangeValue={(e, value) => {
                        if (value.length === 0) {
                          setValue("gender", null, { shouldValidate: true });
                        } else {
                          setValue("gender", value, { shouldValidate: true });
                        }
                      }}
                      // value={selectedUser}
                      mode="default"
                      options={[
                        {
                          value: "Male",
                          label: `Nam`,
                        },
                        {
                          value: "Female",
                          label: `Nữ`,
                        },
                      ]}
                      required
                      {...register("gender")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Chọn người thân"
                      placeholder="Người thân"
                      onChangeValue={handleChange}
                      value={selectedUser}
                      filterOption={(inputValue, option) =>
                        option.searchString
                          ?.toLowerCase()
                          ?.includes(inputValue?.toLowerCase())
                      }
                      showSearch
                      mode="default"
                      options={dataUser}
                      required
                      {...register("userId")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Mối quan hệ với người cao tuổi"
                      placeholder="Mối quan hệ"
                      onChangeValue={(e, value) => {
                        if (value.length === 0) {
                          setValue("relationship", null, {
                            shouldValidate: true,
                          });
                        } else {
                          setValue("relationship", value, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      // value={selectedUser}
                      mode="default"
                      options={[
                        {
                          value: "Ba/mẹ",
                          label: `Ba/mẹ`,
                        },
                        {
                          value: "Anh/Em",
                          label: `Anh/Em`,
                        },
                        {
                          value: "Con",
                          label: `Con`,
                        },
                        {
                          value: "Cháu",
                          label: `Cháu`,
                        },
                        {
                          value: "Chính tôi",
                          label: `Chính tôi`,
                        },
                        {
                          value: "Khác",
                          label: `Khác`,
                        },
                      ]}
                      required
                      {...register("relationship")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Chọn gói cho hợp đồng"
                      placeholder="Gói"
                      onChangeValue={handleChange2}
                      value={selectedPackage}
                      // mode="tags"
                      mode="default"
                      options={dataPackage}
                      required
                      {...register("nursingPackageId")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      style={{
                        width: "100%",
                      }}
                      label="Chọn phòng"
                      placeholder="Phòng"
                      onChangeValue={handleChangeRoom}
                      showSearch
                      value={selectedRoom}
                      // mode="tags"
                      mode="default"
                      options={dataRoom}
                      required
                      {...register("roomId")}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComInput
                      type="text"
                      label={"Địa chỉ"}
                      placeholder={"Vui lòng nhập Địa chỉ"}
                      {...register("address")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <ComTextArea
                    label="Ghi chú người cao tuổi"
                    placeholder="Vui lòng nhập ghi chú"
                    rows={5}
                    {...register("notes")}
                    // required
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComTextArea
                      type="text"
                      label={"Thói quen sinh hoạt"}
                      placeholder={"Vui lòng nhập Thói quen sinh hoạt"}
                      rows={5}
                      {...register("habits")}
                      // required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <ComUpImgOne
                    onChange={onChange}
                    label={"Hình ảnh người cao tuổi"}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Thông tin hợp đồng
                  </h3>
                </div>
                <div className="sm:col-span-2">
                  <ComInput
                    type="text"
                    label="Mã hợp đồng"
                    placeholder="Vui lòng nhập mã hợp đồng"
                    {...register("contract.name")}
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <ComDatePicker
                    label="Ngày ký hợp đồng"
                    type="numbers"
                    disabledDate={DateOfLastDay}
                    name={"contract.signingDate"}
                    placeholder="Vui lòng nhập ngày ký hợp đồng"
                    {...register("contract.signingDate")}
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <ComSelect
                    size={"large"}
                    style={{
                      width: "100%",
                    }}
                    label="Thời hạn hợp đồng"
                    placeholder="Thời hạn"
                    onChangeValue={(e, value) => {
                      handleDurationChange(value);
                    }}
                    // value={selectedUser}
                    mode="default"
                    options={[
                      {
                        value: "0.5",
                        label: `6 tháng`,
                      },
                      {
                        value: "1",
                        label: `1 năm`,
                      },
                      {
                        value: "2",
                        label: `2 năm`,
                      },
                      {
                        value: "3",
                        label: `3 năm`,
                      },
                      {
                        value: "5",
                        label: `5 năm`,
                      },
                      {
                        value: "10",
                        label: `10 năm`,
                      },
                    ]}
                    // required
                    {...register("time")}
                  />
                </div>
                {startDate || (
                  <div className="sm:col-span-1">
                    <ComDatePicker
                      label="Ngày bắt đầu hợp đồng"
                      disabledDate={disabledDateStart}
                      name="contract"
                      placeholder="Vui lòng nhập ngày bắt đầu hợp đồng"
                      {...register("contract.startDate")}
                      required
                    />
                  </div>
                )}
                {!startDate || (
                  <div className="sm:col-span-1">
                    <ComDatePicker
                      label="Ngày bắt đầu hợp đồng"
                      disabledDate={disabledDateStart}
                      name="contract"
                      placeholder="Vui lòng nhập ngày bắt đầu hợp đồng"
                      {...register("contract.startDate")}
                      required
                    />
                  </div>
                )}
                {!endDate || (
                  <div className="sm:col-span-1">
                    <ComDatePicker
                      label="Ngày kết thúc hợp đồng"
                      disabledDate={disabledDateEnd}
                      name="contract"
                      placeholder="Vui lòng nhập ngày kết thúc hợp đồng"
                      {...register("contract.endDate")}
                      required
                    />
                  </div>
                )}
                {endDate || (
                  <div className="sm:col-span-1">
                    <ComDatePicker
                      label="Ngày kết thúc hợp đồng"
                      disabledDate={disabledDateEnd}
                      name="contract"
                      placeholder="Vui lòng nhập ngày kết thúc hợp đồng"
                      {...register("contract.endDate")}
                      required
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComNumber
                      type="text"
                      money
                      // defaultValue={1000}
                      value={watch("contract.price")}
                      min={0}
                      onChangeValue={(name, value) => {
                        setValue(name, value);
                      }}
                      label={"Tổng số tiền hợp đồng"}
                      placeholder={"Vui lòng nhập số tiền"}
                      {...register("contract.price")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <ComTextArea
                    type="text"
                    label="Nội dung hợp đồng"
                    rows={5}
                    name="contract"
                    placeholder="Vui lòng nhập nội dung hợp đồng"
                    {...register("contract.content")}
                    // required
                  />
                </div>
                <div className="sm:col-span-2">
                  <ComUpImg
                    onChange={onChange1}
                    label={"Hình ảnh hợp đồng"}
                    required
                  />
                </div>
                {/* <h3 className="text-lg font-semibold text-red-600 mb-2">
                  Hồ sơ người cao tuổi
                </h3> */}

                {/* <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComSelect
                      size={"large"}
                      type="text"
                      label={"Nhóm máu"}
                      showSearch
                      style={{
                        width: "100%",
                      }}
                      onChangeValue={(e, value) => {
                        if (value.length === 0) {
                          setValue("medicalRecord.bloodType", null, {
                            shouldValidate: true,
                          });
                        } else {
                          setValue("medicalRecord.bloodType", value, {
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
                      {...register("medicalRecord.bloodType")}
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
                      {...register("medicalRecord.weight")}
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
                      {...register("medicalRecord.height")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComTextArea
                      type="text"
                      label={"Thói quen sinh hoạt"}
                      placeholder={"Vui lòng nhập Thói quen sinh hoạt"}
                      rows={5}
                      {...register("habits")}
                      // required
                    />
                  </div>
                </div>
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
                          setValue("medicalRecord.diseaseCategories", null, {
                            shouldValidate: true,
                          });
                        } else {
                          setValue("medicalRecord.diseaseCategories", value, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      // mode="default"
                      options={dataDisease}
                      mode="multiple"
                      placeholder={"Vui lòng chọn nhóm máu"}
                      {...register("medicalRecord.diseaseCategories")}
                      // required
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
                      {...register("medicalRecord.underlyingDisease")}
                      // required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComTextArea
                      type="text"
                      label={"Ghi chú"}
                      placeholder={"Vui lòng nhập Ghi chú"}
                      rows={5}
                      {...register("medicalRecord.note")}
                      // required
                    />
                  </div>
                </div> */}
              </div>

            <div className="mt-10">
              <ComButton
                htmlType="submit"
                disabled={disabled}
                type="primary"
                className="block w-full rounded-md bg-[#0F296D]  text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Tạo mới
              </ComButton>
            </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
