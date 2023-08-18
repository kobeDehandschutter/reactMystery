import React from 'react';

interface Size {
  height: number;
  width: number;
}

const getWindowSize = (window: Window): Size => {
  const { innerWidth: width, innerHeight: height } = window;

  return { height, width };
};

export default function useWindowSize(): Size {
  const [size, setSize] = React.useState<Size>(() => getWindowSize(window));

  React.useEffect(() => {
    function onResize(this: Window) {
      setSize(getWindowSize(this));
    }

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}
