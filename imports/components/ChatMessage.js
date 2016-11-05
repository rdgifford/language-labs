import React from 'react';

const ChatMessage = props => (
  <div className="chatmessage-container">
    <div className="chatuser">{`${props.username}:`}</div>
    <div className={`chatMessage ${props.userStatus}`}>{props.text}</div>
  </div>
);

export default ChatMessage;
