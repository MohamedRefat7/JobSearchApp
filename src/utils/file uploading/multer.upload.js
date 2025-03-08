import multer, { memoryStorage } from "multer";

export const uploadCloud = () => {
  const storage = memoryStorage({});
  const multerUpload = multer({ storage });
  return multerUpload;
};
