"use client";

import { useState, useEffect } from "react";

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 w-11/12 md:w-auto max-w-md">
      <span className="text-yellow-400 text-2xl">🍪</span>
      <div className="flex-1 text-sm md:text-base">
        We use cookies for functional purposes.
      </div>
      <button
        onClick={handleAccept}
        className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm md:text-base"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
