"use client";

import { useState, useContext } from "react";
import { TrackingContext } from "../Context/Tracking";
import { Nav1, Nav2, Nav3 } from "./SVG/Index";

const NavBar = () => {
  const [state, setState] = useState(false);
  const { currentUser, connectWallet } = useContext(TrackingContext);
  
  // Remove the session storage logic that was preventing rendering
  
  const navigation = [
    { title: "Home", path: "#" },
    { title: "Services", path: "#" },
    { title: "Contact Us", path: "#" },
    { title: "Erc20", path: "#" },
  ];

  return (
    <div className="bg-white border-b">
      {/* Main Navigation Bar */}
      <div className="flex items-center h-[50px] px-6">
        {/* Logo */}
        <img
          src="https://www.floatui.com/logo.svg"
          alt="Float UI logo"
          className="w-24"
        />

        {/* Navigation Links */}
        <div className="flex-1 flex justify-center gap-6">
          {navigation.map((item) => (
            <a
              key={item.title}
              href={item.path}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {item.title}
            </a>
          ))}
        </div>

        {/* Connect Wallet Button */}
        {currentUser ? (
          <p className="bg-black text-white px-4 py-1 rounded-full text-sm">
            {currentUser.slice(0, 6)}...{currentUser.slice(-4)}
          </p>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-black text-white px-4 py-1 rounded-full text-sm flex items-center gap-1"
          >
            Connect Wallet
            <Nav3 />
          </button>
        )}
      </div>

      {/* Mobile Menu - Hidden by default */}
      {state && (
        <div className="md:hidden border-t p-4">
          {navigation.map((item) => (
            <a
              key={item.title}
              href={item.path}
              className="block py-2 text-gray-600"
            >
              {item.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavBar;
