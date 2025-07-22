import React from 'react';

interface EmailIconProps {
  className?: string;
}

export function EmailIcon({ className = '' }: EmailIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <rect opacity="0.5" width="20" height="20" fill="url(#pattern0_80_71)" />
      <defs>
        <pattern
          id="pattern0_80_71"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_80_71" transform="scale(0.0111111)" />
        </pattern>
        <image
          id="image0_80_71"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC9UlEQVR4nO2aPWsVQRSGn2gQQQSNggELLWxsBFEEK220MpWdH42ldjb+AC1SWFhYKAgKamWllWlMJYhpbGxUVLAQFAJK0CgxRxb2NpK7O7s7u3PGvA8cCOTuxzycOzvz3gUhhBBCCCGEEEIIIYQQQggRl23Ac8BUVDlYAHZ2lb0FmJNoxkmeB7bG6WvYBDySbP6V/ATY3EboRMX/NgJ3JZuR5HvAZEuX3A84+LpkcxPYUNOUd6pEh34drqxj2bMNptlK0aET/EXgj4OB20C1ClxuuHCoFR26ZDkD/HYgwXquFeBCjYvtayyFg0QX9RrYXXOBU8APBzKsp1oGTtc4mAZerXFssOiiPgD7ai50DPjmQIpFriXgRM3Y9wJvxxzfSHRRn4EDNRc8BHx1IMci1SJwtGbM+4FPFedoLDrWhS2TCmmswwGN1Ur06Kt0MuCr9MaBLGtZIVPl8cCpsrXoon4FPBx2jXk4mPMKefjPAD8Dz9dJdOhyJ7fk72XAcvZsw+VsZ9FNFvBPHUisq5AN2qUWG7QoottsSc1h9Rk5RBXdJGQxZ9V3iBZd9BA3bZFriOboRXROyd/sQNNdb6K9J3+rLRI4t6K9Jn8rLRM416K9JX/LHRI496K9JH9LHRO4LESnTv4WEwdhg4q2RAOOlcBlJdoCk789kZK/9xETuOxE20DJX+wELkvR1nPy10cCl61o6yn5e9ZTApe1aIu8FX7sdOvvRrQBNwLe+btdcfyt8jPjmCivYetdtAW8MDh6gBUZxJey5sqdZRWT5blTjcudaOvyCqzjHxxciraIL3V7eXnerWgDXgBTHSRPledIPQ73og34CBxpIfkg8M7B/Wcj2sqd29XA7t4BXBtot/ffibayvgMPgHNlSDRdVvH3eeBh+ZnU95m9aMu4JBqJJnUXqqNJL05TB+mlao5Gokndcepo0kvS1EF6gZqj8VXasCDRpO5CdTTpxWnqIL1UzdE4FC2EEEIIIYQQQgghhBBCCCGo4S88Bh70wRw8ngAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
}

export default EmailIcon;
