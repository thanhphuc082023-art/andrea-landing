import clsx from 'clsx';

import Blog, { BlogOld } from '@/contents/index/Blog';
import BrandSection from '@/contents/index/BrandSection';
import ContactForm from '@/contents/index/ContactForm';
import Header from '@/contents/index/Header';
import Partners from '@/contents/index/Partners';
import ProjectGrid from '@/contents/index/ProjectGrid';
import ProjectGridOld from '@/contents/index/ProjectGrid/old';
import Services from '@/contents/index/Services';
import Workflow from '@/contents/index/Workflow';
import HeaderContent from '@/contents/index/Header/HeaderContent';

interface IndexContentsProps {
  heroData?: any;
  brandSectionData?: any;
  servicesData?: any;
  workflowData?: any[];
  partnersData?: any[];
  featuredProjectsData?: any;
}

function IndexContents({
  heroData = null,
  brandSectionData = null,
  servicesData = [],
  workflowData = [],
  partnersData = [],
  featuredProjectsData = null,
}: IndexContentsProps) {
  return (
    <>
      <Header heroData={heroData} />
      <HeaderContent heroData={heroData} />
      <BrandSection brandSectionData={brandSectionData} />

      <div className="py-[50px]">
        <Services servicesData={servicesData} />
      </div>

      <div className={clsx('pb-[50px]')}>
        <Workflow workflowData={workflowData} />
      </div>

      <div className={clsx('pb-[50px]')}>
        <ProjectGrid featuredProjectsData={featuredProjectsData} />
      </div>

      {/* <div className={clsx('pb-[50px]')}>
        <ProjectGridOld />
      </div> */}

      <Partners partnersData={partnersData} />

      <div className={clsx('py-[50px]')}>
        <BlogOld />
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
