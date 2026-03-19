import React from 'react';

import borderPng from '../assets/border.png';

export default function DecorWindow({ children, extraClasses = "max-w-3xl py-8 px-10" }) {
  return (
    <div className="flex justify-center items-stretch w-full relative py-8">
      {/* Left bar */}
      {/* <div className="relative w-48 flex flex-col justify-start">
        <img src={borderPng} alt="border top left" className="w-48 h-48 select-none pointer-events-none scale-y-[-1]" />
      </div> */}
      {/* Decor window */}
      <div className="relative max-w-5xl w-full mx-auto flex flex-col items-center justify-center px-4 md:px-12">
        {children}
      </div>
      {/* Right bar */}
      {/* <div className="relative w-48 flex flex-col justify-start">
        <img src={borderPng} alt="border top right" className="w-48 h-48 select-none pointer-events-none scale-x-[-1] scale-y-[-1]" />
      </div> */}
    </div>
  );
}
