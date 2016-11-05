import React from 'react';
import { Meteor } from 'meteor/meteor';
import ChatMessage from './ChatMessage';


class ChatTab extends React.Component {
  submitHandler(e) {
    e.preventDefault();
    // const text = e.currentTarget.children[0].textContent;
    e.currentTarget.children[0].textContent = '';
    // if (text !== '') {
    // }
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
