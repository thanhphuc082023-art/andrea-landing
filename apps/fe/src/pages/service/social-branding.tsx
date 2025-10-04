import SupermarketContent from '@/components/services/SupermarketContent';
import StrategyServicesSection from '@/components/services/StrategyServicesSection';
import QuoteSection from '@/components/services/QuoteSection';
import ProcessSection from '@/components/services/ProcessSection';
import { getStaticPropsWithGlobalAndData } from '@/lib/page-helpers';
import StrapiHead from '@/components/meta/StrapiHead';
import ServiceHero from '@/components/services/ServiceHero';
import ContactForm from '@/contents/index/ContactForm';
import SubmitButton from '@/components/SubmitButton';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import WhyProfessionalSection from '@/components/services/WhyProfessionalSection';
import ImageTextSection from '@/components/services/ImageTextSection';
import FinalSection from '@/components/services/FinalSection';
import Divider from '@/components/services/Divider';

export default function ServicesPage({ servicesData, currentGlobal }: any) {
  const router = useRouter();
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const pageSeo = {
    metaTitle: 'Chiến lược thương hiệu',
    metaDescription:
      'Tư vấn chiến lược, xây dựng bộ máy vận hành và văn hóa doanh nghiệp',
    shareImage: servicesData?.supermarket?.image || defaultSeo?.shareImage,
  };

  const seo = { ...defaultSeo, ...pageSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        global={currentGlobal}
        seo={seo}
        ogImage={'/assets/images/services/branding/branding_thumb_mobile.png'}
      />
      {/* Hero Section */}
      <ServiceHero
        desktopSrc={'/assets/images/services/branding/branding_thumb.png'}
        mobileSrc={'/assets/images/services/branding/branding_thumb_mobile.png'}
        alt="Services"
      />

      <SupermarketContent
        data={{ ...servicesData?.supermarket, ...servicesData?.brand }}
      />

      <StrategyServicesSection
        className="mx-auto max-w-[1080px] max-md:max-w-full"
        data={servicesData.strategyServices}
      />
      <div className="content-wrapper mt-[56px] max-md:mt-[29px]">
        <Divider />
      </div>
      <WhyProfessionalSection data={servicesData?.whyProfessional} />

      <ImageTextSection
        title={servicesData?.imageText?.title}
        image={servicesData?.imageText?.image}
        heading={servicesData?.imageText?.heading}
        subheadingHtml={servicesData?.imageText?.subheadingHtml}
      />

      <QuoteSection data={servicesData?.quote} />
      <ProcessSection data={servicesData?.process} />

      <FinalSection data={servicesData?.final} />
      <div className={clsx('my-9 text-center')}>
        <SubmitButton
          onClick={() => router.back()}
          textColor="text-brand-orange"
          borderColor="border-brand-orange"
          beforeBgColor="before:bg-brand-orange"
          hoverBgColor="hover:before:bg-brand-orange"
          hoverTextColor="hover:text-white"
          focusRingColor="focus:ring-brand-orange"
          focusRingOffsetColor="focus:ring-offset-brand-orange-dark"
        >
          Trở về
        </SubmitButton>
      </div>
      <ContactForm />
    </div>
  );
}
