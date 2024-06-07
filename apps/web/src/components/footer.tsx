"use client";
import Link from "next/link";
import React from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-gttblack/95 text-white py-4 flex flex-col md:flex-row justify-between items-center">
      <div className="text-sm mb-4 md:mb-0 text-center md:ml-4">
        <span className="text-gray-400">guessthething.io</span>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-sm text-center md:text-left md:mr-4">
        <Link href={"/bug"}>
          <p className="text-gray-400 hover:text-white transition-colors">
            BUG REPORT
          </p>
        </Link>
        {/* <a 
          href="/resources"
          className="text-gray-400 hover:text-white transition-colors"
        >
          RESOURCES
        </a>
        <a
          href="/privacy-policy"
          className="text-gray-400 hover:text-white transition-colors"
        >
          PRIVACY POLICY
        </a>
        <a
          href="/contact"
          className="text-gray-400 hover:text-white transition-colors"
        >
          CONTACT INFORMATION
        </a> */}
      </div>
    </footer>
  );
}
