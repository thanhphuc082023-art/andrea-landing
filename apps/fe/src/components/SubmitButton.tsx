import clsx from 'clsx';

interface SubmitButtonProps {
  isSubmitting?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  // Customizable colors
  textColor?: string;
  borderColor?: string;
  beforeBgColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  focusRingColor?: string;
  focusRingOffsetColor?: string;
  // Size props
  width?: string;
  height?: string;
}

function SubmitButton({
  isSubmitting = false,
  disabled = false,
  children,
  onClick,
  className,
  // Default colors
  textColor = 'text-white',
  borderColor = 'border-white',
  beforeBgColor = 'before:bg-white',
  hoverBgColor = 'hover:bg-[#D5D5D5]',
  hoverTextColor = 'hover:text-black',
  focusRingColor = 'focus:ring-white',
  focusRingOffsetColor = 'focus:ring-offset-[#1A253A]',
  // Default sizes
  width = 'w-[140px]',
  height = 'h-[40px]',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      onClick={onClick}
      className={clsx(
        // Base styles
        height,
        width,
        'overflow-hidden',
        'rounded-[5px] border-2',
        'relative text-[16px] font-normal leading-[1.4375em]',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Customizable styles
        textColor,
        borderColor,
        hoverBgColor,
        hoverTextColor,
        focusRingColor,
        focusRingOffsetColor,
        beforeBgColor,
        // Before pseudo-element for the diagonal effect
        'before:absolute before:bottom-0 before:right-0 before:h-[26px] before:w-[146px] before:translate-x-[25%] before:translate-y-[210%] before:-rotate-45 before:transform before:content-[""]',
        // Additional custom classes
        className
      )}
    >
      {children}
    </button>
  );
}

export default SubmitButton;
