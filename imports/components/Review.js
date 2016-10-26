import React from 'react';
import { Meteor } from 'meteor/meteor';

class Review extends React.Component {
  constructor() {
    super();
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    //As it is, this will select the current users profile. Later, we just need to switch the
    //Meteor.user().profile.peerId with the peerId of whoever they are paired with to rate other person instead
    var user = Meteor.users.findOne({ 'profile.peerId': Meteor.user().profile.peerId });

    var reviews = user.profile.reviews || [];

    reviews.push(this.state.value);

    Meteor.users.update({_id: user._id}, {$set: {"profile.reviews": reviews}});
    //This same format can be used to easily add different review values in whatever domains we want
  }


  render() {
    return (
      <div className='Review'>
        <h4> Please help <i>{Meteor.user().username}</i> by giving them some feedback</h4>
        <h2> Rate how helpful they were on a scale of 1 to 5 </h2>
        <input type='text' 
          placeholder='1 - 5'
          value={this.state.value}
          onChange={this.handleChange}
          />
        <button onClick={this.handleSubmit}> Submit </button>
      </div>
    )
  }
}

export default Review;
