import React from 'react';
import { Meteor } from 'meteor/meteor';
import ChatMessage from './ChatMessage';
import { Messages } from '../api/messages';

class ChatTab extends React.Component {
  constructor(props) {
    super(props);
    this.submitHandler = this.submitHandler.bind(this);
    this.state = {
      messages: [],
    };
    this.renderId = null;
  }

  componentDidMount() {
    this.renderMessages();
  }


  componentDidUpdate() {
    const objDiv = document.getElementById('chatbox-messages');
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  componentWillUnmount() {
    if (this.renderId !== null) {
      Meteor.clearTimeout(this.renderId);    
    }
  }

  submitHandler(e) {
    e.preventDefault();
    const text = e.currentTarget.children[0].value;
    e.currentTarget.children[0].value = '';
    if (text !== '') {
      const partnerId = this.props.partner._id;
      const userId = this.props.user._id;
      const date = new Date();
      const message = { text, userId, partnerId, date };
      Messages.insert(message);
    }
  }

  renderMessages() {
    const userId = this.props.user._id;
    const partnerId = this.props.partner._id;
    const yourMessages = Messages.find({
      userId,
      partnerId,
    }).fetch();
    const theirMessages = Messages.find({
      userId: partnerId,
      partnerId: userId,
    }).fetch();
    const messages = yourMessages.concat(theirMessages);
    messages.sort((a, b) => (a.date - b.date));

    if (messages.length > this.state.messages.length) {
      this.setState({ messages });
    }

    this.renderId = Meteor.setTimeout(this.renderMessages.bind(this), 1000);
  }

  render() {
    return (
      <div id="Chat" className="chatbox-container tabcontent">
        <div className="chatbox-content-container">
          <div id="chatbox-messages" className="chatbox-messages">
            {
              this.state.messages.map((message) => {
                let className = '';
                let username = '';
                if (message.userId === this.props.user._id) {
                  className = 'my-text';
                  // username = this.props.user.username;
                  username = 'You';
                } else {
                  className = 'other-user-text';
                  username = this.props.partner.username;
                }
                return (
                  <ChatMessage
                    userStatus={className}
                    username={username}
                    text={message.text}
                  />
                );
              })
            }
          </div>
          <div className="chatbox-form">
            <form action="" onSubmit={this.submitHandler}>
              <input type="text" />
              <input type="submit" value="Send" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatTab;
