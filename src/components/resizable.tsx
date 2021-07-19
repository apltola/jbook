import './resizable.css';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import { useState } from 'react';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const getDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [dimensions] = useState(getDimensions());
  let resizableProps: ResizableBoxProps;

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'horizontal',
      maxConstraints: [dimensions.width * 0.8, Infinity],
      minConstraints: [dimensions.width * 0.2, Infinity],
      width: dimensions.width * 0.6,
      height: Infinity,
      resizeHandles: ['e'],
    };
  } else {
    resizableProps = {
      maxConstraints: [Infinity, dimensions.height * 0.9],
      minConstraints: [Infinity, 40],
      width: Infinity,
      height: dimensions.height / 2,
      resizeHandles: ['s'],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
