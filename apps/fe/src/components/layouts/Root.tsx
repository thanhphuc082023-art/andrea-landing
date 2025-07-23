import { PropsWithChildren } from 'react';

function Root({ children }: PropsWithChildren) {
  return <div id="__root">{children}</div>;
}

export default Root;
