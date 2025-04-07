import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function Navbar() {
  const [showMenu, setShowMenu] = useState(true);

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="top-0 z-10 text-white flex justify-between items-center w-full max-w-none mx-auto px-6 bg-teal-600 font-[Poppins] text-[15px] font-[500] h-20 shadow-lg">
      {/* Home Icon */}
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <FaHome size={28} />
      </Link>

      {/* Desktop Navigation Links */}
      <ul className="nav hidden lg:flex flex-1 justify-center items-center space-x-6 gap-4">
        <Link to="/home">
          <li className="p-3 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer text-lg font-semibold transition-all">
            Practice
          </li>
        </Link>
        <Link to="/home">
          <li className="p-3 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer text-lg font-semibold transition-all">
            Analytics
          </li>
        </Link>
        <Link to="/history">
          <li className="p-3 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer text-lg font-semibold transition-all">
            History
          </li>
        </Link>
        <Link to="/favourites">
          <li className="p-3 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer text-lg font-semibold transition-all">
            Favorites
          </li>
        </Link>
        <Link to="/home">
          <li className="p-3 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer transition-all">
            <MdDarkMode size={26} />
          </li>
        </Link>
      </ul>

      {/* Profile Icon */}
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <CgProfile size={28} />
      </Link>

      {/* Mobile Menu Toggle */}
      <div className="block lg:hidden">
        {showMenu ? (
          <GiHamburgerMenu
            size={24}
            onClick={handleMenu}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        ) : (
          <IoCloseSharp
            size={24}
            onClick={handleMenu}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed left-0 top-0 w-[70%] sm:w-[60%] border-r h-full border-r-gray-900 bg-teal-600 ease-in-out duration-500 ${
          !showMenu ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl`}
      >
        <div className="p-4 border-b border-gray-700">
          <a href="/">
            <img
              src="namelogo.avif"
              alt="logo picture"
              className="h-16 w-16 hover:cursor-pointer rounded-full"
            />
          </a>
        </div>
        <ul className="uppercase p-4" onClick={handleMenu}>
          <a href="#About">
            <li className="p-4 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer transition-all">
              About Me
            </li>
          </a>
          <a href="#Experience">
            <li className="p-4 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer transition-all">
              Experience
            </li>
          </a>
          <a href="#Projects">
            <li className="p-4 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer transition-all">
              Projects
            </li>
          </a>
          <a href="#Education">
            <li className="p-4 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer transition-all">
              Education
            </li>
          </a>
          <a href="#Certifications">
            <li className="p-4 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer transition-all">
              Certifications
            </li>
          </a>
          <a href="#Contact">
            <li className="p-4 hover:bg-teal-700 hover:rounded-xl hover:cursor-pointer transition-all">
              Contact
            </li>
          </a>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;