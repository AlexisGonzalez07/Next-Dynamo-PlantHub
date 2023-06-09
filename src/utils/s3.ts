import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import axios from "axios";
// Configure the AWS SDK with your credentials and desired region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION_S3,
});

const s3 = new AWS.S3();

const uploadImageToS3 = (params): Promise<string | Error> => {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error uploading image:", err);
        reject(err);
      } else {
        console.log("Image uploaded successfully:", data);
        //Just return the location of the image in the bucket
        resolve(data);
      }
    });
  });
};

export const uploadImage = async (imageLink: string) => {
  console.log("IN MY UPLOAD IMAGE")
  console.log(imageLink)
  if (!imageLink){
    throw new Error ("No image link provided to upload image")
  }
  const response = await axios.get(imageLink, { responseType: "arraybuffer" }) as any;
  console.log(response);
  console.log(response.data)
  if(response.status !== 200){
    throw new Error("Error fetching image link.")
  }
  const fileContent = response.data as ArrayBuffer;
  console.log(fileContent)
  const fileName = nanoid();
  try {
    //get image type since it will always end in .jpg, .jpeg, or .png
  const fileExtension = imageLink.split(".")[imageLink.split(".").length - 1];
  //To optimize security, I could use AWSRouter to route  traffic from a front end key 
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${fileName}${fileExtension}`,
    Body: fileContent,
  };
    const response = await uploadImageToS3(params);
    console.log("Upload response:", response);
    //need to handle any error responses here
    return response;
    // Handle the upload response or perform any additional actions
  } catch (error) {
    return error
    console.log("Upload error:", error);
    return Error("Failed upload")
  }
};
