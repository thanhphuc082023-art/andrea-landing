import clsx from 'clsx';
import Image from 'next/image';

const partners = [
  [
    {
      id: 1,
      name: 'Mitsubishi',
      logo: '/assets/images/partners/mitsubishi-logo.svg',
    },
    {
      id: 2,
      name: 'Mobifone',
      logo: '/assets/images/partners/mitsubishi-logo.svg',
    },
    {
      id: 3,
      name: 'Mobifone',
      logo: '/assets/images/partners/mitsubishi-logo.svg',
    },
    {
      id: 4,
      name: 'An Phong',
      logo: '/assets/images/partners/mitsubishi-logo.svg',
    },
  ],
  [
    {
      id: 5,
      name: 'Mobifone',
      logo: '/assets/images/partners/mitsubishi-logo.svg',
    },
    {
      id: 6,
      name: 'Evngenco3',
      logo: '/assets/images/partners/mitsubishi-logo.svg',
    },
    {
      id: 7,
      name: 'Mitsubishi',
      logo: '/assets/images/partners/mitsubishi-logo.svg',
    },
    {
      id: 8,
      name: 'An Phong',
      logo: '/assets/images/partners/mitsubishi-logo.svg',
    },
  ],
];

type Partner = {
  id: number;
  name: string;
  logo: string;
};

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className={clsx('flex items-center justify-center')}>
      <div
        className={clsx(
          'relative flex h-full w-full items-center justify-center'
        )}
      >
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={150}
          height={60}
          className="object-contain grayscale filter transition-all duration-300 hover:grayscale-0"
        />
      </div>
    </div>
  );
}

function Partners() {
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
            Đối tác
          </h2>
        </div>

        {/* Partners Grid */}
        <div className={clsx('flex flex-col gap-8 lg:gap-11')}>
          {partners.map((row, rowIdx) => (
            <div
              key={`row-${rowIdx + 1}`}
              className={clsx(
                'flex items-center justify-end gap-6 border-b border-black/20 pb-8 lg:gap-8'
              )}
            >
              {row.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
