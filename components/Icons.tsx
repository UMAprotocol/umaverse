import React from "react";

export const DownIcon: (
  props: React.SVGProps<SVGSVGElement>
) => React.ReactElement = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 8 5"
      width={8}
      height={5}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m1 1 3 3 3-3"
      />
    </svg>
  );
};

export const ArrowRightTailIcon: (
  props: React.SVGProps<SVGSVGElement>
) => React.ReactElement = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 12.4 10.8"
      width={12.4}
      height={10.8}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12.3 5.1 7.1 0l-.7.7L10.7 5H0v1h10.7l-4.2 4-.1.1.7.7 5.1-5.1c.1-.1.1-.2.1-.3v-.3z"
      />
    </svg>
  );
};
