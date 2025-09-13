import clsx from 'clsx';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/utils/helper';

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
    <div className={clsx('flex h-20 w-36 items-center justify-center')}>
      <div className={clsx('relative h-full w-full')}>
        <Image
          src={logoUrl}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        <div className={clsx('flex flex-col space-y-[22px] lg:space-y-[26px]')}>
          {partners?.map((row, index) => (
            <div
              key={`row-${row?.id}`}
              className={clsx(
                'flex items-center justify-end space-x-6 pb-[22px] lg:space-x-[145px]',
                index + 1 < partners.length ? 'border-b border-black/20' : ''
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
