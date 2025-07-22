import clsx from 'clsx';
import { m } from 'framer-motion';

interface HeaderVideoProps {
  videoSrc?: string;
}

function HeaderVideo({ videoSrc = '' }: HeaderVideoProps) {
  return (
    <m.div
      className={clsx('inset-0 z-0 overflow-hidden')}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 1.2 }}
    >
      {videoSrc ? (
        <video
          className={clsx(
            'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-80px)] w-full object-cover'
          )}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        /* Use the actual background image from Figma */
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/aa900ed26675db6e843778c020dcbb13b0f69d38?width=2880"
          alt=""
          className={clsx(
            'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-80px)] w-full object-cover object-center'
          )}
        />
      )}
    </m.div>
  );
}

export default HeaderVideo;
