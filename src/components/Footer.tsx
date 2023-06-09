"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
const FooterNav: React.FC = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("");
  const tab = usePathname();
  useEffect(() => {
    isModalOpen ? setCurrentTab("") : setCurrentTab(tab);
  }, [isModalOpen, tab]);

  useEffect(() => {
    !session ? openModal() : closeModal() 
  }, [session]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <footer
      className={`fixed inset-x-0 bottom-6 lg:bottom-10 xl:bottom-12 z-50 flex justify-center`}
    >
      <nav className="bg-gray-800 p-4 w-full lg:w-4/5 flex justify-around">
        <a
          href="/"
          className={`${
            currentTab === "/" ? "animate-pulse" : ""
          } text-white text-lg flex flex-col items-center justify-center hover:text-gray-300 transition-all duration-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span className="text-xs">Home</span>
        </a>
        <a
          href="/add"
          className={`${
            currentTab === "/add" ? "animate-pulse" : ""
          } text-white text-lg flex flex-col items-center justify-center hover:text-gray-300 transition-all duration-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          <span className="text-xs">Add Plant</span>
        </a>
        <button
          onClick={() => (session ? signOut() : openModal())}
          className={`${
            currentTab === "" && "animate-pulse"
          } text-white text-lg flex flex-col items-center justify-center hover:text-gray-300 transition-all duration-300`}
        >
          {session ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>

              <span className="text-xs">Sign Out</span>
            </>
          ) : (
            <>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
              <span className="text-xs">Account</span>
            </>
          )}
        </button>
      </nav>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </footer>
  );
};
export default FooterNav;

// export const getServerSideProps = async(context) => {
//   const session = await getSession(context)
//   return {
//     props:{session},
//   }
// }