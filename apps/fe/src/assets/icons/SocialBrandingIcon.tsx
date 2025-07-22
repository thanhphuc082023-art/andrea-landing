import React from 'react';

export function SocialBrandingIcon({
  className = '',
  width = 34,
  height = 34,
  ...props
}: {
  className?: string;
  width?: number;
  height?: number;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 34 34"
      fill="none"
      className={className}
      {...props}
    >
      <g clipPath="url(#clip0_95_1185)">
        <path
          d="M19.1906 34.0001V21.9324H23.0856L23.642 17.1614H19.1906C18.9096 13.3082 19.48 10.8441 23.923 11.5514L23.6614 7.46238C20.9183 6.90952 17.3099 6.76919 15.4543 9.32305C15.1343 9.76366 14.1828 11.8264 14.1828 12.2502V17.1614H10.0097V21.9324H14.1828V34.0001H6.25387C3.96699 34.0001 1.26001 31.4546 0.628473 29.2909C-0.259015 26.2403 -0.0364477 11.0181 0.264019 7.19016C0.603435 2.84018 3.11567 0.606256 7.35558 0.31158C12.6638 -0.0588695 21.8781 -0.151482 27.1168 0.328419C31.073 0.690449 33.3626 3.25273 33.6686 7.19016C34.0721 12.3344 34.1666 22.6059 33.6241 27.6519C33.3125 30.5425 30.7864 34.0029 27.6788 34.0029H19.1934L19.1906 34.0001Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_95_1185">
          <rect width="34" height="34" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SocialBrandingIcon;
