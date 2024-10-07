import { FormProvider, useForm } from "react-hook-form";

import ComTextArea from "../ComInput/ComTextArea";
import { Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import ComButton from "../ComButton/ComButton";
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";
import { getData, postData } from "../../../api/api";
import { useStorage } from "../../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import ComUpImgOne from "../ComUpImg/ComUpImgOne";
import { firebaseImg } from "../../../upImgFirebase/firebaseImg";
import ComSelect from "../ComInput/ComSelect";

export default function ComPost({}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [image, setImages] = useState([]);
  const [category, setCategory] = useState([]);
  const [token, setToken] = useStorage("user", {});
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [selectedMaterials, setSelectedMaterials] = useState();

  const handleChange = (e, value) => {
    console.log(value);
    setSelectedMaterials(value);
    if (value.length === 0) {
      setValue("genre", null, { shouldValidate: true });
    } else {
      setValue("genre", value, { shouldValidate: true });
    }
  };

  const options = [];

  useEffect(() => {
    getData("/category").then((data) => {
      setCategory([...data.data, ...options]);
    });
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOpen = () => {
    setIsModalOpen(true);
    if (!token?._doc?._id) {
      return navigate("/login");
    }
  };
  const methods = useForm({
    defaultValues: {
      content: "",
    },
  });
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  const onSubmit = (data) => {
    setDisabled(true);

    firebaseImgs(image).then((img) => {
      console.log(img);
      postData("/artwork", { ...data, user: token._doc._id, image: img })
        .then((r) => {
          api["success"]({
            message: "Đăng bài thành công",
            description: "Bài viết của bạn đã đăng thành công",
          });
          setTimeout(() => {
            navigate("/profile");
          }, 3000);
          handleCancel();
          setDisabled(false);
        })
        .catch((error) => {
          setDisabled(false);

          api["error"]({
            message: "Lỗi",
            description: error.response.data.error,
          });
        });
    });
  };
  const onChange = (data) => {
    const selectedImages = data;

    // Tạo một mảng chứa đối tượng 'originFileObj' của các tệp đã chọn
    // const newImages = selectedImages.map((file) => file.originFileObj);
    // Cập nhật trạng thái 'image' bằng danh sách tệp mới
    console.log([selectedImages]);
    setImages([selectedImages]);
    // setFileList(data);
  };

  useEffect(() => {
    if (image.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [image]);
  return (
    <>
      {contextHolder}

      <div className="flex justify-center  p-2 ">
        <div className="flex w-[90vw] p-2 gap-2 bg-[#f3f9f140]  xl:gap-x-8 shadow-md rounded-lg border-solid border-2 border-[#89898936]">
          <img
            alt=""
            className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white "
            src={token?._doc?.avatar}
          />
          <Input
            placeholder="Đăng tải lên "
            onClick={handleOpen}
            readonly="readonly"
          />
        </div>
      </div>
      <Modal
        title="Đăng bài viết!"
        okType="primary text-black border-gray-700"
        open={isModalOpen}
        width={800}
        style={{ top: 20 }}
        onCancel={handleCancel}
      >
        <div className="flex justify-center ">
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-2 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <ComTextArea
                placeholder={"Bạn nghĩ gì?"}
                rows={6}
                {...register("content")}
              />
              <div className="sm:col-span-2">
                <ComSelect
                  size={"large"}
                  style={{
                    width: "100%",
                  }}
                  label="Thể loại"
                  placeholder="Thể loại"
                  onChangeValue={handleChange}
                  value={selectedMaterials}
                  // mode="tags"
                  options={category}
                  {...register("genre")}
                />
              </div>
              <ComUpImgOne numberImg={1} onChange={onChange} />
              <ComButton disabled={disabled} htmlType="submit" type="primary">
                Đăng
              </ComButton>
            </form>
          </FormProvider>
        </div>
      </Modal>
    </>
  );
}
