"use client";
import React from "react";

type UserProps = {
  name: string;
  level?: number;
};

const StarIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 48 48"
    >
      <g filter="url(#filter0_di_112_444)">
        <path
          fill="url(#paint0_linear_112_444)"
          d="M22.882 7.447c.454-.931 1.782-.931 2.236 0l3.593 7.36c.18.368.53.625.937.685l8.059 1.19c1.016.15 1.423 1.398.691 2.118l-5.847 5.758c-.29.286-.422.695-.354 1.095l1.378 8.12c.172 1.018-.9 1.791-1.812 1.306l-7.179-3.817a1.244 1.244 0 00-1.168 0l-7.18 3.817c-.912.485-1.983-.288-1.81-1.307l1.377-8.119c.068-.4-.064-.81-.354-1.095L9.602 18.8c-.732-.72-.325-1.967.691-2.117l8.06-1.191c.405-.06.756-.317.936-.686l3.593-7.36z"
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_di_112_444"
          width="47.541"
          height="46.479"
          x="0.229"
          y="0.748"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="3"></feOffset>
          <feGaussianBlur stdDeviation="4.5"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_112_444"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_112_444"
            result="shape"
          ></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="1.244"></feGaussianBlur>
          <feComposite
            in2="hardAlpha"
            k2="-1"
            k3="1"
            operator="arithmetic"
          ></feComposite>
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"></feColorMatrix>
          <feBlend in2="shape" result="effect2_innerShadow_112_444"></feBlend>
        </filter>
        <linearGradient
          id="paint0_linear_112_444"
          x1="17.778"
          x2="30.845"
          y1="15.734"
          y2="36.267"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff"></stop>
          <stop offset="1" stopColor="#9A88F5"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

const UserInfo: React.FC<UserProps> = ({ name, level }) => {
  return (
    <div className="flex items-center">
      <div className="mr-2">{name?.toUpperCase()}</div>
      <>
        <StarIcon />
        <div className="text-sm">{level}</div>
      </>
    </div>
  );
};

export default UserInfo;
