import React from 'react';

export const ThulirHeader: React.FC = () => {
  return (
    <div className="w-full text-black select-none mb-3 document-font">
      {/* Top 3-column banner */}
      <div className="grid grid-cols-12 gap-2 items-center pb-2 text-[12px] leading-tight">
        {/* Left: Therapist Info */}
        <div className="col-span-4 flex flex-col justify-between h-full pr-1">
          <div>
            <div className="font-bold text-[13px] text-black">Dr. S.VENKATESAN, BOT</div>
            <div className="text-black font-semibold">Peadiatric Occupational Therapist</div>
          </div>
          <div className="mt-3 text-[11px] text-black">
            <span className="font-bold">E-mail:</span> thulirtherapycentre@gmail.com
          </div>
        </div>

        {/* Center: Official Brand Logo */}
        <div className="col-span-4 flex flex-col items-center justify-center text-center">
          <img
            src="/logo.png"
            alt="Thulir Special School & Therapy Centre"
            className="h-20 sm:h-22 w-auto object-contain max-w-full"
          />
        </div>

        {/* Right: Contact & Website */}
        <div className="col-span-4 flex flex-col justify-between items-end text-right h-full pl-1">
          <div className="text-[12px] font-bold text-black">
            <div>Cell: 96599 34210</div>
            <div className="text-[11.5px]">80727 27947</div>
          </div>
          <div className="mt-3 text-[11px] text-black">
            <span className="font-bold">Website:</span> www.thulirspecialschool.in
          </div>
        </div>
      </div>

      {/* Official Clinic Address Banner */}
      <div className="border border-black px-3 py-1 text-center text-[11px] sm:text-[11.5px] font-bold tracking-tight bg-white text-black">
        64/S, Aruna Nagar, Near Ponmani Kalyana Mandapam, Nallampalayam, Ganapathy Post, Coimbatore - 641 006.
      </div>

      {/* Document Title Banner */}
      <div className="text-center pt-2.5 pb-1">
        <h1 className="text-[14px] sm:text-[15px] font-bold tracking-wider uppercase text-black underline underline-offset-4">
          CHILD PSYCHIATRY ASSESSMENT - OCCUPATIONAL THERAPY
        </h1>
      </div>
    </div>
  );
};
