import React from 'react';
import { Meteor } from 'meteor/meteor';

class Stats extends React.Component {
  constructor(props) {
    super(props);
    console.log('profile', Meteor.user().profile);
  }

  render() {
    return (
      <div>
        <h3> Put some stuff here... </h3>
      </div>
    );
  }
}

export default Stats;

