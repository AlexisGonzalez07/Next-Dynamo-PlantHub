"use client";
import { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { UserContext, ThemeContext } from "../app/providers";
import { writeLastLogged } from "../utils/idb";
import Image from "next/image";
const FooterNav: React.FC = () => {
  const { data } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tab = usePathname();
  console.log(tab)
 
 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="btm-nav 2xl:mx-auto 2xl:w-4/5 bg-secondary text-accent">
      <a
        href="/"
        className={`no-underline ${
          tab === "/" ? "active" : ""
        }`}
      >
        <button className="w-full flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#ebdbae"><path d="M268.63-218.87h66.218v-253.717h290.304v253.717h66.218v-341.934L480-718.891 268.63-560.884v342.014ZM163.456-113.696v-499.695L480-850.218l316.544 236.747v499.775H523.565V-371h-87.13v257.304H163.456ZM480-468.761Z"/></svg>

          <span className="btm-nav-label text-primary">Home</span>
        </button>
      </a>
      <a
        href="/add"
        className={`no-underline ${
          tab === "/add" ? "active" : ""
        }`}
      >
        <button className="w-full flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#ebdbae"><path d="M430.087-272.478h101.348v-157.609h156.087v-101.348H531.435v-156.087H430.087v156.087H272.478v101.348h157.609v157.609ZM218.87-113.696q-43.63 0-74.402-30.772t-30.772-74.402v-522.26q0-43.63 30.772-74.402t74.402-30.772h522.26q43.63 0 74.402 30.772t30.772 74.402v522.26q0 43.63-30.772 74.402t-74.402 30.772H218.87Zm0-105.174h522.26v-522.26H218.87v522.26Zm0-522.26v522.26-522.26Z"/></svg>
          <span className="btm-nav-label text-primary">New Plant</span>
        </button>
      </a>
      <a
        href="/account"
        className={`no-underline ${
          tab === "/account" ? "active" : ""
        }`}
      >
        <button className="w-full flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#ebdbae"><path d="M378.837-494.391q-72.033 0-121.467-49.435-49.435-49.435-49.435-121.468 0-72.032 49.435-121.228 49.434-49.196 121.467-49.196t121.467 49.169q49.435 49.169 49.435 121.375 0 71.913-49.435 121.348-49.434 49.435-121.467 49.435ZM57.13-127.891v-126.176q0-36.281 16.658-63.227 16.658-26.946 41.69-41.728 70.37-39.804 138.326-55.902 67.957-16.098 125.153-16.098 11.76 0 25.054.62 13.293.619 26.772.619-10 23.805-16.174 52.131-6.174 28.326-10.174 52.804l-25.013-1q-39.226 0-90.987 10.5-51.761 10.5-118.413 46.639-4.273 2.045-5.995 5.761-1.723 3.717-1.723 10.187v19.696H415q7.048 28.287 20.437 55.111 13.389 26.824 30.346 50.063H57.13Zm582.432 47.456-16.018-64q-9.761-4.522-18.761-10.141-9-5.62-16.761-9.62l-63 19.239-48.478-82.434 47-46q-.718-8.522-.098-20.522.619-12 .098-20.522l-45.24-45.239 46.718-83.196 62 18.24q8.761-5 17.761-11.5t18.761-11.022l17.018-64h95.177l15 64q8 5.522 18.761 11.022t19.522 11.5l60-17.24 48.956 80.435-46.478 46q.718 11.522.478 21.575-.239 10.052-1.478 20.469l45.718 45-47.196 82.434-61-18.239q-8.761 4-19.022 9.62-10.261 5.619-18.261 10.141l-16 64h-95.177Zm47.801-139.109q31.482 0 53.255-22.11 21.773-22.111 21.773-52.707t-21.985-53.259q-21.986-22.663-53.467-22.663-31.482 0-53.265 22.876-21.783 22.875-21.783 53.471 0 30.596 21.995 52.494t53.477 21.898ZM379.16-599.565q27.601 0 46.503-19.107 18.902-19.106 18.902-46.706t-19.106-46.503q-19.106-18.902-46.826-18.902t-46.622 19.158q-18.902 19.158-18.902 46.663 0 27.604 19.077 46.5 19.078 18.897 46.974 18.897Zm-.203-65.609ZM415-233.065Z"/></svg>
          <span className="btm-nav-label text-primary">Account</span>
        </button>
      </a>
    </nav>
    // <Modal isOpen={isModalOpen} onClose={closeModal} />
  );
};
export default FooterNav;
