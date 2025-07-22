import clsx from 'clsx';
import Image from 'next/image';

function FeaturedProjects() {
  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Section Title */}
        <div className={clsx('mb-12 max-sd:mb-14 max-md:mb-11')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:text-[35px]'
            )}
          >
            Dự án tiêu biểu
          </h2>
        </div>

        {/* Projects Grid */}
        <div
          className={clsx(
            'grid grid-cols-1 gap-x-5 gap-y-10 max-md:gap-y-[60px] lg:grid-cols-12'
          )}
        >
          {/* Large project - Mitsubishi */}
          <div className={clsx('lg:col-span-7')}>
            <div className={clsx('relative')}>
              {/* Main Image */}
              <div
                className={clsx(
                  'border-brand-orange relative h-[400px] w-full overflow-hidden rounded-2xl border-2 lg:h-[600px]'
                )}
              >
                <Image
                  src="/assets/images/featured-projects/mitsubishi-project.jpg"
                  alt="Mitsubishi project"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  quality={75}
                />
              </div>

              {/* Project Info */}
              <div className={clsx('mt-6')}>
                <h3
                  className={clsx(
                    'text-text-primary mb-2 text-2xl font-normal lg:text-3xl'
                  )}
                >
                  MITSUBISHI
                </h3>
                <p
                  className={clsx(
                    'text-text-secondary text-base font-normal tracking-wide'
                  )}
                >
                  Profile, Quay phim chụp hình
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Mobifone */}
          <div className={clsx('lg:col-span-5')}>
            <div className={clsx('relative')}>
              {/* Mobifone Image */}
              <div
                className={clsx(
                  'relative h-[300px] w-full overflow-hidden rounded-2xl lg:h-[300px]'
                )}
              >
                <Image
                  src="/assets/images/featured-projects/mobifone-project.jpg"
                  alt="Mobifone project"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  quality={75}
                />
              </div>

              {/* Project Info - positioned to match Figma layout */}
              <div className={clsx('mt-6 lg:mt-8')}>
                <h3
                  className={clsx(
                    'text-text-primary mb-2 text-2xl font-normal lg:text-3xl'
                  )}
                >
                  MOBIFONE
                </h3>
                <p
                  className={clsx(
                    'text-text-secondary text-base font-normal tracking-wide'
                  )}
                >
                  Profile, Catalogue, Thiết kế nhận diện sự kiện
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
