import clsx from 'clsx';

function NewHeaderTitle() {
  return (
    <div className={clsx('relative z-30')}>
      <div className="max-sd:leading-[55px] max-lg:text-center max-lg:!leading-[40px]">
        <span
          className={clsx(
            'text-brand-orange font-playfair font-normal',
            'max-sd:text-[60px] text-[76px] max-lg:text-[50px]'
          )}
        >
          Xin chào!
        </span>
        <br />
        <span
          className={clsx(
            'font-playfair font-normal text-black',
            'max-sd:text-[30px] text-[40px] max-md:text-[25px]',
            'leading-tight dark:text-white'
          )}
        >
          Chúng tôi là Andrea Agency
        </span>
      </div>
    </div>
  );
}

export default NewHeaderTitle;
