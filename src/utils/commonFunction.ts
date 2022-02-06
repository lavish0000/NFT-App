import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const REGION = process.env.REACT_APP_S3_REGION;
const ACCESS_KEY_ID = process.env.REACT_APP_ACCESS_KEY_ID || "";
const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY || "";
const S3_URL_PREFIX = process.env.REACT_APP_S3_URL_PREFIX || "";

const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const flushPromises = () => new Promise(process.nextTick);

export const generateUniqueBrowserId = () => {
  const unique_browser_id = localStorage.getItem("unique_browser_id");
  if (unique_browser_id) return unique_browser_id;
  const navigator_info = window.navigator;
  const screen_info = window.screen;
  let uid = navigator_info.maxTouchPoints.toString();
  uid += navigator_info.userAgent.replace(/\D+/g, "");
  uid += navigator_info.plugins.length;
  uid += screen_info.height || "";
  uid += screen_info.width || "";
  uid += screen_info.pixelDepth || "";
  localStorage.setItem("unique_browser_id", uid);
  return uid;
};

export const uploadFileToS3 = async (file: File) => {
  try {
    const fileName = `${file.name.split(".")[0]}-${new Date().getTime()}`;
    await client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      })
    );
    return `${S3_URL_PREFIX}${fileName}`;
  } catch (e) {
    console.log("Upload Error", e);
  }
};
