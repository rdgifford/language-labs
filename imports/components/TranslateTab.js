import React from 'react';
import { Meteor } from 'meteor/meteor';
import LanguageSelector from './LanguageSelector';

const TranslateTab = () => (
  <div id="Translate" className="tabcontent">
    <div id="tw-container">
      <div id="tw-ob">
        <div id="tw-source">
          <div className="tw-lang-selector-wrapper">
            <LanguageSelector id='lang-selector-1' />
          </div>
          <div className="tw-ta-container" id="tw-source-text-container">
            <textarea className="tw-data-placeholder tw-ta tw-text-large" id="tw-source-text-ta" cols="20" rows="1" placeholder="Enter text">
            </textarea>
          </div>
        </div>

        <div id="tw-target">
          <div className="tw-ta-container" id="tw-target-text-container">
            <span className="tw-ta tw-text-large" id="tw-target-text-ta" cols="20" rows="8">Translate</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TranslateTab;