import Header from '@/contents/index/Header';
import Services from '@/contents/index/Services';
import BrandSection from '@/contents/index/BrandSection';
import Workflow from '@/contents/index/Workflow';
import FeaturedProjects from '@/contents/index/FeaturedProjects';
import ProjectGrid from '@/contents/index/ProjectGrid';
import Partners from '@/contents/index/Partners';
import Blog from '@/contents/index/Blog';
import ContactForm from '@/contents/index/ContactForm';
import clsx from 'clsx';
import type { GlobalEntity } from '@/types/strapi';

interface IndexContentsProps {
  serverGlobal?: GlobalEntity;
}

function IndexContents({ serverGlobal = null }: IndexContentsProps) {
  return (
    <>
      <div className={clsx('pb-20 lg:pb-28')}>
        <Header serverGlobal={serverGlobal} />
      </div>
      <div className={clsx('mb-20', 'lg:mb-28')}>
        <BrandSection />
      </div>

      <div>
        <Services />
      </div>

      <div className={clsx('py-20 lg:py-28')}>
        <Workflow />
      </div>

      <div className={clsx('pb-[60px] md:pb-20 lg:pb-28')}>
        <FeaturedProjects />
      </div>

      <div className={clsx('pb-20 lg:pb-28')}>
        <ProjectGrid />
      </div>

      <Partners />

      <div className={clsx('py-20 lg:py-28')}>
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
