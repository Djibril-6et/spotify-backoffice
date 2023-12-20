import React from 'react';

const Index = props => {
  return (
    <button className={props.className} onClick={props.onClickFunction}>
      {props.label}
    </button>
  );
};

export default Index;
