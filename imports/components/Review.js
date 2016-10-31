import React from 'react';
import { Meteor } from 'meteor/meteor';
import Stars from './Stars';

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(rating) {
    //As it is, this will select the current users profile. Later, we just need to switch the
    //Meteor.user().profile.peerId with the peerId of whoever they are paired with to rate other person instead
    var reviews = this.props.partner.reviews || [];
    reviews.concat(rating);


    Meteor.call('updateRating',{
      newReviews: reviews,
      _id: this.props.partner._id
    }, 
    (err) => {
      if (err) { return console.log(err); }
    });

    //This same format can be used to easily add different review values in whatever domains we want
  }


  render() {
    return (
      <div className='review'>
        <span> 
          Help out {this.props.partner.username} by giving them some feedback
        </span>
        <h2> How was your conversation? </h2>
        <Stars 
          submit={this.handleSubmit.bind(this)} 
        />
      </div>
    );
  }
}

export default Review;
