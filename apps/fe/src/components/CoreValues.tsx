'use client';

import Image from 'next/image';
import { m } from 'framer-motion';

const coreValues = [
  {
    id: 1,
    title: 'Chú tâm',
    subtitle: 'trong từng dịch vụ',
    image: '/assets/images/about-us/about3.png',
    color: 'bg-[#EFEFEF]',
  },
  {
    id: 2,
    title: 'Sáng tạo',
    subtitle: 'Có định hướng',
    image: '/assets/images/about-us/about4.png',
    color: 'bg-[#EFEFEF]',
  },
  {
    id: 3,
    title: 'Thẩm mỹ',
    subtitle: 'Có chiều sâu',
    image: '/assets/images/about-us/about5.png',
    color: 'bg-[#EFEFEF]',
  },
  {
    id: 4,
    title: 'Thiết kế',
    subtitle: 'Chạm cảm xúc',
    image: '/assets/images/about-us/about6.png',
    color: 'bg-[#EFEFEF]',
  },
];

const CoreValues = () => {
  return (
    <section className="content-wrapper">
      {/* Title */}
      <m.h2
        className="font-playfair mb-16 text-center text-4xl font-semibold text-orange-500 max-md:mb-10 md:text-[50px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Giá trị cốt lõi
      </m.h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {coreValues.map((value, index) => (
          <m.div
            key={value.id}
            className={`${value.color} flex h-[450px] flex-col justify-between shadow-lg transition-all duration-300 hover:!translate-y-[-10px] hover:transform hover:shadow-xl`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Image */}
            <div className="relative flex-1">
              <Image
                src={value.image}
                alt={value.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>

            {/* Content */}
            <div className="space-y-1 p-[22px]">
              <h3 className="text-[35px] font-bold text-orange-500 max-md:text-[25px]">
                {value.title}
              </h3>
              <p className="text-[24px] text-gray-600 max-md:text-[20px]">
                {value.subtitle}
              </p>
            </div>
          </m.div>
        ))}
      </div>
    </section>
  );
};

export default CoreValues;
