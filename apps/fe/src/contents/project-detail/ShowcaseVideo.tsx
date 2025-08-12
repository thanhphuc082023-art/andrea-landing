interface ShowcaseVideoProps {
  src: string;
  className?: string;
}

function ShowcaseVideo({ src, className = '' }: ShowcaseVideoProps) {
  return (
    <video src={src} className={className} controls muted loop playsInline />
  );
}

export default ShowcaseVideo;
