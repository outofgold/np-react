import { useEffect, useRef } from 'react';

const useFirstRender = () => {
  const firstRenderRef = useRef<boolean>(true);

  useEffect(() => {
    firstRenderRef.current = false;
  }, []);

  return firstRenderRef.current;
};

export { useFirstRender };
