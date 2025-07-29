import clsx from 'clsx';

import Blog from '@/contents/index/Blog';
import BrandSection from '@/contents/index/BrandSection';
import ContactForm from '@/contents/index/ContactForm';
import Header from '@/contents/index/Header';
import Partners from '@/contents/index/Partners';
import ProjectGrid from '@/contents/index/ProjectGrid';
import Services from '@/contents/index/Services';
import Workflow from '@/contents/index/Workflow';

interface IndexContentsProps {
  heroData?: any;
  brandSectionData?: any;
  servicesData?: any;
  workflowData?: any[];
  partnersData?: any[];
}

function IndexContents({
  heroData = null,
  brandSectionData = null,
  servicesData = [],
  workflowData = [],
  partnersData = null,
}: IndexContentsProps) {
  return (
    <>
      <Header heroData={heroData} />
      <BrandSection brandSectionData={brandSectionData} />

      <div className="py-[75px]">
        <Services servicesData={servicesData} />
      </div>

      <div className={clsx('pb-[75px]')}>
        <Workflow workflowData={workflowData} />
      </div>

      <div className={clsx('pb-[75px]')}>
        <ProjectGrid />
      </div>

      <Partners partnersData={partnersData} />

      <div className={clsx('py-[75px]')}>
        <Blog />
      </div>

      <div>
        <ContactForm />
      </div>

      {/* <div className={clsx("hidden", "lg:mb-24 lg:block")}>
        <FeaturedCardSection />
      </div>
      <div className={clsx("mb-12", "md:mb-24")}>
        <QuoteSection />
      </div>
      <section className={clsx("mb-12", "lg:mb-24")}>
        <CleanIntuitive />
      </section>
      <section className={clsx("mb-12", "lg:mb-24")}>
        <DetailOriented />
      </section>
      <section className={clsx("mb-12", "lg:mb-24")}>
        <PrettyOptimized />
      </section> */}
    </>
  );
}

export default IndexContents;
