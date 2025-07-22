import clsx from 'clsx';
import Image from 'next/image';

function Workflow() {
  return (
    <section>
      <div className={clsx('')}>
        {/* Workflow Grid */}
        <div className={clsx('grid h-[755px] grid-cols-5 grid-rows-3')}>
          {/* Large image - left side */}
          <div className={clsx('col-span-2 row-span-2')}>
            <div className={clsx('relative h-full w-full overflow-hidden')}>
              <Image
                src="/assets/images/workflow/workflow-image-5.jpg"
                alt="Workflow step 1"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Top right large image */}
          <div className={clsx('col-span-1 row-span-1')}>
            <div className={clsx('relative h-full w-full overflow-hidden')}>
              <Image
                src="/assets/images/workflow/workflow-image-4.jpg"
                alt="Workflow step 3"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Top far right */}
          <div className={clsx('col-span-2 row-span-1')}>
            <div className={clsx('relative h-full w-full overflow-hidden')}>
              <Image
                src="/assets/images/workflow/workflow-image-6.jpg"
                alt="Workflow step 2"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Middle center */}
          <div className={clsx('col-span-2 row-span-1')}>
            <div className={clsx('relative h-full w-full overflow-hidden')}>
              <Image
                src="/assets/images/workflow/workflow-image-7.jpg"
                alt="Workflow step 4"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Middle right tall */}
          <div className={clsx('col-span-1 row-span-2')}>
            <div className={clsx('relative h-full w-full overflow-hidden')}>
              <Image
                src="/assets/images/workflow/workflow-image-2.jpg"
                alt="Workflow step 5"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom left small */}
          <div className={clsx('col-span-1 row-span-1')}>
            <div className={clsx('relative h-full w-full overflow-hidden')}>
              <Image
                src="/assets/images/workflow/workflow-image-1.jpg"
                alt="Workflow step 6"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom center */}
          <div className={clsx('col-span-2 row-span-1')}>
            <div
              className={clsx(
                'relative h-full w-full overflow-hidden bg-gray-200'
              )}
            >
              <Image
                src="/assets/images/workflow/workflow-image-8.jpg"
                alt="Workflow step 7"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom right small */}
          <div className={clsx('col-span-1 row-span-1')}>
            <div className={clsx('relative h-full w-full overflow-hidden')}>
              <Image
                src="/assets/images/workflow/workflow-image-3.jpg"
                alt="Workflow step 8"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Workflow;
