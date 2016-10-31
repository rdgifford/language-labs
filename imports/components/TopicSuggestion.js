import React from 'react';

class TopicSuggestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topics: this.props.partner.profile.interests.split(',') || ''
    };
  }

  render () {
    return (
      <div className='topics'>
        <h1>{`${this.props.partner.username} likes to talk about`}</h1>
        <ul className='topic-list'>
          {this.state.topics.map(t => <li>{t}</li>)}
        </ul>
      </div>
    );
  };
};

export default TopicSuggestion;

