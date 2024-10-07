import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../configs/firebase";
import { v4 as uuidv4 } from "uuid";

export const firebaseImgs = async (images) => {
  
  const imageUrlPromises = images?.map(async (image) => {
    const fileExtension = image.name.split(".").pop();
    const newImageName = `${uuidv4()}.${fileExtension}`;
    const imageRef = ref(storage, `images/${newImageName}`);
    await uploadBytes(imageRef, image);

    return getDownloadURL(imageRef);
  });
  const urls = await Promise.all(imageUrlPromises);

  return urls;
};
