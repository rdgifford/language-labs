import React from 'react';
import { Meteor } from 'meteor/meteor';

class Stats extends React.Component {
  constructor(props) {
    super(props);
    console.log('user', Meteor.user());
  }

  render() {
    // Gets full user data from database
    const user = Meteor.users.find({ _id: Meteor.user()._id }).fetch()[0];
    return (
      <div className="stats">
        <h3> Usage Stats </h3>
        <div className="avgReviews">
          <h5> Your current rating average is </h5>
          <h3> {user.reviews[0]} </h3>
        </div>
        <div className="avgCallLength">
          <h5> Your average chat has been... </h5>
          <h3> (some value) minutes long </h3>
        </div>
        <div className="calledLocations">
          <h5> You have talked to people from </h5>
          <li> some list of locations </li>
        </div>
      </div>
    );
  }
}

export default Stats;

