"use client";
import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { UserContext } from "../app/providers";
import { writeLastLogged } from "../utils/idb";
const FooterNav: React.FC = () => {
  const {data} = useContext(UserContext)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("");
  const tab = usePathname();
  const handleSignOut = async () => {
    console.log(data)
    //Will definitely want to save the user email dat in the backend, need to configure. For now, I'll focus on removing idb and then, update the globalState to setError("Offline or Anauthenticated")
    //Additionally, I would like to delete the last_credentials database
    try {
      await writeLastLogged(undefined)
      console.log("Successfully reset db")
    } catch (error) {
      console.log("didn't empty credentials")
    }
    const response = await fetch(`/api/user?email=${data.email}`,{
      method: "POST",
      body: JSON.stringify(data)
    })
    console.log(response)
    const responseData = await response.json()
    //if successfull, change the data plants and remove key new or image_updated that I add to plants during creation/update
    console.log(responseData)
    //if not successfull, then store database but add a key so we can retry the attempt when next logged in
    //if we are not online, this will fail. Must check if we are connected to our servers.
    signOut()
  }

  useEffect(() => {
    isModalOpen ? setCurrentTab("") : setCurrentTab(tab);
  }, [isModalOpen, tab]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (

      <nav className="bg-gray-800 p-4 w-full flex justify-around">
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
          onClick={() => (data ? handleSignOut() : openModal())}
          className={`${
            currentTab === "" && "animate-pulse"
          } text-white text-lg flex flex-col items-center justify-center hover:text-gray-300 transition-all duration-300`}
        >
          {data ? (
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
      <Modal isOpen={isModalOpen} onClose={closeModal} />
      </nav>
  );
};
export default FooterNav;