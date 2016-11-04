import React from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import LanguageSelector from './LanguageSelector';

class TranslateTab extends React.Component {
  constructor(props) {
    super(props);
    this.handleTranslateInput = this.handleTranslateInput.bind(this);
    this.translate = _.debounce(this.translate, 750);
    this.token = '';
    this.createToken();
  }

  createToken() {
    Meteor.call('createToken', {},
      (err, res) => {
        if (err) {
          console.error(err);
        } else {
          this.token = res;
        }
      });
  }

  handleTranslateInput(e) {
    this.translate(e.currentTarget.value);
  }

  translate(text) {
    const from = document.getElementById('lang-selector-1').value;
    const to = document.getElementById('lang-selector-2').value;
    const token = this.token;
    Meteor.call('translate', { text, from, to, token },
      (err, res) => {
        if (err) {
          console.error(err);
        } else {
          document.getElementById('targetText').value = JSON.parse(res.content);
        }
      });
  }

  render() {
    return (
      <div id="Translate" className="translate-container tabcontent">
        <div className="translate-content-container">
          <div className="sourceTextContainer">
            <LanguageSelector id="lang-selector-1" defaultValue="en" />
            <textarea
              onChange={this.handleTranslateInput}
              placeholder="Enter text"
            />
          </div>
          <div className="divider" />
          <div className="targetTextContainer">
            <LanguageSelector id="lang-selector-2" defaultValue="es" />
            <textarea
              readOnly id="targetText"
              placeholder="Translation"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TranslateTab;
