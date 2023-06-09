"use client";
import { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import axios from "axios";
import { UserContext } from "../providers";
import { nanoid } from "nanoid";

interface Plant {
  name: string;
  nickname?: string;
  plantType: "Outdoor" | "Indoor";
  plantSize: "L" | "M" | "S";
  waterNeeded: number;
  waterAdded?: number;
  birthday: string | Date;
  image?: string;
  id?: string;
  new: boolean
}

interface FormField {
  label: string;
  name: keyof Plant;
  type: string;
  options?: string[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  nickname: Yup.string(),
  plantType: Yup.string().required("Plant type is required"),
  plantSize: Yup.string().required("Plant size is required"),
  waterNeeded: Yup.number()
    .required("Water needed is required")
    .min(0, "Water needed cannot be negative"),
  birthday: Yup.date().required("Created at is required"),
  image: Yup.string(),
});

const formFields: FormField[] = [
  { label: "Name", name: "name", type: "text" },
  { label: "Nickname", name: "nickname", type: "text" },
  {
    label: "Plant Type",
    name: "plantType",
    type: "select",
    options: ["Indoor", "Outdoor"],
  },
  {
    label: "Plant Size",
    name: "plantSize",
    type: "select",
    options: ["S", "M", "L"],
  },
  { label: "Water Needed", name: "waterNeeded", type: "number" },
  { label: "Birthday", name: "birthday", type: "date" },
];

export default function AddPlant() {
  const { data, updateUserData } = useContext(UserContext);
  console.log(data)
  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [plantRecommendations, setPlantRecommendations] = useState(null);
  const plantForm: Plant = {
    name: "",
    nickname: "",
    plantType: "Outdoor",
    plantSize: "M",
    waterNeeded: 15,
    waterAdded: 0,
    birthday: "",
    image: "",
    new: true,
  };
  const [plantState, setPlantState] = useState(plantForm);
  useEffect(() => {
    if (plantRecommendations === null) {
      return;
    }
    let neededWater = Math.floor(plantRecommendations?.minWater * 10);
    setPlantState((prevState) => ({
      ...prevState,
      name: plantRecommendations.plant_name,
      waterNeeded: neededWater || 15,
      image:
        plantRecommendations.image || plantRecommendations.wiki_image || "",
    }));
  }, [plantRecommendations]);

  const processFileData = async (fileData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PLANT_API_URL}`,
        {
          api_key: `${process.env.NEXT_PUBLIC_PLANT_API_KEY}`,
          images: [fileData],
          plant_details: [
            "common_names",
            "name_authority",
            "watering",
            "wiki_image",
            "wiki_description",
            "url",
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response;
      console.log(data);
      if (response.status !== 200) {
        alert("COULDN'T PROCESS IMAGE");
        return;
      }
      if (data?.suggestions?.length) {
        setPlantRecommendations({
          plant_name: data.suggestions[0].plant_details?.scientific_name,
          minWater: data.suggestions[0].plant_details.watering?.max,
          maxWater: data.suggestions[0].plant_details.watering?.min,
          probability: (data.suggestions[0].probability * 100).toFixed(2),
          description:
            data.suggestions[0].plant_details.wiki_description?.value.split(
              "."
            )[0],
          link: data.suggestions[0].plant_details?.url,
          image: data?.images[0]?.url,
          wiki_image: data.suggestions[0].plant_details.wiki_image?.value,
        });
      }
    } catch (error) {
      console.log("ERROR WITH IMAGE");
      console.log(error);
      alert(error);
    }
  };

  const handleUpload = (file: File) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpeg", "jpg", "png"];
    if (!allowedExtensions.includes(fileExtension)) {
      alert("Only JPEG, JPG, and PNG files are allowed");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
  };
  console.log("PREVIEW IMAGE!");
  console.log(previewImage);
  const handleProceed = () => {
    console.log("proceeding");
    if (previewImage) {
      processFileData(previewImage.split("base64,")[1]);
    }
    setStep((prevStep) => (prevStep += 1));
  };
  const handleGoBack = () => {
    console.log("going back");
    setStep((prevStep) => (prevStep -= 1));
  };
  const handleCancel = () => {
    setPreviewImage((prevState) => null);
  };

  const handlePlantSubmit = (
    values: Plant,
    { setSubmitting }: FormikHelpers<Plant>
  ) => {
    setSubmitting(true);
    console.log("Submitted", values);
    const date = new Date(values.birthday);
    const timestamp = date.getTime() / 1000; // Divide by 1000 to convert milliseconds to seconds
    const finalPlant = {...values, birthday: timestamp, id: nanoid()}
    // calculate waterAdded based on the current date
    const currentDate = new Date();
    const currentDayOfMonth = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const numberOfDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    finalPlant.waterAdded = Math.floor(finalPlant.waterNeeded * (currentDayOfMonth / numberOfDaysInMonth));
    if(plantRecommendations){
     finalPlant.image = plantRecommendations.image
    }
    console.log(finalPlant)
    if(data){
     const newData =  data
     newData.plants.push(finalPlant)
     console.log(newData)
     updateUserData(newData)
    } else {
      // Prompt the user to log in!?
      console.log("invalid add")
    }
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateToFormat = new Date(finalPlant.birthday * 1000)
    const formattedDate = dateToFormat.toLocaleDateString('en-US', options);

  };

  return (
    <div className="bg-red-500 w-full lg:w-4/5 p-2  max-w-[1000px]">
      {step === 1 && (
        <div className="max-w-md mx-auto text-black">
          <header className="bg-blue-500 py-4">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-white text-3xl font-bold">
                New Premium Feature!
              </h1>
              <p className="text-white text-lg mt-2">
                Upload A Picture of Your Plant and Get AI Suggested Plant
                Details
              </p>
            </div>
          </header>
          <div className="w-full">
            <div className="relative bg-gray-200 border border-gray-400 rounded cursor-move flex items-center justify-center p-20">
              <input
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) =>
                  handleUpload(e.target.files && e.target.files[0])
                }
              />
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Drag or Click to Upload An Image
              </label>
            </div>
          </div>

          {previewImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md">
                <h2 className="text-lg font-bold mb-4">Confirm Plant Image</h2>
                <div className="mt-2">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full h-auto"
                    width={500}
                    height={500}
                  />
                </div>
                <p className="text-gray-600 mb-6">Is this your new plant?</p>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={handleProceed}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <p className="text-gray-600 mb-6">Looking for regular UI?</p>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleProceed}
            >
              Continue without Uploading an Image
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full p-5 lg:w=3/5 text-black">
          {previewImage ? (
            <div className="flex justify-around gap-2 mb-4">
              <div className="w=1/3 flex">
                <Image
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg"
                  width={500}
                  height={500}
                />
              </div>
              <div className="w=3/5">
                <div className="text-left">
                  <div className="mb-2">
                    <h2 className="text-xl font-semibold">
                      {plantRecommendations?.plant_name}
                    </h2>
                  </div>
                  <div className="mb-2">
                    <p>
                      <strong>Plant Type: </strong>
                      {plantRecommendations?.plant_name}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p>
                      <strong>Plant Match Probability: </strong>
                      {plantRecommendations?.probability}%
                    </p>
                  </div>
                  <div className="mb-2">
                    <p>
                      <strong>Plant Description: </strong>
                      {plantRecommendations?.description}
                    </p>
                  </div>
                  <div className="mb-2">
                    <a
                      href={plantRecommendations?.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="text-blue-600">
                        Visit the Wiki for care tips!
                      </p>
                    </a>
                  </div>
                  <div className="mb-2">
                    <p>
                      <strong>Watering Guidelines: </strong>
                      {!plantRecommendations?.minWater
                        ? "Please visit the Wiki for guidance on water care"
                        : plantRecommendations?.minWater === 1
                        ? "Your plant doesn't require too much water"
                        : plantRecommendations?.minWater === 2
                        ? "Your plant requires a moderate to high amount of water"
                        : "Your plant needs a lot of water and care, choose carefully!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <Formik
            initialValues={plantState}
            validationSchema={validationSchema}
            onSubmit={handlePlantSubmit}
          >
            {({ isValid, isSubmitting }) => (
              <>
                <Form>
                  {formFields.map((field) => (
                    <div className="mb-4" key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <Field
                          as="select"
                          id={field.name}
                          name={field.name}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Field>
                      ) : (
                        <Field
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}
                      <ErrorMessage
                        name={field.name}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!isValid || isSubmitting}
                  >
                    Submit
                  </button>
                  <div className="flex my-2">
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                      onClick={handleGoBack}
                    >
                      Go Back
                    </button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
