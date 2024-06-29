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
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-lg shadow-lg flex items-center space-x-3 w-11/12 md:w-auto max-w-md">
      <span className="text-yellow-400 text-xl">🍪</span>
      <div className="flex-1 text-xs md:text-sm">
        We use cookies for functional purposes.
      </div>
      <button
        onClick={handleAccept}
        className="bg-gttpurple text-white px-3 py-1 rounded text-xs md:text-sm"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
