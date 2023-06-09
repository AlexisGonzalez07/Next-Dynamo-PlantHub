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

export default LoginForm;
