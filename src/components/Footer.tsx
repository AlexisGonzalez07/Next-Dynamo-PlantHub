"use client"
import { useState } from "react";
import Modal from './Modal.tsx'
const FooterNav: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  return (
    <footer className="fixed inset-x-0 bottom-6 lg:bottom-10 xl:bottom-12 z-50">
      <nav className="bg-gray-800 p-4 lg:w-4/5">
        <a href="/">Home</a>
        <a href="/add">Add Plant</a>
        <button onClick={openModal}>Open Modal</button>
        <Modal isOpen={isModalOpen} onClose={closeModal} />
      </nav>
    </footer>
  );
};
export default FooterNav;
