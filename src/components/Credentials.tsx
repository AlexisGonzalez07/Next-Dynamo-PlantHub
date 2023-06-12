import {useState} from "react";
import { signIn } from "next-auth/react";
import LoginForm from "./Login";
import SignUpForm from "./Signup";
type Props = {};

const Credentials = (props: Props) => {
    const [login, setLogin] = useState(true);

  return (
    <div className="flex flex-col w-full border-opacity-50 pb-2">
      <h1 className="text-center mt-2 h-9 text-secondary">Ready to try us out!?</h1>
      <div className="grid card bg-base-100 rounded-box place-items-center text-neutral mx-1 p-1">
      {login ? <LoginForm /> : <SignUpForm />}
      <button
              className="btn btn-primary text-secondary w-full max-w-xs my-4"
              onClick={() => setLogin((prevState) => !prevState)}
            >
              {login ? "Sign Up Instead" : "Log In Instead"}
            </button>
      </div>
      <div className="divider mx-1">OR</div>
      <div className="grid h-20 card bg-base-100 rounded-box place-items-center text-neutral mx-1 mb-2">
      <button
            className="btn glass w-full max-w-xs"
            onClick={()=> signIn("google")}
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48"><defs><path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></defs><clipPath id="b"><use xlinkHref="#a" overflow="visible"/></clipPath><path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z"/><path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/><path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/><path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/></svg>
            Access with Google
          </button>
      </div>
    </div>
  );
};

export default Credentials;
