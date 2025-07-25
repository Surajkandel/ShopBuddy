import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="">
        

      <div className="text-center text-sm text-gray-500 border-t py-3">
        © {new Date().getFullYear()} ShopBuddy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
