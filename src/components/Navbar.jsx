import React,{useState} from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { MdDarkMode , MdLightMode} from "react-icons/md";

function Navbar() {

    const [showMenu, setShowMenu] = useState(true);

    const handleMenu = () => {
        setShowMenu(!showMenu);
    };

    return(

        <div className="sticky top-0 z-10 text-white flex justify-between items-center w-full max-w-none mx-auto px-4  bg-teal-500  font-[Poppins] text-[15px] font-[500] h-20">
        <Link to = "/"><FaHome size={28} /></Link>
        <ul className="nav hidden lg:flex flex-1 justify-center space-x-4 flex-wrap"> 
            <Link to = "/home">
                <li className="navExperience p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer text-lg font-semibold">Practice</li>
            </Link>
            <Link to = "/home">
                <li className="navExperience p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer text-lg font-semibold">Analytics</li>
            </Link>
            <Link to = "/home">
                <li className="navExperience p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer text-lg font-semibold">History</li>
            </Link>
            <Link to = "/home">
                <li className="navExperience p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer text-lg font-semibold">Favorites</li>
            </Link>
            <Link to = "/home">
                <li className="navExperience p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer"><MdDarkMode size={26} /></li>
            </Link>
            
        </ul>
        <Link to = "/"><CgProfile size={28} /></Link>
        <div className="block lg:hidden">
            {showMenu ? <GiHamburgerMenu size={20} onClick={handleMenu} className="cursor-pointer"/> : <IoCloseSharp size={20} onClick={handleMenu} className="cursor-pointer"/>}
        </div>
        <div className={`fixed left-0 top-0 w-[60%] border-r h-full border-r-gray-900 bg-[#080808] ease-in-out duration-500 ${
          !showMenu ? "translate-x-0" : "-translate-x-full"
        }`}>
            <a href="/"><img src = "namelogo.avif" alt = "logo picture" className="logoImage h-20 hover:cursor-pointer rounded-full" /></a>
            <ul className="uppercase p-4 " onClick={handleMenu}>
                <a href = "#About"><li className="p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer">About Me</li></a>
                <a href = "#Experience"><li className="p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer">Experience</li></a>
                <a href = "#Projects"><li className="p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer">Projects</li></a>
                <a href = "#Education"><li className="p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer">Education</li></a>
                <a href = "#Certifications"><li className="p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer">Certifications</li></a>
                <a href = "#Contact"><li className="p-4 hover:bg-gray-700 hover:rounded-xl hover:cursor-pointer">Contact</li></a>
            </ul>
        </div>
    </div>

    );

};

export default Navbar;

