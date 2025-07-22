import clsx from 'clsx';

function ContactForm() {
  return (
    <section className={clsx('bg-gray-900 py-20 lg:py-28')}>
      <div className={clsx('content-wrapper mx-auto')}>
        <div className={clsx('mx-auto max-w-4xl')}>
          {/* Section Title */}
          <div className={clsx('mb-16 text-center')}>
            <h2
              className={clsx(
                'font-playfair text-4xl font-medium text-white lg:text-5xl'
              )}
            >
              Đồng hành cùng chúng tôi
            </h2>
          </div>

          {/* Contact Form */}
          <form className={clsx('space-y-6')}>
            {/* First Row - Name and Phone */}
            <div>
              <input
                type="text"
                placeholder="Tên của bạn"
                className={clsx(
                  'w-full px-4 py-3',
                  'border border-gray-400/50 bg-transparent text-white',
                  'placeholder:text-gray-400',
                  'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                  'transition-colors duration-300'
                )}
              />
            </div>
            <div className={clsx('grid grid-cols-1 gap-6 md:grid-cols-2')}>
              <div>
                <input
                  type="tel"
                  placeholder="Số điện thoại"
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
                  type="email"
                  placeholder="Email"
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

            {/* Second Row - Email */}

            {/* Third Row - Company and Security Code */}
            <div className={clsx('grid grid-cols-1 gap-6 md:grid-cols-2')}>
              <div className={clsx('md:col-span-1')}>
                <input
                  type="text"
                  placeholder="Tên công ty/ Ngành nghề"
                  className={clsx(
                    'w-full px-4 py-3',
                    'border border-gray-400/50 bg-transparent text-white',
                    'placeholder:text-gray-400',
                    'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                    'transition-colors duration-300'
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:col-span-1 md:grid-cols-3">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Mã bảo mật"
                    className={clsx(
                      'w-full px-4 py-3',
                      'border border-gray-400/50 bg-transparent text-white',
                      'placeholder:text-gray-400',
                      'focus:border-brand-orange rounded-none outline-none focus:ring-0',
                      'transition-colors duration-300'
                    )}
                  />
                </div>
                <div className="md:col-span-1">
                  <input
                    type="text"
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
                placeholder="Nội dung yêu cầu"
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
