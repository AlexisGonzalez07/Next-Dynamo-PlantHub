"use client";
import { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import AppPreview from "../../components/AppPreview";
import axios from "axios";
import { UserContext } from "../providers";
import { nanoid } from "nanoid";
import Loading from "../../components/Loading";
interface Plant {
  name: string;
  nickname: string;
  plantType: "Outdoor" | "Indoor";
  plantSize: "L" | "M" | "S";
  waterNeeded: number;
  waterAdded?: number;
  birthday: string | Date | number;
  image: string;
}
interface SavePlant extends Plant {
  birthday: number;
  id: string; 
  image_update: boolean;
}

interface FormField {
  label: string;
  name: keyof Plant;
  type: string;
  options?: string[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  nickname: Yup.string().required("Nickname is required"),
  plantType: Yup.string().required("Plant type is required"),
  plantSize: Yup.string().required("Plant size is required"),
  waterNeeded: Yup.number()
    .required("Water needed is required")
    .min(0, "Water needed cannot be negative"),
  birthday: Yup.date().required("Created at is required"),
  image: Yup.string(),
});

const formFields: FormField[] = [
  { label: "Name:", name: "name", type: "text" },
  { label: "Nickname :", name: "nickname", type: "text" },
  {
    label: "Plant Type:",
    name: "plantType",
    type: "select",
    options: ["Indoor", "Outdoor"],
  },
  {
    label: "Plant Size:",
    name: "plantSize",
    type: "select",
    options: ["S", "M", "L"],
  },
  { label: "Water Needed:", name: "waterNeeded", type: "number" },
  { label: "Birthday:", name: "birthday", type: "date" },
];

export default function AddPlant() {
  const { data, loading, error, updateUserData } = useContext(UserContext);
  const [screenWidth, setScreenWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    setScreenWidth(window.innerWidth);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
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
  };
  const [plantState, setPlantState] = useState(plantForm);
  useEffect(() => {
    if (plantRecommendations === null) {
      return;
    }
    let neededWater = Math.floor(plantRecommendations?.minWater * 10);
    setPlantState((prevState) => ({
      ...prevState,
      name: plantRecommendations?.plant_name,
      waterNeeded: neededWater || 15,
      image:
        plantRecommendations?.image || plantRecommendations?.wiki_image || "",
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
      if (response.status !== 200) {
        alert("COULDN'T PROCESS IMAGE");
        return;
      }
      if (data?.suggestions?.length) {
        let currentDescription = data.suggestions[0].plant_details?.wiki_description?.value.split(
          "."
        )[0]
        var formattedDescription = currentDescription.length > 30? currentDescription.substring(0,70) + "..." : currentDescription
        setPlantRecommendations({
          plant_name: data.suggestions[0].plant_details?.scientific_name,
          minWater: data.suggestions[0].plant_details?.watering?.max,
          maxWater: data.suggestions[0].plant_details?.watering?.min,
          probability: (data.suggestions[0].probability * 100).toFixed(2),
          description: formattedDescription,
          link: data.suggestions[0].plant_details?.url,
          image: data?.images[0]?.url,
          wiki_image: data.suggestions[0].plant_details.wiki_image?.value,
        });
      }
    } catch (error) {
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

  const handleProceed = () => {
    if (previewImage) {
      processFileData(previewImage.split("base64,")[1]);
    }
    setStep((prevStep) => (prevStep += 1));
  };
  const handleGoBack = () => {
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
    // Get ms based timestamp of the date provided
    const date = new Date(values.birthday);
    const timestamp = date.getTime();
    values.birthday = timestamp;
    const currentDate = new Date();
    const currentDayOfMonth = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const numberOfDaysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();
    values.waterAdded = Math.floor(
      values.waterNeeded * (currentDayOfMonth / numberOfDaysInMonth)
    );
    if (plantRecommendations) {
      values.image = plantRecommendations.image;
    }
    var image_update = values.image ? true : false
    const finalPlant = { ...values, id: nanoid(), image_update  } as SavePlant;
    // calculate waterAdded based on the current date
    if (data) {
      data.plants.push(finalPlant);
      updateUserData(data);
      setSubmitting(false)
      if(window){
        window.location.replace("/")
      }
    } else {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <Loading />;
  }

  if (!data && error === "Offline or Unauthenticated") {
    return <AppPreview/>;
  } else if (error) {
    return <h1>Undiagnozed home error</h1>;
  }
  return (
    <div className="w-full p-2 max-w-[1000px] ">
      {step === 1 && (
        <div className="max-w-xl mx-auto ">
          <header className="py-4 bg-accent border border-white">
            <div className="mx-auto px-4 text-white">
              <h1 className="text-3xl font-bold">New Premium Feature!</h1>
              <p className="text-lg mt-2">
                Upload A Picture of Your Plant and Get AI Suggested Plant
                Details
              </p>
            </div>
          </header>
            <div className="form-control w-full h-full flex justify-center text-white bg-accent border border-white rounded cursor-pointer">
              <label className="label">
                <span className="label-text  text-white">Upload an Image</span>
              </label>
              <div className="flex items-center justify-center">
              <input
                className="file-input file-input-bordered md:p-20 h-auto"
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) =>
                  handleUpload(e.target.files && e.target.files[0])
                }
              />
              </div>
              <label className="label">
                <span className="label-text-alt  text-white">Supported Formats: JPEG, JPG, PNG</span>
              </label>
          </div>
          {previewImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-secondary rounded-lg p-6 max-w-md">
                <h2 className="text-lg font-bold mb-4 text-primary">Confirm Plant Image</h2>
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full h-auto"
                    width={500}
                    height={500}
                  />
                </div>
                <p className="text-primary mb-6">Your plant will have this image</p>
                <div className="flex justify-around">
                  <button
                    className="btn btn-error"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleProceed}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end items-center bg-accent border border-white text-white flex-col md:flex-row">
            <h3>Looking for regular UI?</h3>
            <button
              className="btn btn-primary btn-outline m-2"
              onClick={handleProceed}
            >
              Continue without Uploading an Image
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 bg-accent w-full max-w-lg mx-auto overflow-y-auto rounded-xl">
          {previewImage ? (
            <div className="card margin-x-auto bg-secondary shadow-xl image-full">
            <figure><img src={previewImage} alt={plantRecommendations?.plant_name} /></figure>
            <div className="card-body">
              <h2 className="card-title text-base-100">Your Plant Image Profile</h2>
              <p className="text-base-100"><strong>Plant Species: </strong>
                {plantRecommendations?.plant_name}</p>
                <p className="text-base-100"><strong>Match Probability: </strong>
                {plantRecommendations?.probability}%</p>
                
                <p className="text-base-100">
                      <strong>Watering Guidelines: </strong>
                      {!plantRecommendations?.minWater
                        ? "Please visit the Wiki for guidance on water care"
                        : plantRecommendations?.minWater === 1
                        ? "Your plant doesn't require too much water"
                        : plantRecommendations?.minWater === 2
                        ? "Your plant requires a moderate to high amount of water"
                        : "Your plant needs a lot of water and care, choose carefully!"}
                    </p>
                    <p className="text-base-100"><strong>Description: </strong>
                {plantRecommendations?.description}</p>
              <div className="card-actions justify-end">
              <a
                      href={plantRecommendations?.link}
                      target="_blank"
                      rel="noreferrer"
                    ><button className="btn btn-accent ">Visit The Wiki</button></a>
              </div>
            </div>
          </div>

          ) : (
            <div className="mx-auto px-4 text-white">
              <h1 className="text-3xl font-bold">Add A New Plant</h1>
              <p className="text-sm mt-2">
                All fields are required
              </p>
            </div>
          )}

          <Formik
            initialValues={plantState}
            validationSchema={validationSchema}
            onSubmit={handlePlantSubmit}
            className="flex flex-col items-center justify-center overflow-y-auto"
          >
            {({ isValid, isSubmitting }) => (
              <>
                <Form className="w-full max-w-lg mx-auto bg-accent border border-secondary rounded py-2 text-white">
                  {formFields.map((field) => (
                    <div className="form-control w-full max-w-lg flex flex-col items-center pb-4" key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="label w-full max-w-xs"
                      >
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <Field
                          as="select"
                          id={field.name}
                          name={field.name}
                          className="input input-bordered w-full max-w-xs"
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
                          className="input input-bordered w-full max-w-xs"
                        />
                      )}
                      <ErrorMessage
                        name={field.name}
                        component="div"
                        className="text-error max-w-xs"
                        />
                    </div>
                  ))}
                    <div className="flex flex-col mt-2 gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-outline w-full max-w-xs mx-auto text-white"
                    disabled={!isValid || isSubmitting}
                  >
                    Submit
                  </button>
                    <button
                    className="btn btn-primary btn-outline w-full max-w-xs mx-auto text-white"
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
