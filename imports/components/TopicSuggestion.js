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
        <ul className='topic-list'>
          {this.state.topics.map(t => <li>{t}</li>)}
        </ul>
      </div>
    );
  };
};

export default TopicSuggestion;

