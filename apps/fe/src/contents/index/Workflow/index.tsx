import clsx from 'clsx';
import Image from 'next/image';
import { useMemo } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import styles from './workflow.module.css';
import { getStrapiMediaUrl } from '@/utils/helper';

interface WorkflowProps {
  workflowData?: any[];
}

interface WorkflowItem {
  id: number;
  position: number;
  image: string;
  alt: string;
}

// Default workflow data for fallback
const defaultWorkflows: WorkflowItem[] = [
  {
    id: 1,
    position: 1,
    image: '/assets/images/workflow/workflow-image-5.jpg',
    alt: 'Workflow step 1',
  },
  {
    id: 2,
    position: 2,
    image: '/assets/images/workflow/workflow-image-4.jpg',
    alt: 'Workflow step 2',
  },
  {
    id: 3,
    position: 3,
    image: '/assets/images/workflow/workflow-image-6.jpg',
    alt: 'Workflow step 3',
  },
  {
    id: 4,
    position: 4,
    image: '/assets/images/workflow/workflow-image-7.jpg',
    alt: 'Workflow step 4',
  },
  {
    id: 5,
    position: 5,
    image: '/assets/images/workflow/workflow-image-2.jpg',
    alt: 'Workflow step 5',
  },
  {
    id: 6,
    position: 6,
    image: '/assets/images/workflow/workflow-image-1.jpg',
    alt: 'Workflow step 6',
  },
  {
    id: 7,
    position: 7,
    image: '/assets/images/workflow/workflow-image-8.jpg',
    alt: 'Workflow step 7',
  },
  {
    id: 8,
    position: 8,
    image: '/assets/images/workflow/workflow-image-3.jpg',
    alt: 'Workflow step 8',
  },
];

// WorkflowImage component for slider with fixed dimensions
function WorkflowImage({ workflow }: { workflow: WorkflowItem }) {
  return (
    <div className="keen-slider__slide max-sd:max-w-[388px] max-sd:min-w-[388px] max-sd:w-[388px] max-sd:h-[336px] max-sd:max-h-[336px] relative h-[350px] max-h-[350px] w-[450px] min-w-[450px] max-w-[450px] overflow-hidden bg-gray-100 max-md:h-[236px] max-md:max-h-[236px] max-md:w-[288px] max-md:min-w-[288px] max-md:max-w-[288px]">
      <div className="relative h-full w-full">
        <Image
          src={workflow.image}
          alt={workflow.alt}
          fill
          className="object-cover transition-transform duration-500 ease-out hover:scale-105"
          sizes="450px"
          quality={85}
          loading="lazy"
          style={{ willChange: 'transform' }}
        />
        {/* Overlay for better visual hierarchy with smooth transition */}
        <div className="duration-400 absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity ease-out hover:opacity-100" />
      </div>
    </div>
  );
}

const animation = { duration: 13000, easing: (t: number) => t };

function Workflow({ workflowData = [] }: WorkflowProps) {
  // Keen Slider configuration with smooth scrolling
  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: 'performance',
    drag: false,
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    slides: {
      perView: 'auto',
      spacing: 20,
    },
    breakpoints: {
      '(max-width: 480px)': {
        slides: { perView: 'auto', spacing: 16 },
      },
      '(max-width: 640px)': {
        slides: { perView: 'auto', spacing: 18 },
      },
      '(min-width: 641px)': {
        slides: { perView: 'auto', spacing: 20 },
      },
    },
  });

  // Simplified workflow processing
  const processedWorkflows = useMemo(() => {
    const sourceData =
      workflowData?.length > 0 ? workflowData : defaultWorkflows;

    return sourceData.map((workflow, index) => ({
      id: workflow.id || index + 1,
      position: workflow.position || index + 1,
      image:
        getStrapiMediaUrl(workflow.image) ||
        defaultWorkflows[index % defaultWorkflows.length]?.image ||
        '/assets/images/workflow/workflow-image-3.jpg',
      alt: workflow.alt || `Workflow step ${index + 1}`,
    }));
  }, [workflowData]);

  return (
    <section className="workflow-gallery bg-primary py-[100px] max-md:py-[66px]">
      <div className="workflow-container relative">
        {/* Keen Slider */}
        <div
          ref={sliderRef}
          className={clsx('keen-slider', styles.workflowSlider)}
        >
          {processedWorkflows.map((workflow, index) => (
            <WorkflowImage
              key={`workflow-${workflow.id}-${index}`}
              workflow={workflow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Workflow;
