import React from 'react';

const PadBlock = ({padding, children}) => {
  return (
    <div style={{paddingLeft: 40*(padding || 1)}}>
      {children}
    </div>
  );
};

export default PadBlock;