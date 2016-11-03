import React from 'react';
// import MsTranslator from 'mstranslator';
import _ from 'lodash';
import TranslateTab from './TranslateTab';
import ChatTab from './ChatTab';
import TopicSuggestion from './TopicSuggestion';
// import keys from '../../config/config';

// const client = new MsTranslator({
//   client_id: keys.client_id,
//   client_secret: keys.client_secret,
// }, true);

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
  constructor(props) {
    super(props);
    this.handleTranslateInput = this.handleTranslateInput.bind(this);
    this.translate = _.debounce(this.translate, 200);
  }

  handleTranslateInput(e) {
    this.translate(e.currentTarget.value);
  }

  translate(text) {
    const params = {
      text,
      from: 'en',
      to: 'es',
    };
  }

  render() {
    return (
      <div className="text-box">
        {
            // <Clock partner={this.props.partner} callDone={this.props.callDone} />
          this.props.partner &&
          <div className="text-box-content">
            <ul className="tab">
              <li><a href="javascript:void(0)" id="timelink" className="tablinks" onClick={changeTab}>Time</a></li>
              <li><a href="javascript:void(0)" className="tablinks" onClick={changeTab}>Chat</a></li>
              <li><a href="javascript:void(0)" className="tablinks" onClick={changeTab}>Translate</a></li>
            </ul>
            <div id="Time" className="tabcontent">
              <div className="clock-suggestion-wrapper">
                <TopicSuggestion partner={this.props.partner}/>
              </div>
            </div>
            <ChatTab />
            <TranslateTab handleTranslateInput={this.handleTranslateInput} />
          </div>
        }
        {
          !this.props.partner &&
          <div className="waiting-for-match">Waiting for match...</div>
        }
      </div>
    );
  }
}

module.exports = TabBox;
