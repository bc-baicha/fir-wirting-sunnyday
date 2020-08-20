import React, { Fragment } from 'react';

const BasicLayout: React.FC = props => {
  return (
    <Fragment>
      {props.children}
    </Fragment>
  );
};

export default BasicLayout;
