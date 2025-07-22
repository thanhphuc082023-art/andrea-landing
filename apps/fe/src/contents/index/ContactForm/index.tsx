import clsx from 'clsx';

function ContactForm() {
  return (
    <section className={clsx('bg-gray-900 py-20 lg:py-28')}>
      <div className={clsx('content-wrapper mx-auto')}>
        <div className={clsx('mx-auto max-w-4xl')}>
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

          {/* Contact Form */}
          <form className={clsx('space-y-3 md:space-y-6')}>
            {/* First Row - Name */}
            <div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tên của bạn"
                aria-label="Tên của bạn"
                className={clsx(
                  'w-full px-4 py-3',
                  'border border-gray-400/50 bg-transparent text-white',
                  'placeholder:text-gray-400',
                  'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                  'transition-colors duration-300'
                )}
              />
            </div>

            {/* Second Row - Phone and Email */}
            <div className={clsx('grid grid-cols-2 gap-2 md:gap-6')}>
              <div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Số điện thoại"
                  aria-label="Số điện thoại"
                  className={clsx(
                    'w-full px-4 py-3',
                    'border border-gray-400/50 bg-transparent text-white',
                    'placeholder:text-gray-400',
                    'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                    'transition-colors duration-300'
                  )}
                />
              </div>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  className={clsx(
                    'w-full px-4 py-3',
                    'border border-gray-400/50 bg-transparent text-white',
                    'placeholder:text-gray-400',
                    'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                    'transition-colors duration-300'
                  )}
                />
              </div>
            </div>

            {/* Third Row - Company and Security Code */}
            <div
              className={clsx('grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6')}
            >
              <div className={clsx('md:col-span-1')}>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Tên công ty/ Ngành nghề"
                  aria-label="Tên công ty/ Ngành nghề"
                  className={clsx(
                    'w-full px-4 py-3',
                    'border border-gray-400/50 bg-transparent text-white',
                    'placeholder:text-gray-400',
                    'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                    'transition-colors duration-300'
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 md:col-span-1 md:grid-cols-3 md:gap-6">
                <div className="col-span-1 md:col-span-2">
                  <input
                    id="security-code"
                    name="securityCode"
                    type="text"
                    placeholder="Mã bảo mật"
                    aria-label="Mã bảo mật"
                    className={clsx(
                      'w-full px-4 py-3',
                      'border border-gray-400/50 bg-transparent text-white',
                      'placeholder:text-gray-400',
                      'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                      'transition-colors duration-300'
                    )}
                  />
                </div>
                <div className="col-span-1 md:col-span-1">
                  <input
                    id="captcha"
                    name="captcha"
                    type="text"
                    aria-label="Mã xác thực"
                    className={clsx(
                      'w-full px-4 py-3',
                      'border border-gray-400/50 bg-gray-300 text-gray-600',
                      'placeholder:text-gray-500',
                      'cursor-not-allowed'
                    )}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Fourth Row - Message */}
            <div>
              <textarea
                id="message"
                name="message"
                placeholder="Nội dung yêu cầu"
                aria-label="Nội dung yêu cầu"
                rows={4}
                className={clsx(
                  'w-full px-4 py-3',
                  'border border-gray-400/50 bg-transparent text-white',
                  'placeholder:text-gray-400',
                  'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                  'resize-none outline-none transition-colors duration-300'
                )}
              />
            </div>

            {/* Submit Button */}
            <div className={clsx('text-center')}>
              <button
                type="submit"
                className={clsx(
                  'min-w-[143px] rounded-md px-9 py-2.5',
                  'bg-brand-orange text-white',
                  'transition-all duration-300 hover:bg-orange-600',
                  'focus:ring-brand-orange outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900'
                )}
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
