import './resizable.css';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import { useState, useEffect } from 'react';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const getDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [dimensions, setDimensions] = useState(getDimensions());
  const [width, setWidth] = useState(window.innerWidth * 0.7);
  let resizableProps: ResizableBoxProps;

  useEffect(() => {
    let timer: any;

    const handleResize = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setDimensions(getDimensions());
        if (window.innerWidth * 0.7 < width) {
          setWidth(window.innerWidth * 0.7);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'horizontal',
      maxConstraints: [dimensions.width * 0.9, Infinity],
      minConstraints: [dimensions.width * 0.1, Infinity],
      width: width,
      height: Infinity,
      resizeHandles: ['e'],
      onResizeStop: (e, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      maxConstraints: [Infinity, dimensions.height * 0.9],
      minConstraints: [Infinity, 40],
      width: dimensions.width,
      height: 300,
      resizeHandles: ['s'],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
