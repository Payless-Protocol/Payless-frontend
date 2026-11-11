/* Shared status illustrations — 100 × 100 px per the design spec (section 11).
   Ghost = not-found result, Shield = clean result + flag/retrieve success,
   Person = flagged result. */

export function GhostIllustration() {
  return (
    <svg width="100" height="100" viewBox="0 0 104 104" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="ghostClip">
          <circle cx="52" cy="52" r="46" />
        </clipPath>
      </defs>
      <g clipPath="url(#ghostClip)">
        <circle cx="52" cy="52" r="46" fill="#D9E0FB" />
        <path d="M0 80a52 52 0 0 0 104 0Z" fill="#1E3ED9" />
        <ellipse cx="30" cy="44" rx="7" ry="4.5" fill="#fff" opacity="0.95" />
        <ellipse cx="74" cy="40" rx="6" ry="4" fill="#fff" opacity="0.95" />
        <path
          d="M38 58c0-9 6-16 14-16s14 7 14 16v14c0 2-2 3-4 2l-3-2-3 2-4-2-4 2-3-2c-2 1-4 0-4-2V58Z"
          fill="#fff"
        />
        <circle cx="46" cy="54" r="2.2" fill="#181A18" />
        <circle cx="58" cy="54" r="2.2" fill="#181A18" />
        <path d="M50 60c1 1.5 3 1.5 4 0" stroke="#181A18" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function ShieldIllustration() {
  return (
    <svg width="100" height="100" viewBox="0 0 104 104" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="shieldClip">
          <circle cx="52" cy="52" r="46" />
        </clipPath>
      </defs>
      <g clipPath="url(#shieldClip)">
        <circle cx="52" cy="52" r="46" fill="#D9E0FB" />
      </g>
      <path
        d="M52 28l19 7.5V49c0 13-8.4 21.5-19 25.5C41.4 70.5 33 62 33 49V35.5L52 28Z"
        fill="#1E3ED9"
      />
      <path d="M44 51l6 6 12-13" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M77 37l1.6 4.4 4.4 1.6-4.4 1.6L77 49l-1.6-4.4L71 43l4.4-1.6L77 37Z" fill="#fff" />
      <path d="M29 70l1.2 3.3 3.3 1.2-3.3 1.2L29 79l-1.2-3.3L24.5 74.5l3.3-1.2L29 70Z" fill="#fff" />
      <path d="M62 60c4-2.5 6.5-2.5 9 0" stroke="#95C88B" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M66 66c3-1.8 5-1.8 7 0" stroke="#95C88B" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function PersonIllustration() {
  return (
    <svg width="100" height="100" viewBox="0 0 120 104" fill="none" aria-hidden="true">
      <path d="M26 44l9 16H17l9-16Z" fill="#fff" />
      <path d="M92 34l9 16H83l9-16Z" fill="#fff" />
      <path d="M28 72l8 14H20l8-14Z" fill="#fff" />
      <path d="M88 66l8 14H80l8-14Z" fill="#fff" />
      <circle cx="60" cy="30" r="10" fill="#3A2A22" />
      <path d="M50 42h20l5 28H45l5-28Z" fill="#1E3ED9" />
      <path d="M52 70h7l-2 26h-7l2-26Z" fill="#181A18" />
      <path d="M61 70h7l2 26h-7l-2-26Z" fill="#181A18" />
      <path d="M64 46l8 6-8 6V46Z" fill="#B9C3F3" />
      <path d="M42 18l10 18H32l10-18Z" fill="#E86A4D" />
      <path d="M42 24v6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="42" cy="33" r="1.4" fill="#fff" />
    </svg>
  );
}
