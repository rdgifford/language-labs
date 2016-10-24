import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

const AccountsUIWrapper = () => (
  <div>
    <Blaze 
      template="loginButtons" 
      align="right" 
    />
  </div>
);

export default AccountsUIWrapper;
 