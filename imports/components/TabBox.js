import React from 'react';
import { Meteor } from 'meteor/meteor';
import TranslateTab from './TranslateTab';
import ChatTab from './ChatTab';
import TopicSuggestion from './TopicSuggestion';

const changeTab = (evt) => {
  const tabcontent = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabcontent.length; i += 1) {
    tabcontent[i].style.display = 'none';
  }

  const tablinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tablinks.length; i += 1) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  document.getElementById(evt.currentTarget.text).style.display = 'flex';
  evt.currentTarget.className += ' active';
};


class TabBox extends React.Component {
  render() {
    return (
      <div className="text-box">
        {
            // <TopicSuggestion partner={this.props.partner}/>
            // <Clock partner={this.props.partner} callDone={this.props.callDone} />
          !this.props.partner &&
          <div className="text-box-content">
            <ul className="tab">
              <li><a href="javascript:void(0)" id="timelink" className="tablinks" onClick={changeTab}>Time</a></li>
              <li><a href="javascript:void(0)" className="tablinks" onClick={changeTab}>Chat</a></li>
              <li><a href="javascript:void(0)" className="tablinks" onClick={changeTab}>Translate</a></li>
            </ul>
            <div id="Time" className="tabcontent">
              <div className="clock-suggestion-wrapper">
              </div>
            </div>
            <ChatTab />
            <TranslateTab />
          </div>
        }
        {
          this.props.partner &&
          <div className="waiting-for-match">Waiting for match...</div>
        }
      </div>
    );
  }
}

module.exports = TabBox;
