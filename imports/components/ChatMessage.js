import React from 'react';

const ChatMessage = props => (
  <div className="chatmessage-container">
    <div className="chatuser">aaa: </div>
    <div className={`chatMessage ${props.userStatus}`}> asda sdasdasd as dasdas dasd asd asdasd asd asd asdas dasd </div>
  </div>
);

export default ChatMessage;
