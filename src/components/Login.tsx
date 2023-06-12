import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signIn } from "next-auth/react";
interface UserLogin {
  email: string;
  password: string;
}
interface FormField {
  label: string;
  name: keyof UserLogin;
  type: string;
}
const initialState: UserLogin = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters"
    )
    .required("Password is required"),
});

const formFields: FormField[] = [
  { label: "Email", name: "email", type: "email" },
  { label: "Password", name: "password", type: "password" },
];

const LoginForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleSubmit = async (
    values: UserLogin,
    { setSubmitting }: FormikHelpers<UserLogin>
  ) => {
    setSubmitting(true);
    const { email, password } = values;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log(result);
    if (result.error) {
      setErrorMessage(result.error);
      setSubmitting(false);
    }
  };

  return (
    <div>
    <Formik
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      className="flex flex-col items-center"
    >
      {({ isValid, isSubmitting }) => (
        <Form className="w-full text-primary max-w-lg">
          {formFields.map((field) => (
            <div
              className="form-control w-full max-w-lg flex flex-col items-center pb-4"
              key={field.name}
            >
              <label htmlFor={field.name} className="label w-full max-w-xs">
                {field.label}
              </label>
              <Field
                type={field.type}
                id={field.name}
                name={field.name}
                className="input input-bordered w-full max-w-xs"
              />
              <ErrorMessage
                name={field.name}
                component="div"
                className="text-error max-w-xs"
              />
            </div>
          ))}
          <button
            type="submit"
            className="btn w-full max-w-xs mx-auto"
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

export default LoginForm;
