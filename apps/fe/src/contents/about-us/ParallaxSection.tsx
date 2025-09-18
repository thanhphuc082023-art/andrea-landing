'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';

export default function ParallaxSection() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  return (
    <div
      ref={container}
      className="relative mt-[10vh] flex min-h-screen flex-col gap-[20px] max-md:mt-[22vh] lg:flex-row"
    >
      {/* First Section - Left on desktop, Top on mobile */}
      <motion.div
        className="relative w-full lg:w-1/2"
        style={{ y: useTransform(scrollYProgress, [0, 0.7], ['50px', '-50px']) }}
      >
        <div className="ml-auto flex w-full max-w-[500px] flex-col max-lg:max-w-full max-lg:px-4">
          <motion.h1
            style={{
              y: useTransform(scrollYProgress, [0, 0.7], ['20px', '-20px']),
            }}
            className="text-brand-orange font-playfair m-0 mt-[10px] text-[8vw] font-semibold leading-[8vw] md:text-[6vw] md:leading-[6vw] lg:text-[4vw] lg:leading-[4vw]"
          >
            Tầm nhìn
          </motion.h1>
          <motion.h1
            style={{
              y: useTransform(scrollYProgress, [0.1, 0.7], ['15px', '-15px']),
            }}
            className="m-0 mt-[10px] text-[16px] font-normal leading-[26px]"
          >
            Với khát vọng tôn vinh giá trị thương hiệu Việt và đồng hành cùng
            doanh nghiệp trong nước vươn tầm quốc tế, Andrea định hướng trở
            thành đơn vị tư vấn, thiết kế thương hiệu cảm xúc và đồng hành cùng
            doanh nghiệp phát triển thương hiệu bền vững tại Việt Nam.
          </motion.h1>
        </div>

        <div className="relative mt-[5vh] flex w-full justify-center">
          <motion.div
            className="absolute max-lg:relative"
            style={{
              y: useTransform(scrollYProgress, [0, 0.7], ['0px', '-30px']),
              height: '50vh',
              width: '100%',
            }}
          >
            <Image
              src={'/assets/images/about-us/about1.png'}
              alt={`Parallax image 2 Second section`}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Second Section - Right on desktop, Bottom on mobile */}
      <motion.div
        className="relative mt-0 w-full lg:mt-[15vh] lg:w-1/2"
        style={{ y: useTransform(scrollYProgress, [0.3, 1], ['0px', '-80px']) }}
      >
        <div className="px-[100px] max-lg:w-full max-lg:px-4">
          <motion.h1
            style={{
              y: useTransform(scrollYProgress, [0.3, 1], ['0px', '-40px']),
            }}
            className="text-brand-orange font-playfair m-0 mt-[10px] text-[8vw] font-semibold leading-[8vw] md:text-[6vw] md:leading-[6vw] lg:text-[4vw] lg:leading-[4vw]"
          >
            Sứ mệnh
          </motion.h1>
          <motion.h1
            style={{
              y: useTransform(scrollYProgress, [0.4, 1], ['0px', '-30px']),
            }}
            className="m-0 mt-[10px] text-[16px] font-normal leading-[26px]"
          >
            Andrea ra đời với mong muốn đồng hành cùng các doanh nghiệp trên
            hành trình kiến tạo những định hướng ý nghĩa, truyền tải trọn vẹn
            giá trị thương hiệu qua các giải pháp tư vấn chiến lược và sản phẩm
            thiết kế chất lượng.
            <br />
            <br />
            Hơn cả dịch vụ, Andrea hướng tới trở thành người bạn đáng tin cậy,
            thấu hiểu sâu sắc mỗi thương hiệu, để cùng doanh nghiệp tỏa sáng
            trên mọi chặng đường phát triển.
          </motion.h1>
        </div>

        <div className="relative mt-[5vh] flex w-full justify-center">
          <motion.div
            className="absolute max-lg:relative"
            style={{
              y: useTransform(scrollYProgress, [0.3, 1], ['0px', '-50px']),
              height: '50vh',
              width: '100%',
            }}
          >
            <Image
              src={'/assets/images/about-us/about2.png'}
              alt={`Parallax image 2 Second section`}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
