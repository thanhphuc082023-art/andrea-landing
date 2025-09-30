'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';

export default function ParallaxSection({ data }: any) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  if (!data || data.length === 0) {
    return null;
  }

  const getImageUrl = (image: any) => {
    // Use large format if available, otherwise fallback to original
    return image.url?.includes('http')
      ? image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
  };

  return (
    <div
      ref={container}
      className="relative mb-[10vh] mt-[10vh] flex min-h-screen flex-col gap-[20px] max-md:mb-0 max-md:mt-[15vh] lg:flex-row"
    >
      {data.map((section, index) => (
        <motion.div
          key={section.id}
          className={`relative w-full ${index === 0 ? 'lg:w-1/2' : 'mt-0 w-full lg:mt-[22vh] lg:w-1/2'}`}
          style={{
            y: useTransform(
              scrollYProgress,
              index === 0 ? [0, 0.7] : [0.3, 1],
              index === 0 ? ['50px', '-50px'] : ['0px', '-80px']
            ),
          }}
        >
          <div
            className={`${index === 0 ? 'ml-auto flex w-full max-w-[500px] flex-col max-lg:max-w-full max-lg:px-4' : 'px-[100px] max-lg:w-full max-lg:px-4'}`}
          >
            <motion.h1
              style={{
                y: useTransform(
                  scrollYProgress,
                  index === 0 ? [0, 0.7] : [0.3, 1],
                  index === 0 ? ['20px', '-20px'] : ['0px', '-40px']
                ),
              }}
              className="text-brand-orange font-playfair m-0 mt-[10px] text-4xl font-semibold leading-[8vw] md:text-[50px] md:leading-[6vw] lg:text-[50px] lg:leading-[50px]"
            >
              {section.title}
            </motion.h1>
            <motion.div
              style={{
                y: useTransform(
                  scrollYProgress,
                  index === 0 ? [0.1, 0.7] : [0.4, 1],
                  index === 0 ? ['15px', '-15px'] : ['0px', '-30px']
                ),
              }}
              className="m-0 mt-[10px] max-w-[530px] text-[16px] font-normal leading-[26px]"
            >
              {section.contents.map((content, contentIndex) => (
                <div key={content.id}>
                  {content.value}
                  {contentIndex < section.contents.length - 1 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative mt-[5vh] flex w-full justify-center">
            <motion.div
              className="absolute max-lg:relative"
              style={{
                y: useTransform(
                  scrollYProgress,
                  index === 0 ? [0, 0.7] : [0.3, 1],
                  index === 0 ? ['0px', '-30px'] : ['0px', '-50px']
                ),
                height: '50vh',
                width: '100%',
              }}
            >
              <Image
                src={getImageUrl(section.image)}
                alt={section.image.alternativeText || `${section.title} image`}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
