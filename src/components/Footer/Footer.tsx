import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <footer className="w-[100%] bg-primary-600 mt-10 flex justify-center py-2">
      <div className="w-[80%] flex">
        <div className="text-white">Footer</div>
      </div>
    </footer>
  );
};

export default Header;
