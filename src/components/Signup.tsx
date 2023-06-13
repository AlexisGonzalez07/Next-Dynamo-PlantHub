import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useState } from "react";
import { signIn } from "next-auth/react";
import * as Yup from "yup";

interface SignUpUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface FormField {
  label: string;
  name: keyof SignUpUser;
  type: string;
}

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

const initialState: SignUpUser = {
  email: "",
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  confirmPassword: "",
};
const SignUpForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (
    values: SignUpUser,
    { setSubmitting }: FormikHelpers<SignUpUser>
  ) => {
    setSubmitting(true);
    const { email, firstName, lastName, username, password, confirmPassword } =
      values;
      const result = await signIn("credentials", {
        email,
        firstName,
        lastName,
        username,
        password,
        confirmPassword,
        redirect: false,
      });
      console.log(result);
      if(result.error){
        setErrorMessage(result.error)
        setSubmitting(false)
      }
    }

  return (
    <div className="flex flex-col items-center">
    <Formik
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }) => (
        <Form className="w-full text-secondary max-w-lg h-auto ">          {formFields.map((field) => (
            <div className="form-control w-full max-w-lg flex flex-col items-center" key={field.name}>
             <label
                htmlFor={field.name}
                className="label w-full max-w-xs text-secondary"
              >
                {field.label}
              </label>
              <Field
                type={field.type}
                id={field.name}
                name={field.name}
                className="input input-bordered w-full max-w-xs text-secondary"
              />
              <ErrorMessage
                name={field.name}
                component="div"
                className="text-error max-w-xs"
              />
            </div>
          ))}
          <h4 className="text-white">{errorMessage}</h4>
          <button
            type="submit"
            className="btn btn-secondary w-full max-w-xs my-2 mx-auto"
            disabled={!isValid || isSubmitting}
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
    </div>
  );
};

export default SignUpForm;