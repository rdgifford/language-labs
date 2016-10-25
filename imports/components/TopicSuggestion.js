import React from 'react';

class TopicSuggestion extends React.Component {
  constructor() {
    super();

    this.state = {
      currentTopic: 'sports'
    };
  }

  randomTopic() {
    var topicIdeas = ['traveling', 'sports', 'work', 'family', 'music', 'movies', 'books'];
    var randomIndex = Math.floor(Math.random() * topicIdeas.length);

    this.setState({
      currentTopic: topicIdeas[randomIndex]
    });
  }

  render () {
    return (
      <div className='suggetion'>
        <button onClick={this.randomTopic.bind(this)}> New Topic Idea </button>
        <h5> Maybe you can talk about... </h5>
        <h3> {this.state.currentTopic} </h3>
      </div>
    );
  };
};

export default TopicSuggestion;

