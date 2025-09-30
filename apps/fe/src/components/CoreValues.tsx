'use client';

import Image from 'next/image';
import { m } from 'framer-motion';

interface CoreValuesData {
  id: number;
  title: string;
  coreValues: any[];
}

const CoreValues = ({ data }: { data: CoreValuesData }) => {
  const getImageUrl = (image: any['image']) => {
    // Use large format if available, otherwise fallback to original
    return image.url?.includes('http')
      ? image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
  };

  if (!data || !data.coreValues || data.coreValues.length === 0) {
    return null;
  }

  return (
    <section className="content-wrapper">
      {/* Title */}
      <m.h2
        className="font-playfair text-brand-orange mb-16 text-center text-4xl font-semibold max-md:mb-10 md:text-[50px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {data.title}
      </m.h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.coreValues.map((value, index) => (
          <m.div
            key={value.id}
            className="flex h-[450px] flex-col justify-between bg-[#EFEFEF] shadow-lg transition-all duration-300 hover:!translate-y-[-10px] hover:transform hover:shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Image */}
            <div className="relative flex-1">
              <Image
                src={getImageUrl(value.image)}
                alt={value.image.alternativeText || value.title}
                fill
                loading="lazy"
                quality={100}
                className="object-cover"
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>

            {/* Content */}
            <div className="space-y-1 p-[22px]">
              <h3 className="text-[35px] font-bold text-orange-500 max-md:text-[25px]">
                {value.title}
              </h3>
              <p className="text-[24px] text-gray-600 max-md:text-[20px]">
                {value.description}
              </p>
            </div>
          </m.div>
        ))}
      </div>
    </section>
  );
};

export default CoreValues;
