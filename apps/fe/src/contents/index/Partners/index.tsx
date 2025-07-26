import clsx from 'clsx';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/utils/helper';

// Fallback data for development/testing
const fallbackPartners = [
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
  name?: string;
  alt?: string;
  logo?: string;
  image?: any;
  position?: number;
};

interface PartnersProps {
  partnersData?: any;
}

function PartnerCard({ partner }: { partner: Partner }) {
  const logoUrl = partner.logo || getStrapiMediaUrl(partner.image);
  const altText = partner.alt || partner.name || 'Partner logo';

  if (!logoUrl) return null;

  return (
    <div className={clsx('flex items-center justify-center')}>
      <div
        className={clsx(
          'relative flex h-full w-full items-center justify-center'
        )}
      >
        <Image
          src={logoUrl}
          alt={altText}
          width={150}
          height={60}
          className="object-contain grayscale filter transition-all duration-300 hover:grayscale-0"
        />
      </div>
    </div>
  );
}

function Partners({ partnersData = {} }: PartnersProps) {
  const partners = partnersData?.partner_row;
  if (!partnersData) {
    return null;
  }

  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Section Title */}
        <div className={clsx('mb-6')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:text-[35px]'
            )}
          >
            {partnersData?.title || 'Đối tác'}
          </h2>
        </div>

        {/* Partners Grid */}
        <div className={clsx('flex flex-col space-y-[22px] lg:space-y-11')}>
          {partners?.map((row) => (
            <div
              key={`row-${row?.id}`}
              className={clsx(
                'flex items-center justify-end space-x-6 border-b border-black/20 pb-[22px] lg:space-x-[145px]'
              )}
            >
              {row?.partners?.map((partner) => (
                <PartnerCard key={partner?.id} partner={partner} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
