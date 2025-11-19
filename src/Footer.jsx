import React from "react";
import { Facebook, MessageCircle, Instagram, Twitter, Youtube } from "lucide-react";

function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      url: "#",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/20 dark:bg-blue-500/20"
    },
    {
      name: "WhatsApp", 
      icon: <MessageCircle size={20} />,
      url: "#",
      textColor: "text-green-600 dark:text-green-400", 
      bgColor: "bg-green-500/20 dark:bg-green-500/20"
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      url: "#", 
      textColor: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-500/20 dark:bg-pink-500/20"
    },
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      url: "#",
      textColor: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-400/20 dark:bg-blue-400/20"
    },
    {
      name: "YouTube",
      icon: <Youtube size={20} />,
      url: "#",
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/20 dark:bg-red-500/20"
    }
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 backdrop-blur-md bg-white/60 dark:bg-gray-800/80 py-4">
      <div className="container mx-auto px-4">
        
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mb-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              className={`
                p-3 rounded-xl backdrop-blur-sm 
                border border-white/20 dark:border-gray-600/20
                shadow-lg hover:shadow-xl 
                transition-all duration-300 ease-in-out
                transform hover:scale-110
                ${social.bgColor}
                ${social.textColor}
                hover:brightness-110 /* Slight brightness increase on hover */
              `}
              aria-label={social.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Footer Text */}
        <div className="text-center">
          <p className="text-blue-600 dark:text-gray-400 text-md">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;