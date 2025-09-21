import clsx from 'clsx';

interface SubmitButtonProps {
  isSubmitting?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  // Customizable colors
  hoverBgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderColorHover?: string;
  beforeBgColor?: string;
  hoverTextColor?: string;
  focusRingColor?: string;
  focusRingOffsetColor?: string;
  // Size props
  width?: string;
  height?: string;
  type?: 'submit' | 'button';
}

function SubmitButton({
  isSubmitting = false,
  disabled = false,
  children,
  onClick,
  className,
  // Default colors
  textColor = 'text-white',
  hoverBgColor = 'hover:before:bg-[#D5D5D5]',
  borderColor = 'border-white',
  borderColorHover = 'hover:border-brand-orange',
  beforeBgColor = 'before:bg-white',
  hoverTextColor = 'hover:text-brand-orange',
  focusRingColor = 'focus:ring-white',
  focusRingOffsetColor = 'focus:ring-offset-[#1A253A]',
  // Default sizes
  width = 'min-w-[140px]',
  height = 'h-[40px]',
  type = 'submit',
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isSubmitting}
      onClick={onClick}
      className={clsx(
        // Base styles
        height,
        width,
        'overflow-hidden',
        'group rounded-[5px] border-2',
        'relative text-[16px] font-normal leading-[1.4375em]',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Customizable styles
        textColor,
        borderColor,
        hoverTextColor,
        focusRingColor,
        focusRingOffsetColor,
        borderColorHover,
        beforeBgColor,
        hoverBgColor,
        // Before pseudo-element for the slide effect from bottom-right to top-left
        'before:absolute before:bottom-0 before:right-0 before:transition-all before:duration-300 before:content-[""]',
        'before:z-[9] before:h-[26px] before:w-[26px] before:translate-x-[50%] before:translate-y-[70%] before:-rotate-45 before:transform before:content-[""] hover:before:h-[350px] hover:before:w-[350px]',
        // Additional custom classes
        className
      )}
    >
      <span className="absolute left-1/2 top-1/2 z-[8] -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap">
        {children}
      </span>
      <span className="absolute left-1/2 top-1/2 z-[10] -translate-x-1/2 translate-y-full transform whitespace-nowrap font-semibold duration-300 group-hover:-translate-y-1/2">
        {children}
      </span>
    </button>
  );
}

export default SubmitButton;
