"use client";

import { Fot1, Fot2 } from "../Components/Index";

const Footer = () => {
  const handleClick = (e) => {
    e.preventDefault();
    // Add any specific handling if needed
  };

  return (
    <footer className="text-center text-white bg-black lg:text-left">
      <div className="p-4 text-center">
        {/* Replace javascript:void(0) with # and add onClick handler */}
        <ul>
          <li>
            <a 
              href="#" 
              onClick={handleClick}
              className="text-white"
            >
              Link Text
            </a>
          </li>
          {/* Update other links similarly */}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
