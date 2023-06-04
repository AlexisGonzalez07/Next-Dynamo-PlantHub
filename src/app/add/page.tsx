"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Image from "next/image";
interface Plant {
  name: string;
  nickname?: string;
  plantType: "Outdoor" | "Indoor";
  plantSize: "L" | "M" | "S";
  waterNeeded: number;
  waterAdded?: number;
  birthday: string;
  image?: string;
}
interface ImageField {
  image: File | "";
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
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleUpload = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
  };
  const handleProceed = () => {
    console.log("proceeding");
    setStep(2);
  };
  const handleCancel = () => {
    setSelectedImage((prevState) => null);
    setPreviewImage((prevState) => null);
  };
  const plantState: Plant = {
    name: "",
    nickname: "",
    plantType: "Outdoor",
    plantSize: "M",
    waterNeeded: 15,
    waterAdded: 0,
    birthday: "",
    image: "",
  };

  const handlePlantSubmit = (
    values: Plant,
    { setSubmitting }: FormikHelpers<Plant>
  ) => {
    setSubmitting(true);
    console.log("Submitted", values);
  };

  return (
    <div className="bg-yellow-500">
      {step === 1 && (
        <div className="max-w-md mx-auto text-black">
          <header className="bg-blue-500 py-4">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-white text-3xl font-bold">
                Check out Our New Feature!
              </h1>
              <p className="text-white text-lg mt-2">
                New Feature!: Upload A Picture of Your Plant and Get Plant
                Details
              </p>
            </div>
          </header>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image Upload
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files && e.target.files[0])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {previewImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md">
                <h2 className="text-lg font-bold mb-4">Confirm Image Upload</h2>
                <div className="mt-2">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full h-auto"
                    width={500}
                    height={500}
                  />
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to proceed with this image upload?
                </p>
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
          <p className="text-gray-600 mb-6">Looking for regular UI?</p>
          <div className="flex justify-end">
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
        <Formik
          initialValues={plantState}
          validationSchema={validationSchema}
          onSubmit={handlePlantSubmit}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="max-w-md mx-auto text-black">
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
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
