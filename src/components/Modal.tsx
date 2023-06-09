import { useState, useEffect } from "react";
import SignUpForm from "./Signup";
import LoginForm from "./Login";
import { signIn } from "next-auth/react";
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [login, setLogin] = useState(true);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  const closeModal = () => {
    onClose();
  };

  return isOpen ? (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

      <div className="modal-container bg-black w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6">
          <div className="modal-header">
            <h3 className="modal-title text-lg font-semibold">
              {login ? "WELCOME BACK" : "JOIN OUR PLANT COMMUNITY"}
            </h3>
            <button className="modal-close ml-auto" onClick={closeModal}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {login ? <LoginForm /> : <SignUpForm />}
          </div>
          <div className="modal-footer flex justify-around mt-4">
            <button
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setLogin((prevState) => !prevState)}
            >
              {login ? "Sign Up Instead" : "Log In Instead"}
            </button>
            <button
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
          <button
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={()=> signIn("google")}
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
export default Modal;
