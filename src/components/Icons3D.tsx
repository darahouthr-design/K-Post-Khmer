import React from 'react';

interface Icon3DProps {
  className?: string;
  size?: number;
}

/**
 * 3D Composite Icon: Official Guidebook / Handbook
 * High-definition layered 3D book with red leather cover, gold embossed emblem, layered pages, and silky ribbon.
 */
export const Icon3DGuideBook: React.FC<Icon3DProps> = ({ className = 'w-10 h-10', size = 48 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="bookCoverGrad" x1="12" y1="8" x2="52" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="45%" stopColor="#DC2626" />
        <stop offset="85%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>
      <linearGradient id="bookSpineGrad" x1="10" y1="12" x2="16" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B91C1C" />
        <stop offset="50%" stopColor="#7F1D1D" />
        <stop offset="100%" stopColor="#450A0A" />
      </linearGradient>
      <linearGradient id="bookPagesGrad" x1="44" y1="14" x2="54" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="50%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      <linearGradient id="bookRibbonGrad" x1="28" y1="8" x2="36" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="70%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="bookEmblemGrad" x1="26" y1="20" x2="38" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <radialGradient id="bookGloss" cx="30" cy="18" r="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
        <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="bookShadow" x="6" y="44" width="52" height="18" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
    </defs>

    {/* Dynamic Ground Shadow */}
    <ellipse cx="32" cy="53" rx="20" ry="5.5" fill="#000000" fillOpacity="0.32" filter="url(#bookShadow)" />

    {/* Book Pages Block (Depth) */}
    <path
      d="M17 14L49 11C50.5 11 52 12.2 52 13.8V47.5C52 48.9 50.8 50 49.3 50.2L17 53.5V14Z"
      fill="url(#bookPagesGrad)"
      stroke="#D97706"
      strokeWidth="0.75"
    />
    {/* Page Edge Hatch Lines */}
    <line x1="49" y1="14" x2="49" y2="48" stroke="#D97706" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.6" />
    <line x1="51" y1="15" x2="51" y2="47" stroke="#B45309" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.4" />

    {/* Book Back Cover Rim */}
    <path
      d="M13 14C13 13 14 12 15.2 11.9L52.5 8.8C54 8.7 55 9.8 55 11.3V46C55 47.5 53.8 48.7 52.3 48.9L15 52.5C13.8 52.6 13 51.6 13 50.5V14Z"
      fill="#450A0A"
      opacity="0.7"
    />

    {/* Book Front Cover (Main 3D Body) */}
    <path
      d="M14 13C14 11.8 15 10.9 16.2 10.8L46.8 8.2C48.3 8 49.8 9.2 49.8 10.8V44.5C49.8 46 48.5 47.2 47 47.4L16.4 50C15 50.1 14 49 14 47.6V13Z"
      fill="url(#bookCoverGrad)"
      stroke="#FCA5A5"
      strokeWidth="0.8"
    />

    {/* Book Spine (Left 3D Curve) */}
    <path
      d="M11.5 15.5C11.5 13.5 12.5 12.2 14.5 11.8L16.2 11.5V49.5L14.5 49.8C12.5 50.2 11.5 48.8 11.5 47V15.5Z"
      fill="url(#bookSpineGrad)"
      stroke="#450A0A"
      strokeWidth="0.7"
    />
    {/* Spine Gold Ribs */}
    <line x1="12" y1="19" x2="16" y2="18.5" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    <line x1="12" y1="24" x2="16" y2="23.5" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    <line x1="12" y1="38" x2="16" y2="37.5" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    <line x1="12" y1="43" x2="16" y2="42.5" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

    {/* Golden Bookmark Ribbon */}
    <path
      d="M27 8.5V36L31 32L35 36V8.2C35 8.2 32 8.5 27 8.5Z"
      fill="url(#bookRibbonGrad)"
      stroke="#B45309"
      strokeWidth="0.6"
    />

    {/* Gold Embossed Emblem on Cover */}
    <circle cx="32" cy="27" r="8" fill="url(#bookEmblemGrad)" stroke="#FEF08A" strokeWidth="0.8" />
    <circle cx="32" cy="27" r="6.2" fill="none" stroke="#78350F" strokeWidth="0.6" strokeDasharray="1.2 1" />
    {/* Post Horn / Star inside Emblem */}
    <path
      d="M32 22.5L33.3 25.4L36.5 25.8L34.1 28L34.8 31.2L32 29.6L29.2 31.2L29.9 28L27.5 25.8L30.7 25.4L32 22.5Z"
      fill="#78350F"
    />

    {/* Gloss Reflection Layer */}
    <path
      d="M15 13L46 10C48 9.8 49 10.8 49 12V24L15 28V13Z"
      fill="url(#bookGloss)"
      opacity="0.6"
    />

    {/* Corner Brass Protectors */}
    <path d="M44 8.5L49.5 9V14L47 11.5L44 8.5Z" fill="#FDE047" stroke="#B45309" strokeWidth="0.5" />
    <path d="M44 47L49.5 44.5V40L47 42.5L44 47Z" fill="#FDE047" stroke="#B45309" strokeWidth="0.5" />
  </svg>
);

/**
 * 3D Composite Icon: Step 1 - Kakao Postcode Search
 * Isometric map plane, 3D glossy red location pin, glass magnifying lens.
 */
export const Icon3DMapSearch: React.FC<Icon3DProps> = ({ className = 'w-12 h-12', size = 52 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="mapGridGrad" x1="10" y1="28" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="60%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="mapPinGrad" x1="22" y1="6" x2="38" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="40%" stopColor="#EF4444" />
        <stop offset="85%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <radialGradient id="pinGloss" cx="28" cy="14" r="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="lensRingGrad" x1="36" y1="24" x2="56" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="lensGlassGrad" x1="38" y1="26" x2="52" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#BAE6FD" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.2" />
      </linearGradient>
      <filter id="pinShadow" x="20" y="32" width="22" height="12" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>

    {/* Map Shadow */}
    <polygon points="12,46 32,58 54,46 34,36" fill="#000000" fillOpacity="0.28" filter="url(#pinShadow)" />

    {/* Isometric Map Base Board (3D Slab) */}
    {/* Bottom Slab Thickness */}
    <polygon points="10,42 32,54 54,42 54,46 32,58 10,46" fill="#0369A1" stroke="#075985" strokeWidth="0.8" />
    {/* Top Slab Surface */}
    <polygon points="10,42 32,30 54,42 32,54" fill="url(#mapGridGrad)" stroke="#7DD3FC" strokeWidth="0.8" />

    {/* Map Grid Roads (Isometric Lines) */}
    <line x1="18" y1="38" x2="38" y2="50" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    <line x1="26" y1="33" x2="48" y2="45" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <line x1="22" y1="48" x2="42" y2="36" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />

    {/* Ground Pin Target Circle */}
    <ellipse cx="28" cy="40" rx="4.5" ry="2.2" fill="#0284C7" stroke="#E0F2FE" strokeWidth="0.8" />

    {/* 3D Location Pin */}
    <g transform="translate(-1, -2)">
      {/* Pin Shadow */}
      <ellipse cx="29" cy="40" rx="5" ry="2" fill="#000000" fillOpacity="0.4" />
      {/* Pin Body */}
      <path
        d="M29 39C29 39 37 25 37 17.5C37 13 33.4 9.5 29 9.5C24.6 9.5 21 13 21 17.5C21 25 29 39 29 39Z"
        fill="url(#mapPinGrad)"
        stroke="#FECACA"
        strokeWidth="0.9"
      />
      {/* Pin Highlight / Specular */}
      <circle cx="26" cy="15" r="4.5" fill="url(#pinGloss)" />
      {/* Pin Inner Dot */}
      <circle cx="29" cy="17.5" r="3.2" fill="#FFFFFF" />
      <circle cx="29" cy="17.5" r="1.8" fill="#B91C1C" />
    </g>

    {/* 3D Magnifying Glass Hovering at Top-Right */}
    <g transform="translate(4, 2)">
      {/* Handle */}
      <line x1="47" y1="41" x2="56" y2="50" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="47" y1="41" x2="56" y2="50" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Outer Golden Rim */}
      <circle cx="41" cy="35" r="9" fill="url(#lensGlassGrad)" stroke="url(#lensRingGrad)" strokeWidth="2" />
      {/* Inner Lens Reflection Curve */}
      <path d="M35 32C36.5 29.5 39.5 28.5 42 29" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
    </g>
  </svg>
);

export const Icon3DSearchMap = Icon3DMapSearch;

/**
 * 3D Composite Icon: Step 2 - Recipient Info & Detailed Address
 * 3D Building Tower with Floor/Room Units, Identification Badge & Room Key.
 */
export const Icon3DRecipient: React.FC<Icon3DProps> = ({ className = 'w-12 h-12', size = 52 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="bldgFrontGrad" x1="18" y1="12" x2="38" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="bldgSideGrad" x1="38" y1="12" x2="48" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E40AF" />
        <stop offset="100%" stopColor="#172554" />
      </linearGradient>
      <linearGradient id="bldgRoofGrad" x1="18" y1="12" x2="48" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="badgeGrad" x1="30" y1="28" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="avatarGrad" x1="38" y1="32" x2="48" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <filter id="bldgShadow" x="10" y="46" width="46" height="14" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>

    {/* Ground Drop Shadow */}
    <ellipse cx="32" cy="53" rx="18" ry="4.5" fill="#000000" fillOpacity="0.3" filter="url(#bldgShadow)" />

    {/* 3D Apartment / Building Tower */}
    {/* Roof Surface */}
    <polygon points="16,18 28,12 40,16 28,22" fill="url(#bldgRoofGrad)" stroke="#93C5FD" strokeWidth="0.8" />
    {/* Front Facade */}
    <polygon points="16,18 28,22 28,52 16,48" fill="url(#bldgFrontGrad)" stroke="#1D4ED8" strokeWidth="0.8" />
    {/* Side Facade (Depth) */}
    <polygon points="28,22 40,16 40,46 28,52" fill="url(#bldgSideGrad)" stroke="#172554" strokeWidth="0.8" />

    {/* Windows & Unit Balconies (호/층 Representation) */}
    <g fill="#FEF08A" opacity="0.9">
      {/* 4th Floor */}
      <rect x="18.5" y="24" width="3.5" height="3" rx="0.5" transform="skewY(18)" />
      <rect x="23" y="25.5" width="3.5" height="3" rx="0.5" transform="skewY(18)" />
      {/* 3rd Floor */}
      <rect x="18.5" y="30" width="3.5" height="3" rx="0.5" transform="skewY(18)" />
      <rect x="23" y="31.5" width="3.5" height="3" rx="0.5" transform="skewY(18)" />
      {/* 2nd Floor */}
      <rect x="18.5" y="36" width="3.5" height="3" rx="0.5" transform="skewY(18)" />
      <rect x="23" y="37.5" width="3.5" height="3" rx="0.5" transform="skewY(18)" />
    </g>

    {/* Side Windows */}
    <g fill="#93C5FD" opacity="0.65">
      <polygon points="30,24 37,20.5 37,23 30,26.5" />
      <polygon points="30,30 37,26.5 37,29 30,32.5" />
      <polygon points="30,36 37,32.5 37,35 30,38.5" />
    </g>

    {/* Floating 3D Recipient ID Card Badge in Front */}
    <g transform="translate(14, 18)">
      {/* Badge Shadow */}
      <rect x="13" y="11" width="24" height="24" rx="6" fill="#000000" fillOpacity="0.25" />
      {/* Badge Body */}
      <rect x="12" y="10" width="24" height="24" rx="6" fill="url(#badgeGrad)" stroke="#CBD5E1" strokeWidth="1" />
      {/* Badge Clip / Lanyard */}
      <rect x="21" y="7.5" width="6" height="3.5" rx="1" fill="#DC2626" />
      <circle cx="24" cy="9" r="1" fill="#FFFFFF" />

      {/* Avatar Icon */}
      <circle cx="24" cy="18" r="4.2" fill="url(#avatarGrad)" />
      <path d="M18 27C18 23.5 20.5 22.5 24 22.5C27.5 22.5 30 23.5 30 27" fill="url(#avatarGrad)" />

      {/* Verified Green Mini Check */}
      <circle cx="29" cy="27" r="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="0.8" />
      <path d="M28 27L28.8 27.8L30.2 26.2" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

/**
 * 3D Composite Icon: Step 3 - Courier Delivery Memo & Passcode
 * 3D Courier Van / Parcel Box with Digital Door Keypad (공동현관).
 */
export const Icon3DCourierMemo: React.FC<Icon3DProps> = ({ className = 'w-12 h-12', size = 52 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="boxTopGrad" x1="12" y1="20" x2="42" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="boxFrontGrad" x1="12" y1="34" x2="27" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="boxSideGrad" x1="27" y1="34" x2="42" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="keypadBodyGrad" x1="34" y1="10" x2="56" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="60%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="keypadScreenGrad" x1="38" y1="14" x2="52" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <filter id="boxShadow" x="8" y="44" width="48" height="16" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3.2" />
      </filter>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="27" cy="52" rx="16" ry="4.5" fill="#000000" fillOpacity="0.32" filter="url(#boxShadow)" />

    {/* 3D Courier Delivery Parcel Box */}
    {/* Box Top */}
    <polygon points="12,30 27,22 42,30 27,38" fill="url(#boxTopGrad)" stroke="#FDE68A" strokeWidth="0.8" />
    {/* Box Front */}
    <polygon points="12,30 27,38 27,53 12,45" fill="url(#boxFrontGrad)" stroke="#92400E" strokeWidth="0.8" />
    {/* Box Side */}
    <polygon points="27,38 42,30 42,45 27,53" fill="url(#boxSideGrad)" stroke="#78350F" strokeWidth="0.8" />

    {/* Parcel Sealing Tape (Kraft Tape) */}
    <polygon points="18,26.5 21,25 36,33 33,34.5" fill="#FEF3C7" opacity="0.85" />
    <polygon points="18,33 21,34.5 21,49.5 18,48" fill="#FEF3C7" opacity="0.85" />

    {/* Korea Post Red Label on Box */}
    <polygon points="29,37 39,32 39,41 29,46" fill="#EF4444" />
    <line x1="31" y1="39" x2="37" y2="36" stroke="#FFFFFF" strokeWidth="0.8" />
    <line x1="31" y1="41" x2="37" y2="38" stroke="#FFFFFF" strokeWidth="0.8" />

    {/* 3D Keypad Unit (공동현관 출입번호) Hovering Top-Right */}
    <g transform="translate(6, 2)">
      {/* Keypad Drop Shadow */}
      <rect x="29" y="9" width="22" height="30" rx="5" fill="#000000" fillOpacity="0.35" />
      {/* Keypad Frame */}
      <rect x="28" y="8" width="22" height="30" rx="5" fill="url(#keypadBodyGrad)" stroke="#475569" strokeWidth="1" />
      {/* LED Display Screen */}
      <rect x="31" y="11" width="16" height="8" rx="2" fill="url(#keypadScreenGrad)" stroke="#38BDF8" strokeWidth="0.6" />
      {/* Glowing Passcode asterisks * * * # */}
      <text x="39" y="17" fill="#F0FDF4" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        •••• #
      </text>

      {/* Keypad Buttons Grid (3x3) */}
      <g fill="#334155" stroke="#64748B" strokeWidth="0.5">
        <rect x="32" y="21" width="3.5" height="3" rx="0.8" />
        <rect x="37.2" y="21" width="3.5" height="3" rx="0.8" />
        <rect x="42.5" y="21" width="3.5" height="3" rx="0.8" />

        <rect x="32" y="25.5" width="3.5" height="3" rx="0.8" />
        <rect x="37.2" y="25.5" width="3.5" height="3" rx="0.8" />
        <rect x="42.5" y="25.5" width="3.5" height="3" rx="0.8" />

        <rect x="32" y="30" width="3.5" height="3" rx="0.8" />
        <rect x="37.2" y="30" width="3.5" height="3" rx="0.8" />
        <rect x="42.5" y="30" width="3.5" height="3" rx="0.8" fill="#10B981" />
      </g>
    </g>
  </svg>
);

/**
 * 3D Composite Icon: Step 4 - Korea Post Waybill & Full Copy
 * 3D Clipboard / Waybill with Official Red Seal and 3D Green Verified Shield.
 */
export const Icon3DWaybillCheck: React.FC<Icon3DProps> = ({ className = 'w-12 h-12', size = 52 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="boardGrad" x1="12" y1="8" x2="48" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
      <linearGradient id="paperGrad" x1="16" y1="12" x2="46" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="85%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="checkBadgeGrad" x1="34" y1="32" x2="54" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="45%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="boardShadow" x="8" y="10" width="50" height="48" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>

    {/* Drop Shadow */}
    <rect x="13" y="14" width="36" height="42" rx="4" fill="#000000" fillOpacity="0.32" filter="url(#boardShadow)" />

    {/* Clipboard Base Slab */}
    <rect x="12" y="11" width="36" height="44" rx="4" fill="url(#boardGrad)" stroke="#64748B" strokeWidth="1" />

    {/* Metal Clamp on Top */}
    <path d="M24 8H36V13H24V8Z" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="0.8" />
    <circle cx="30" cy="10.5" r="1.5" fill="#1E293B" />

    {/* Official Korea Post Waybill Paper */}
    <rect x="15" y="15" width="30" height="37" rx="2" fill="url(#paperGrad)" stroke="#CBD5E1" strokeWidth="0.6" />

    {/* Waybill Red Header Bar */}
    <rect x="17" y="17" width="26" height="4.5" rx="1" fill="#DC2626" />
    <line x1="19" y1="19.2" x2="28" y2="19.2" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

    {/* Barcode Lines */}
    <g stroke="#1E293B" strokeWidth="0.9" opacity="0.85">
      <line x1="18" y1="24" x2="18" y2="28" />
      <line x1="20" y1="24" x2="20" y2="28" strokeWidth="1.6" />
      <line x1="23" y1="24" x2="23" y2="28" strokeWidth="0.6" />
      <line x1="25" y1="24" x2="25" y2="28" strokeWidth="1.2" />
      <line x1="28" y1="24" x2="28" y2="28" />
      <line x1="30" y1="24" x2="30" y2="28" strokeWidth="1.8" />
      <line x1="33" y1="24" x2="33" y2="28" />
    </g>

    {/* Waybill Address Lines */}
    <line x1="18" y1="31" x2="33" y2="31" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="18" y1="34" x2="30" y2="34" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />
    <line x1="18" y1="37" x2="26" y2="37" stroke="#94A3B8" strokeWidth="0.9" strokeLinecap="round" />

    {/* Korea Post Red Stamp / Wax Seal */}
    <circle cx="36" cy="36" r="4.5" fill="none" stroke="#DC2626" strokeWidth="1" strokeDasharray="1.5 1" opacity="0.8" />
    <text x="36" y="38" fill="#DC2626" fontSize="5" fontWeight="bold" textAnchor="middle" opacity="0.85">
      郵
    </text>

    {/* 3D Verified Floating Checkmark Shield Badge */}
    <g transform="translate(6, 4)">
      {/* Badge Shadow */}
      <circle cx="42" cy="42" r="10" fill="#000000" fillOpacity="0.28" />
      {/* 3D Shield Badge */}
      <circle cx="42" cy="41" r="10" fill="url(#checkBadgeGrad)" stroke="#A7F3D0" strokeWidth="1.2" />
      {/* Inner Gloss Ring */}
      <path d="M35 38C36.5 34.5 40 33 44 33.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      {/* Bold White Checkmark */}
      <path
        d="M37 41L40.5 44.5L47 37.5"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

/**
 * 3D Composite Icon: Return Package Prevention (반송 방지)
 * 3D Amber Safety Shield with Korea Post Postal Horn.
 */
export const Icon3DShieldAlert: React.FC<Icon3DProps> = ({ className = 'w-10 h-10', size = 44 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="shieldGrad" x1="14" y1="8" x2="50" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <radialGradient id="shieldGloss" cx="26" cy="18" r="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Shield Body */}
    <path
      d="M32 8L48 14C48 30 42 44 32 52C22 44 16 30 16 14L32 8Z"
      fill="url(#shieldGrad)"
      stroke="#FDE68A"
      strokeWidth="1.5"
    />
    <path
      d="M32 11L45 16C45 28.5 40 40 32 48C24 40 19 28.5 19 16L32 11Z"
      fill="url(#shieldGloss)"
    />
    {/* Center Exclamation / Check */}
    <circle cx="32" cy="40" r="2.2" fill="#FFFFFF" />
    <path d="M32 20V33" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/**
 * 3D Composite Icon: Glowing 3D Sun (Light Mode)
 * Volumetric 3D sun sphere with golden specular highlights, radiant corona rays, and amber ambient glow.
 */
export const Icon3DSun: React.FC<Icon3DProps> = ({ className = 'w-9 h-9', size = 40 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <radialGradient id="sunSphereGrad" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="25%" stopColor="#FEF08A" />
        <stop offset="65%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
      <linearGradient id="sunRayGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </radialGradient>
      <filter id="sunBlur" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>
    {/* Ambient Glow */}
    <circle cx="32" cy="32" r="26" fill="url(#sunGlowGrad)" filter="url(#sunBlur)" />
    {/* 3D Sun Rays (8 Multi-layered Beveled Rays) */}
    <g stroke="url(#sunRayGrad)" strokeWidth="3" strokeLinecap="round">
      <line x1="32" y1="8" x2="32" y2="14" />
      <line x1="32" y1="50" x2="32" y2="56" />
      <line x1="8" y1="32" x2="14" y2="32" />
      <line x1="50" y1="32" x2="56" y2="32" />
      <line x1="15" y1="15" x2="20" y2="20" strokeWidth="2.5" />
      <line x1="44" y1="44" x2="49" y2="49" strokeWidth="2.5" />
      <line x1="15" y1="49" x2="20" y2="44" strokeWidth="2.5" />
      <line x1="44" y1="20" x2="49" y2="15" strokeWidth="2.5" />
    </g>
    {/* Main 3D Sun Sphere */}
    <circle cx="32" cy="32" r="16" fill="url(#sunSphereGrad)" stroke="#FDE68A" strokeWidth="1" />
    {/* Specular Glint */}
    <ellipse cx="27" cy="26" rx="5.5" ry="3.5" fill="#FFFFFF" fillOpacity="0.75" transform="rotate(-30 27 26)" />
    <circle cx="35" cy="34" r="1.5" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
);

/**
 * 3D Composite Icon: Glowing 3D Moon (Dark Mode)
 * Volumetric 3D crescent moon with celestial crater textures, night-sky nebula glow, and sparkling star.
 */
export const Icon3DMoon: React.FC<Icon3DProps> = ({ className = 'w-9 h-9', size = 40 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="moonGrad" x1="18" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="35%" stopColor="#93C5FD" />
        <stop offset="70%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
      </radialGradient>
      <filter id="moonShadow" x="4" y="4" width="56" height="56" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>
    {/* Outer Space Atmosphere Glow */}
    <circle cx="32" cy="32" r="24" fill="url(#moonGlow)" filter="url(#moonShadow)" />
    {/* 3D Crescent Moon Body */}
    <path
      d="M38 12C26.95 12 18 20.95 18 32C18 43.05 26.95 52 38 52C42.2 52 46.1 50.7 49.3 48.4C37.8 47.1 28.8 37.4 28.8 25.5C28.8 20.2 30.7 15.4 34 11.6C35.3 11.2 36.6 11.8 38 12Z"
      fill="url(#moonGrad)"
      stroke="#BFDBFE"
      strokeWidth="1.2"
    />
    {/* Crater Details */}
    <ellipse cx="27" cy="30" rx="2.5" ry="3.5" fill="#1E40AF" fillOpacity="0.35" />
    <circle cx="33" cy="40" r="2.2" fill="#1E40AF" fillOpacity="0.3" />
    <circle cx="28" cy="22" r="1.6" fill="#1E40AF" fillOpacity="0.25" />
    {/* Specular Rim Light */}
    <path
      d="M21 28C21 23 24 17 29 14"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* 4-Point Sparkling Star */}
    <g transform="translate(42, 14)">
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#FDE047" />
      <circle cx="6" cy="6" r="1.5" fill="#FFFFFF" />
    </g>
  </svg>
);

/**
 * 3D Composite Icon: Theme Switcher Pill (Day & Night)
 * Combined 3D Sun and Moon for interactive mode switching.
 */
export const Icon3DThemeToggle: React.FC<Icon3DProps & { isDark?: boolean }> = ({
  className = 'w-9 h-9',
  size = 40,
  isDark = false
}) => (isDark ? <Icon3DMoon className={className} size={size} /> : <Icon3DSun className={className} size={size} />);

/**
 * 3D Composite Icon: 3-Bar Hamburger Menu Button (ប៊ូតុង ត្រេបី)
 * High-definition layered 3D capsule button with floating metallic/red rails and depth bevels.
 */
export const Icon3DMenuHamburger: React.FC<Icon3DProps & { isOpen?: boolean }> = ({
  className = 'w-9 h-9',
  size = 40,
  isOpen = false
}) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none transition-transform duration-300 ${className}`}
  >
    <defs>
      <linearGradient id="menuBgGrad" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#450A0A" />
      </linearGradient>
      <linearGradient id="barGoldGrad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="menuShadow" x="6" y="8" width="52" height="52" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>
    {/* Ambient Shadow */}
    <rect x="10" y="12" width="44" height="44" rx="14" fill="#000000" fillOpacity="0.35" filter="url(#menuShadow)" />
    {/* 3D Capsule Slab Body */}
    <rect x="9" y="9" width="46" height="46" rx="14" fill="url(#menuBgGrad)" stroke="#F87171" strokeWidth="1.2" />
    {/* Top Rim Highlight */}
    <path d="M16 13C22 11 42 11 48 13" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

    {isOpen ? (
      /* 3D X Close Bars */
      <g stroke="url(#barGoldGrad)" strokeWidth="4.2" strokeLinecap="round">
        <line x1="22" y1="22" x2="42" y2="42" />
        <line x1="42" y1="22" x2="22" y2="42" />
      </g>
    ) : (
      /* 3D Three Rails (ត្រេបី) with Beveled End Dots */
      <g>
        {/* Top Rail */}
        <rect x="18" y="20" width="28" height="4.5" rx="2.25" fill="url(#barGoldGrad)" />
        <circle cx="21" cy="22.25" r="1.2" fill="#FFFFFF" />

        {/* Middle Rail */}
        <rect x="18" y="29.5" width="28" height="4.5" rx="2.25" fill="url(#barGoldGrad)" />
        <circle cx="21" cy="31.75" r="1.2" fill="#FFFFFF" />

        {/* Bottom Rail */}
        <rect x="18" y="39" width="28" height="4.5" rx="2.25" fill="url(#barGoldGrad)" />
        <circle cx="21" cy="41.25" r="1.2" fill="#FFFFFF" />
      </g>
    )}
  </svg>
);

/**
 * 3D Composite Icon: Developer Medallion (Hout Dara)
 * 3D Gold medal with red silk drape and verified crown/star.
 */
export const Icon3DDeveloperBadge: React.FC<Icon3DProps> = ({ className = 'w-9 h-9', size = 40 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="devGoldMedal" x1="16" y1="18" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="35%" stopColor="#FBBF24" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="ribbonLeft" x1="20" y1="6" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>
      <linearGradient id="ribbonRight" x1="36" y1="6" x2="44" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>
    {/* Silk Ribbons */}
    <polygon points="22,8 30,26 18,28 14,14" fill="url(#ribbonLeft)" />
    <polygon points="42,8 34,26 46,28 50,14" fill="url(#ribbonRight)" />
    {/* Golden Medal Disc */}
    <circle cx="32" cy="36" r="18" fill="url(#devGoldMedal)" stroke="#FDE68A" strokeWidth="1.4" />
    <circle cx="32" cy="36" r="14.5" fill="none" stroke="#FEF08A" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
    {/* Center 5-Point Star */}
    <polygon
      points="32,26 34.5,33 42,33.5 36,38 38.5,45 32,41 25.5,45 28,38 22,33.5 29.5,33"
      fill="#FFFFFF"
      stroke="#D97706"
      strokeWidth="0.75"
    />
    <circle cx="28" cy="28" r="4" fill="#FFFFFF" fillOpacity="0.45" />
  </svg>
);

/**
 * 3D Composite Icon: Saved History Box (ប្រវត្តិរក្សាទុក)
 * 3D Golden archive chest with files and counter badge.
 */
export const Icon3DHistoryBox: React.FC<Icon3DProps> = ({ className = 'w-9 h-9', size = 40 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="boxGrad" x1="12" y1="20" x2="52" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
      <linearGradient id="lidGrad" x1="10" y1="14" x2="54" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <linearGradient id="goldClock" x1="32" y1="32" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Chest Body */}
    <path d="M12 24H52V50C52 52.2 50.2 54 48 54H16C13.8 54 12 52.2 12 50V24Z" fill="url(#boxGrad)" stroke="#93C5FD" strokeWidth="1" />
    {/* Chest Lid Rim */}
    <rect x="10" y="16" width="44" height="10" rx="3" fill="url(#lidGrad)" stroke="#BFDBFE" strokeWidth="1" />
    {/* Documents Peeking Out */}
    <rect x="20" y="10" width="16" height="10" rx="1.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
    <rect x="28" y="8" width="16" height="12" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.8" />
    {/* Floating 3D Golden Clock / History Meter */}
    <circle cx="42" cy="42" r="10" fill="url(#goldClock)" stroke="#FFFFFF" strokeWidth="1.2" />
    <circle cx="42" cy="42" r="1.5" fill="#78350F" />
    <line x1="42" y1="42" x2="42" y2="36" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="42" y1="42" x2="46" y2="42" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 3D Composite Icon: Address Anatomy / Structure (រចនាសម្ព័ន្ធអាសយដ្ឋាន)
 * 3D Layered hierarchy cubes (Province -> City -> Road -> Detail).
 */
export const Icon3DStructureTree: React.FC<Icon3DProps> = ({ className = 'w-9 h-9', size = 40 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="cubeTop" x1="20" y1="12" x2="44" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="cubeLeft" x1="12" y1="28" x2="32" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="cubeRight" x1="32" y1="28" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>
    </defs>
    {/* Top Cube */}
    <rect x="22" y="8" width="20" height="16" rx="4" fill="url(#cubeTop)" stroke="#A7F3D0" strokeWidth="1.2" />
    <circle cx="32" cy="16" r="2.5" fill="#FFFFFF" />
    {/* Hierarchy Connecting Lines */}
    <path d="M32 24V32M20 32H44M20 32V38M44 32V38" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
    {/* Bottom Left Cube */}
    <rect x="10" y="38" width="20" height="18" rx="4" fill="url(#cubeLeft)" stroke="#BAE6FD" strokeWidth="1.2" />
    <line x1="14" y1="45" x2="24" y2="45" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="49" x2="20" y2="49" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    {/* Bottom Right Cube */}
    <rect x="34" y="38" width="20" height="18" rx="4" fill="url(#cubeRight)" stroke="#FBCFE8" strokeWidth="1.2" />
    <circle cx="44" cy="47" r="3" fill="#FFFFFF" />
  </svg>
);

/**
 * 3D Composite Icon: Korea Post Horn & Guide (មគ្គុទ្ទេសក៍ 우체국)
 * 3D Golden bugle / postal horn with Korea Post red lacquer badge.
 */
export const Icon3DKoreaPostHorn: React.FC<Icon3DProps> = ({ className = 'w-9 h-9', size = 40 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="goldHorn" x1="12" y1="16" x2="52" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="30%" stopColor="#FBBF24" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="postRedBadge" x1="24" y1="24" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>
    {/* Postal Horn Loop */}
    <ellipse cx="32" cy="34" rx="16" ry="12" fill="none" stroke="url(#goldHorn)" strokeWidth="5.5" />
    <ellipse cx="32" cy="34" rx="10" ry="7" fill="#0F172A" fillOpacity="0.1" />
    {/* Horn Bell / Funnel */}
    <path d="M46 22L56 12V32L46 26V22Z" fill="url(#goldHorn)" stroke="#FDE68A" strokeWidth="1" />
    {/* Horn Mouthpiece */}
    <rect x="10" y="24" width="6" height="4" rx="1" fill="url(#goldHorn)" />
    {/* Korea Post Central Wax Seal */}
    <circle cx="32" cy="34" r="8" fill="url(#postRedBadge)" stroke="#FECACA" strokeWidth="1" />
    <circle cx="32" cy="34" r="5" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
    <text x="32" y="37" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
      郵
    </text>
  </svg>
);

/**
 * 3D Composite Icon: Clear & Reset Form (សម្អាតបញ្ចូលថ្មី)
 * 3D Sweeping circular arrows with ruby-red gradient, chrome bevels, and golden magic sparkle stars.
 */
export const Icon3DClearReset: React.FC<Icon3DProps> = ({ className = 'w-5 h-5', size = 28 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="resetArrowGrad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="40%" stopColor="#EF4444" />
        <stop offset="80%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="resetArrowDepth" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B91C1C" />
        <stop offset="100%" stopColor="#450A0A" />
      </linearGradient>
      <linearGradient id="goldSparkleGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="resetShadow" x="6" y="8" width="52" height="52" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>
    {/* Shadow */}
    <circle cx="32" cy="35" r="22" fill="#000000" fillOpacity="0.25" filter="url(#resetShadow)" />

    {/* 3D Curved Arrow Track (Depth) */}
    <path
      d="M32 12C43.05 12 52 20.95 52 32C52 43.05 43.05 52 32 52C23.5 52 16.2 46.7 13.3 39.2"
      stroke="url(#resetArrowDepth)"
      strokeWidth="7"
      strokeLinecap="round"
    />
    {/* 3D Main Curved Arrow Surface */}
    <path
      d="M32 10C44.15 10 54 19.85 54 32C54 44.15 44.15 54 32 54C22.7 54 14.7 48.2 11.6 40"
      stroke="url(#resetArrowGrad)"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Specular Highlight Arc */}
    <path
      d="M32 10C40 10 48 16 51 24"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Arrow Head (3D Wedge) */}
    <polygon points="12,28 3,39 20,41" fill="url(#resetArrowDepth)" />
    <polygon points="12,26 4,37 19,39" fill="url(#resetArrowGrad)" stroke="#FECACA" strokeWidth="0.8" />
    <polygon points="12,27 8,33 16,34" fill="#FFFFFF" opacity="0.65" />

    {/* Magic Sparkle Star 1 (Top-Left) */}
    <g transform="translate(18, 16)">
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="url(#goldSparkleGrad)" />
      <circle cx="6" cy="6" r="1.2" fill="#FFFFFF" />
    </g>
    {/* Magic Sparkle Star 2 (Center-Right) */}
    <g transform="translate(34, 28) scale(0.75)">
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="url(#goldSparkleGrad)" />
      <circle cx="6" cy="6" r="1.2" fill="#FFFFFF" />
    </g>
  </svg>
);

/**
 * 3D Composite Icon: Waybill QR Code Scanner
 * Layered high-definition 3D scanner pad with QR matrix, glowing cyan/red laser scan line, and Korea Post badge.
 */
export const Icon3DQRCode: React.FC<Icon3DProps> = ({ className = 'w-10 h-10', size = 48 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="qrPadBody" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="50%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="qrScreenGrad" x1="14" y1="12" x2="50" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="qrScanBeam" x1="14" y1="0" x2="50" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
        <stop offset="20%" stopColor="#EF4444" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#F87171" stopOpacity="1" />
        <stop offset="80%" stopColor="#EF4444" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="qrBadgeGrad" x1="42" y1="6" x2="56" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
      <filter id="qrShadow" x="6" y="46" width="52" height="16" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="laserGlow" x="10" y="24" width="44" height="12" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="32" cy="54" rx="21" ry="5.5" fill="#000000" fillOpacity="0.35" filter="url(#qrShadow)" />

    {/* 3D Device Base Back Plate */}
    <rect x="10" y="9" width="44" height="45" rx="8" fill="#020617" stroke="#334155" strokeWidth="1" />
    <rect x="11" y="8" width="42" height="45" rx="7.5" fill="url(#qrPadBody)" stroke="#475569" strokeWidth="0.8" />

    {/* Inner Screen Bezel */}
    <rect x="14" y="11" width="36" height="39" rx="5" fill="url(#qrScreenGrad)" stroke="#CBD5E1" strokeWidth="0.8" />

    {/* QR Code Corner Finder Patterns (Top-Left) */}
    <rect x="18" y="15" width="9" height="9" rx="1.5" fill="#0F172A" />
    <rect x="20" y="17" width="5" height="5" rx="0.5" fill="#FFFFFF" />
    <rect x="21.5" y="18.5" width="2" height="2" fill="#0F172A" />

    {/* Finder Pattern (Top-Right) */}
    <rect x="37" y="15" width="9" height="9" rx="1.5" fill="#0F172A" />
    <rect x="39" y="17" width="5" height="5" rx="0.5" fill="#FFFFFF" />
    <rect x="40.5" y="18.5" width="2" height="2" fill="#0F172A" />

    {/* Finder Pattern (Bottom-Left) */}
    <rect x="18" y="34" width="9" height="9" rx="1.5" fill="#0F172A" />
    <rect x="20" y="36" width="5" height="5" rx="0.5" fill="#FFFFFF" />
    <rect x="21.5" y="37.5" width="2" height="2" fill="#0F172A" />

    {/* QR Data Dots / Modules */}
    <rect x="29" y="16" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="33" y="16" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="29" y="20" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="33" y="20" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="29" y="24" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />

    {/* Center cluster */}
    <rect x="18" y="27" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="22" y="27" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="25.5" y="27" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="37" y="27" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="41" y="27" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />

    {/* Bottom right cluster */}
    <rect x="30" y="34" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="34" y="34" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="38" y="34" width="3" height="3" rx="0.5" fill="#0F172A" />
    <rect x="42.5" y="34" width="3" height="3" rx="0.5" fill="#0F172A" />
    <rect x="30" y="38.5" width="3" height="3" rx="0.5" fill="#0F172A" />
    <rect x="35" y="38.5" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="39" y="39" width="3.5" height="3.5" rx="0.5" fill="#0F172A" />
    <rect x="30" y="43" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="34" y="43" width="3" height="3" rx="0.5" fill="#0F172A" />
    <rect x="38.5" y="44" width="2.5" height="2.5" rx="0.5" fill="#0F172A" />
    <rect x="42.5" y="43.5" width="3" height="3" rx="0.5" fill="#0F172A" />

    {/* Glowing Laser Scan Line across QR Code */}
    <g filter="url(#laserGlow)">
      <line x1="14" y1="30" x2="50" y2="30" stroke="url(#qrScanBeam)" strokeWidth="3" strokeLinecap="round" />
    </g>
    <line x1="15" y1="30" x2="49" y2="30" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.95" />

    {/* Laser End Pulse Bulbs */}
    <circle cx="16" cy="30" r="1.5" fill="#EF4444" />
    <circle cx="48" cy="30" r="1.5" fill="#EF4444" />

    {/* Screen Glass Reflection / Specular Highlight */}
    <path
      d="M14 13L36 11V25L14 36V13Z"
      fill="#FFFFFF"
      fillOpacity="0.18"
    />

    {/* 3D Corner Badge - Korea Post Posthorn Red/Gold Emblem */}
    <g transform="translate(41, 5)">
      <circle cx="8" cy="8" r="8" fill="url(#qrBadgeGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
      <path
        d="M5 8.5C5 6.5 6.5 5 8.5 5C10.5 5 12 6.5 12 8.5V11H10.5V8.5C10.5 7.4 9.6 6.5 8.5 6.5C7.4 6.5 6.5 7.4 6.5 8.5C6.5 9.6 7.4 10.5 8.5 10.5H12V11.8H8.5C6.5 11.8 5 10.3 5 8.5Z"
        fill="#FFFFFF"
      />
      <circle cx="11.5" cy="11.2" r="1" fill="#FEF08A" />
    </g>
  </svg>
);

/**
 * 3D Composite Icon: Customer Address Book & Directory Ledger (សៀវភៅអាសយដ្ឋានអតិថិជន)
 * Multi-layer 3D address binder with contact profile emblem, indexed tabs, metallic rings, and glossy leather texture.
 */
export const Icon3DAddressBook: React.FC<Icon3DProps> = ({ className = 'w-10 h-10', size = 48 }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="addrBookCoverGrad" x1="12" y1="8" x2="52" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="35%" stopColor="#2563EB" />
        <stop offset="75%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
      <linearGradient id="addrBookSpineGrad" x1="8" y1="12" x2="16" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="50%" stopColor="#172554" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="addrTabRed" x1="50" y1="14" x2="56" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
      <linearGradient id="addrTabGold" x1="50" y1="24" x2="56" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="addrTabGreen" x1="50" y1="34" x2="56" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="addrRingGrad" x1="11" y1="0" x2="17" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="40%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="addrBadgeGrad" x1="24" y1="18" x2="40" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="addrBookShadow" x="6" y="46" width="52" height="16" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="32" cy="54" rx="21" ry="5" fill="#000000" fillOpacity="0.32" filter="url(#addrBookShadow)" />

    {/* Indexed Color Tabs on Right Edge */}
    {/* Tab 1: Red (Post/Courier) */}
    <path d="M49 14H55C56.1 14 57 14.9 57 16V22C57 23.1 56.1 24 55 24H49V14Z" fill="url(#addrTabRed)" stroke="#991B1B" strokeWidth="0.5" />
    <text x="52" y="20.5" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">우</text>

    {/* Tab 2: Gold (VIP / Customer) */}
    <path d="M49 24H55C56.1 24 57 24.9 57 26V32C57 33.1 56.1 34 55 34H49V24Z" fill="url(#addrTabGold)" stroke="#78350F" strokeWidth="0.5" />
    <text x="51.5" y="30.5" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">고</text>

    {/* Tab 3: Emerald (Delivery Address) */}
    <path d="M49 34H55C56.1 34 57 34.9 57 36V42C57 43.1 56.1 44 55 44H49V34Z" fill="url(#addrTabGreen)" stroke="#064E3B" strokeWidth="0.5" />
    <text x="51.5" y="40.5" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">주</text>

    {/* Paper Pages Rim Behind Front Cover */}
    <path
      d="M16 11.5L49 10C50.2 9.9 51.5 10.8 51.5 12V47.5C51.5 48.7 50.3 49.7 49.2 49.8L16 52.5V11.5Z"
      fill="#F8FAFC"
      stroke="#CBD5E1"
      strokeWidth="0.75"
    />
    <line x1="49" y1="12" x2="49" y2="48" stroke="#94A3B8" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.6" />

    {/* Main Front Leather Cover */}
    <path
      d="M14 12C14 10.8 15 9.9 16.2 9.8L47 8.2C48.5 8 49.8 9.2 49.8 10.8V45C49.8 46.5 48.5 47.7 47 47.9L16.4 50.2C15 50.3 14 49.2 14 47.8V12Z"
      fill="url(#addrBookCoverGrad)"
      stroke="#93C5FD"
      strokeWidth="0.8"
    />

    {/* Elegant Leather Stitching along edges */}
    <path
      d="M17 12.5L46 11V44.5L17 46.5V12.5Z"
      fill="none"
      stroke="#60A5FA"
      strokeWidth="0.6"
      strokeDasharray="2 1.5"
      opacity="0.75"
    />

    {/* Book Spine (Left 3D Curve) */}
    <path
      d="M10.5 14C10.5 12.2 11.8 11.2 13.8 10.8L15.5 10.5V49.2L13.8 49.5C11.8 49.8 10.5 48.5 10.5 46.8V14Z"
      fill="url(#addrBookSpineGrad)"
      stroke="#0F172A"
      strokeWidth="0.7"
    />

    {/* 3D Metallic Binder Rings (Spiral Bindings) */}
    {/* Ring 1 */}
    <ellipse cx="14" cy="16" rx="3.5" ry="2" fill="url(#addrRingGrad)" stroke="#475569" strokeWidth="0.5" />
    <path d="M11 16C11 14.5 12.5 13.5 14 13.5C15.5 13.5 17 14.5 17 16" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />

    {/* Ring 2 */}
    <ellipse cx="14" cy="24" rx="3.5" ry="2" fill="url(#addrRingGrad)" stroke="#475569" strokeWidth="0.5" />
    <path d="M11 24C11 22.5 12.5 21.5 14 21.5C15.5 21.5 17 22.5 17 24" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />

    {/* Ring 3 */}
    <ellipse cx="14" cy="32" rx="3.5" ry="2" fill="url(#addrRingGrad)" stroke="#475569" strokeWidth="0.5" />
    <path d="M11 32C11 30.5 12.5 29.5 14 29.5C15.5 29.5 17 30.5 17 32" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />

    {/* Ring 4 */}
    <ellipse cx="14" cy="40" rx="3.5" ry="2" fill="url(#addrRingGrad)" stroke="#475569" strokeWidth="0.5" />
    <path d="M11 40C11 38.5 12.5 37.5 14 37.5C15.5 37.5 17 38.5 17 40" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />

    {/* Center 3D Gold Contact / User Card Badge */}
    <rect x="23" y="19" width="18" height="18" rx="4" fill="url(#addrBadgeGrad)" stroke="#FEF08A" strokeWidth="0.9" />
    {/* User Contact Silhouette inside badge */}
    <circle cx="32" cy="25" r="3.2" fill="#1E3A8A" />
    <path d="M26.5 33C26.5 30.5 28.8 29.2 32 29.2C35.2 29.2 37.5 30.5 37.5 33V34H26.5V33Z" fill="#1E3A8A" />

    {/* Address Card Lines beneath Badge */}
    <line x1="24" y1="40" x2="40" y2="40" stroke="#BFDBFE" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="26" y1="43" x2="38" y2="43" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round" />

    {/* Gloss / Light Flare Overlay */}
    <path
      d="M15 12L34 10V24L15 36V12Z"
      fill="#FFFFFF"
      fillOpacity="0.22"
    />
  </svg>
);



