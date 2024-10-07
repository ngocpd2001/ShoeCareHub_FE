import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../configs/firebase";
import { v4 as uuidv4 } from "uuid";

export const firebaseImg = async (image) => {
  try {
    if (image) {
      const fileExtension = image.name.split(".").pop();
      const newImageName = `${uuidv4()}.${fileExtension}`;

      const imageRef = ref(storage, `images/${newImageName}`);
      // Tải ảnh lên Firebase Storage
      await uploadBytes(imageRef, image);
      // Lấy đường dẫn URL của ảnh
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    }
  } catch (error) {
    return null;
  }
};
