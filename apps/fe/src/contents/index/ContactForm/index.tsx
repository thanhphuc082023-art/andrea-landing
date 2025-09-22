import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { AnimatePresence, m } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPhone } from 'react-icons/fa6';

import SubmitButton from '@/components/SubmitButton';

import { useCaptcha } from '@/hooks/useCaptcha';

import {
  type ContactFormData,
  contactFormSchema,
} from '@/lib/validations/contact';

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const {
    captchaData,
    loading: captchaLoading,
    generateCaptcha,
    verifyCaptcha,
  } = useCaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      industry: '',
      message: '',
      captcha: '',
    },
  });

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  // Watch captcha input and validate real-time
  const captchaValue = watch('captcha');
  useEffect(() => {
    if (
      captchaValue &&
      captchaValue.length === Number(process.env.NEXT_PUBLIC_MAX_LENGTH_CAPTCHA)
    ) {
      if (!verifyCaptcha(captchaValue)) {
        setError('captcha', {
          type: 'manual',
          message: 'Mã xác thực không đúng',
        });
      } else {
        // Clear error if captcha is correct
        setError('captcha', { message: '' });
      }
    }
  }, [captchaValue, verifyCaptcha, setError]);

  // Auto hide success message after 2 seconds
  useEffect(() => {
    if (submitStatus.type === 'success') {
      setShowSuccessOverlay(true);
      const timer = setTimeout(() => {
        setShowSuccessOverlay(false);
        setSubmitStatus({ type: null, message: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [submitStatus.type]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Clear any previous captcha errors
      setError('captcha', { message: '' });

      // Verify captcha client-side first
      if (!verifyCaptcha(data.captcha)) {
        setError('captcha', {
          type: 'manual',
          message: 'Mã xác thực không đúng',
        });
        return;
      }

      // Submit form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          captchaId: captchaData?.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra');
      }

      setSubmitStatus({
        type: 'success',
        message:
          'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
      });
      reset();
      generateCaptcha(); // Generate new captcha
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi form',
      });
      generateCaptcha(); // Generate new captcha on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={clsx('max-sd:min-h-[500px] bg-brand-orange-light py-12')}
    >
      <div className="content-wrapper relative flex h-full items-center justify-center">
        <div className={clsx('mx-auto w-full max-w-[795px]')}>
          {/* Section Title */}
          <div className={clsx('mb-16 text-center max-md:mb-12')}>
            <h2
              className={clsx(
                'font-playfair text-4xl font-medium text-white lg:text-5xl'
              )}
            >
              Đồng hành cùng chúng tôi
            </h2>
          </div>

          {/* Status Messages - Only show error messages */}
          {submitStatus.type === 'error' && (
            <div
              className={clsx(
                'mb-6 rounded-lg p-4 text-center',
                'border border-white/20 bg-white/10 text-white backdrop-blur-sm'
              )}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className={clsx('space-y-7')}>
            {/* First Row - Name */}
            <div className={clsx('relative')}>
              <input
                {...register('name')}
                type="text"
                placeholder="Tên liên hệ"
                aria-label="Tên liên hệ"
                className={clsx(
                  'w-full py-1',
                  'border-b border-white bg-transparent text-white',
                  'placeholder:font-[400] placeholder:text-white',
                  'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                  'transition-colors duration-300',
                  errors.name && 'border-red-500'
                )}
              />
              {errors.name && (
                <p className="text-primary absolute bottom-0 left-0 translate-y-full transform text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Second Row - Phone and Email */}
            <div className={clsx('grid grid-cols-2 gap-2 md:gap-4')}>
              <div className={clsx('relative')}>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="Số điện thoại"
                  aria-label="Số điện thoại"
                  className={clsx(
                    'w-full py-1',
                    'border-b border-white bg-transparent text-white',
                    'placeholder:font-[400] placeholder:text-white',
                    'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                    'transition-colors duration-300',
                    errors.phone && 'border-red-500'
                  )}
                />
                {errors.phone && (
                  <p className="text-primary absolute bottom-0 left-0 translate-y-full transform text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className={clsx('relative')}>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  className={clsx(
                    'w-full py-1',
                    'border-b border-white bg-transparent text-white',
                    'placeholder:font-[400] placeholder:text-white',
                    'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                    'transition-colors duration-300',
                    errors.email && 'border-red-500'
                  )}
                />
                {errors.email && (
                  <p className="text-primary absolute bottom-0 left-0 translate-y-full transform text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Third Row - industry and Security Code */}
            <div
              className={clsx('grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-4')}
            >
              <div className={clsx('relative md:col-span-1')}>
                <input
                  {...register('industry')}
                  type="text"
                  placeholder="Tên công ty và Ngành nghề"
                  aria-label="Tên công ty và Ngành nghề"
                  className={clsx(
                    'w-full py-1',
                    'border-b border-white bg-transparent text-white',
                    'placeholder:font-[400] placeholder:text-white',
                    'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                    'transition-colors duration-300',
                    errors.industry && 'border-red-500'
                  )}
                />
                {errors.industry && (
                  <p className="text-primary absolute bottom-0 left-0 translate-y-full transform text-sm">
                    {errors.industry.message}
                  </p>
                )}
              </div>

              <div className="relative md:col-span-1">
                <input
                  {...register('captcha')}
                  type="text"
                  placeholder="Mã bảo mật"
                  aria-label="Mã bảo mật"
                  className={clsx(
                    'w-full py-1',
                    'border-b border-white bg-transparent text-white',
                    'placeholder:font-[400] placeholder:text-white',
                    'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                    'transition-colors duration-300',
                    errors.captcha && 'border-red-500'
                  )}
                />
                {errors.captcha && (
                  <p className="text-primary absolute bottom-0 left-0 translate-y-full transform text-sm">
                    {errors.captcha.message}
                  </p>
                )}

                <div className="absolute -top-[13px] right-0 flex h-full items-center justify-center">
                  {captchaData && !captchaLoading && (
                    <>
                      {/* Captcha Display */}
                      <div
                        className="flex h-[44px] items-center justify-center rounded bg-white"
                        title="Mã xác thực"
                        dangerouslySetInnerHTML={{ __html: captchaData.svg }}
                      />
                    </>
                  )}
                  {captchaLoading && (
                    <div className="flex h-[44px] min-w-[120px] items-center justify-center rounded bg-white px-4">
                      <span className="text-gray-500">
                        <LoaderCircle className="animate-spin" />
                      </span>
                    </div>
                  )}

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="justify-centertext-white transition-colorr flex h-[44px] w-[44px] items-center justify-center text-white"
                    title="Tạo mã xác thực mới"
                    aria-label="Tạo mã xác thực mới"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Fourth Row - Message */}
            <div className={clsx('relative')}>
              <input
                {...register('message')}
                placeholder="Yêu cầu tư vấn và báo giá"
                aria-label="Yêu cầu tư vấn và báo giá"
                className={clsx(
                  'w-full py-1',
                  'border-b border-white bg-transparent text-white',
                  'placeholder:font-[400] placeholder:text-white',
                  'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                  'resize-none outline-none transition-colors duration-300',
                  errors.message && 'border-red-500'
                )}
              />
              {errors.message && (
                <p className="text-primary absolute bottom-0 left-0 translate-y-full transform text-sm">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div
              className={clsx(
                'flex items-center justify-center gap-[20px] text-center'
              )}
            >
              <SubmitButton
                isSubmitting={isSubmitting}
                disabled={isSubmitting}
                textColor="text-white"
                borderColor="border-white"
                beforeBgColor="before:bg-white"
                hoverBgColor="hover:before:bg-white"
                hoverTextColor="hover:text-brand-orange"
                focusRingColor="focus:ring-white"
                focusRingOffsetColor="focus:ring-offset-white"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi'}
              </SubmitButton>
              <SubmitButton
                isSubmitting={isSubmitting}
                disabled={isSubmitting}
                onClick={() => {
                  window.location.href = `tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`;
                }}
                className="group"
                textColor="text-white"
                borderColor="border-white"
                beforeBgColor="before:bg-white"
                hoverBgColor="hover:before:bg-white"
                hoverTextColor="hover:text-brand-orange"
                focusRingColor="focus:ring-white"
                focusRingOffsetColor="focus:ring-offset-white"
              >
                <span className="flex items-center justify-center gap-[6px]">
                  <FaPhone className="group-hover:text-brand-orange text-white duration-300" />
                  <span className="text-[13px]">
                    {process.env.NEXT_PUBLIC_PHONE_NUMBER}
                  </span>
                </span>
              </SubmitButton>
            </div>
          </form>
        </div>

        {/* Success Overlay with Framer Motion */}
        <AnimatePresence>
          {showSuccessOverlay && (
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
            >
              <m.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: -50, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: 'easeOut',
                }}
                className="mx-4 max-w-md rounded-2xl px-8 py-12 text-center"
              >
                {/* Success Icon */}
                <m.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    type: 'spring',
                    stiffness: 200,
                  }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                >
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <m.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5,
                        ease: 'easeInOut',
                      }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </m.div>

                {/* Success Message */}
                <m.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4,
                  }}
                  className="mb-2 text-xl font-semibold text-white"
                >
                  Gửi thành công!
                </m.h3>

                <m.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.6,
                  }}
                  className="text-sm leading-relaxed text-white"
                >
                  Cảm ơn bạn đã liên hệ! <br className="hidden max-md:block" />
                  Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </m.p>

                {/* Celebration particles */}
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.8,
                  }}
                  className="pointer-events-none absolute inset-0"
                >
                  {[...Array(6)].map((_, i) => (
                    <m.div
                      key={i}
                      initial={{
                        scale: 0,
                        x: 0,
                        y: 0,
                        rotate: 0,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        x: [0, (i % 2 === 0 ? 1 : -1) * (50 + i * 20)],
                        y: [0, -50 - i * 10],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.8 + i * 0.1,
                        ease: 'easeOut',
                      }}
                      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-yellow-400"
                    />
                  ))}
                </m.div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default ContactForm;
