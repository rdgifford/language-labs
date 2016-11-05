import React from 'react';
import { Meteor } from 'meteor/meteor';
import ChatMessage from './ChatMessage';
import { Messages } from '../messages';

class ChatTab extends React.Component {
  constructor(props) {
    super(props);
    this.submitHandler = this.submitHandler.bind(this);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.renderMessages();
  }

  componentDidUpdate() {
    const objDiv = document.getElementById('chatbox-messages');
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  submitHandler(e) {
    e.preventDefault();
    const text = e.currentTarget.children[0].value;
    e.currentTarget.children[0].value = '';
    if (text !== '') {
      const fakePartner = {
        _id: '123124124',
        username: 'cheny151',
      };
      const partnerId = fakePartner._id;
      const userId = this.props.user._id;
      const date = new Date();
      const message = { text, userId, partnerId, date };
      Messages.insert(message);
      this.renderMessages();
    }
  }

  renderMessages() {
    const userId = this.props.user._id;
    const fakePartner = {
      _id: '123124124',
      username: 'cheny151',
    };
    const partnerId = fakePartner._id;
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

    this.setState({ messages });
  }

            // <ChatMessage userStatus={'other-user-text'} />
            // <ChatMessage userStatus={'my-text'} />
            // <ChatMessage userStatus={'my-text'} />
            // <ChatMessage userStatus={'other-user-text'} />
            // <ChatMessage userStatus={'my-text'} />
  render() {
    return (
      <div id="Chat" className="chatbox-container tabcontent">
        <div className="chatbox-content-container">
          <div id="chatbox-messages" className="chatbox-messages">
            {
              this.state.messages.map((message) => {
                let className = '';
                if (message.userId === this.props.user._id) {
                  className = 'my-text';  
                } else {
                  className = 'other-user-text';
                }
                return (
                  <ChatMessage
                    userStatus={className}
                    username={this.props.user.username}
                    text={message.text}
                  />
                );
              })
            }
          </div>
          <div className="chatbox-form">
            <form action="" onSubmit={this.submitHandler}>
              <input type="text" />
              <input type="submit" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatTab;
