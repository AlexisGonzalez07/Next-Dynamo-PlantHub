import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useState } from "react";
import * as Yup from "yup";
interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface SignUpUser extends User {
  confirmPassword: string;
}

interface FormField {
  label: string;
  name: keyof SignUpUser;
  type: string;
}

const SignUpForm: React.FC = () => {
  const initialState: SignUpUser = {
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  };
  const [errorMessage, setErrorMessage] = useState<string>("");
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    firstName: Yup.string()
      .min(2, "First name must have at least 2 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .min(2, "Last name must have at least 2 characters")
      .required("Last name is required"),
    username: Yup.string(),
    password: Yup.string()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formFields: FormField[] = [
    { label: "Email *", name: "email", type: "email" },
    { label: "First Name *", name: "firstName", type: "text" },
    { label: "Last Name *", name: "lastName", type: "text" },
    { label: "Username", name: "username", type: "text" },
    { label: "Password *", name: "password", type: "password" },
    { label: "Confirm Password *", name: "confirmPassword", type: "password" },
  ];

  const handleSubmit = async (
    values: SignUpUser,
    { setSubmitting }: FormikHelpers<SignUpUser>
  ) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Replace with your own data
      });
      const data = await response.json();
      if (data?.error) {
        //allow resubmission
        setSubmitting(false);
        setErrorMessage(data.error);
      } else {
        //reload the client after signing the token 
        console.log("SUCCESS!");
      }
    } catch (error) {
      setErrorMessage(error);
      setSubmitting(true);

    }
  };

  return (
    <Formik
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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
              <Field
                type={field.type}
                id={field.name}
                name={field.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <ErrorMessage
                name={field.name}
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          ))}
          <h4 className="text-white">{errorMessage}</h4>
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
  );
};

export default SignUpForm;
