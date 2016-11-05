import React from 'react';
import { Meteor } from 'meteor/meteor';
import ChatMessage from './ChatMessage';


class ChatTab extends React.Component {
  constructor(props) {
    super(props);
    this.submitHandler = this.submitHandler.bind(this);
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
      const message = { text, userId, partnerId };
      // console.log('user', Meteor.users);
      // console.log('messages', Meteor.messages);
      
      // Meteor.messages.insert(message);
      // console.log(Meteor.messages.find({ userId }));
    }
  }

  render() {
    return (
      <div id="Chat" className="chatbox-container tabcontent">
        <div className="chatbox-content-container">
          <div className="chatbox-messages">
            <ChatMessage userStatus={'other-user-text'} />
            <ChatMessage userStatus={'my-text'} />
            <ChatMessage userStatus={'my-text'} />
            <ChatMessage userStatus={'other-user-text'} />
            <ChatMessage userStatus={'my-text'} />
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
