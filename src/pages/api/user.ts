import { createUser, getUser } from "../../utils/dynamodb";
import { uploadImage } from "../../utils/s3";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.query);
  console.log(req.method);
  const method = req.method;
  const email = req.query.email as string;
  if(!email){
    res.json({error: "Invalid req.query request"})
  }
  switch (method) {
    case "GET":
      console.log("GOING TO GET THE USER");
      const user = await getUser(email);
      console.log(user);
      if (user === undefined) {
        return res.status(400).json({ error: "No user found with that id" });
      }
      res.status(200).json(user);
      break;
    case "POST":
      console.log("YOU HIT A POST REQUEST");
      console.log(req.body);
      const data = JSON.parse(req.body);
      // loop through plants if plant has
      for (let i = 0; i < data.plants.length; i++) {
        const plant = data.plants[i];
        if(plant.image_update === false){
          continue
        }
        //This means the user previously had an image saved
        if(plant.image_key){
          //delete image from S3 bucket.
          if(plant.image === "" || plant.is_deleted){
console.log("Plant needs to be deleted")
            // ultimately resolve the image
          } else {
            //handle editting S3 Key
            //handle the new (AS UPDATE TO CURRENT KEY) plant location or content
console.log("Plant needs to be updated")
          }
          continue
        }
        //This means we are saving a new image because there is no current image key
          //we need to save the object key, and make the image = to the Location
          try {
            const {Location, key} = await uploadImage(plant.image);
            console.log("image uploaded")
            console.log(Location)
            console.log(key)
            //key includes aws_bucket_folder, which is part of the key, so we need to format it here
            data.plants[i].image = Location
            data.plants[i].image_key = key
            data.plants[i].image_update = false
          } catch (error) {
            //This could be abstracted to an error handling function
            if(error === "No image link provided to upload image"){
              // not sure why this would happen, but need to handle in case of poor code
              console.log(error)
            }
            if(error === "Error fetching image link"){
              //Need to handle this error properly
              //This is probably going to happen when the user plant id thing stops
              console.log(error)
            }
            //this means there's the unhandled error for a failed uploadImageToS3(params) call in uploadImage function()
            console.log(error)
        }
      }
      //save user to dynamo db
      data.is_modified = false
      //I believe we must surely hash the password on the front end, if the user sets up a password after not having one becuase of OAUTH
      const dataSaved = await createUser(email,JSON.stringify(data))
      res.json({message: "All data uploaded"})
      break;
      //I need to be sure to stringify the plants whenever I'm done with the app, and upload images only plants with the tag new, then reintegrate them back to the array

      //Later when I add image upload change, if they change the image, I'll have to be sure to upload to S3 as well in that scenario
      default:
      res.status(400).json("HIT");
      return
  }
}
