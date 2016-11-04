import React from 'react';
import LanguageSelector from './LanguageSelector';

const TranslateTab = props => (
  <div id="Translate" className="translate-container tabcontent">
    <div className="sourceTextContainer">
      <LanguageSelector id="lang-selector-1" />
      <textarea cols="20" rows="8" placeholder="Enter text" onChange={props.handleTranslateInput} />
    </div>

    <div className="targetTextContainer">
      <LanguageSelector id="lang-selector-2" />
      <span id="targetText">Translate</span>
    </div>
  </div>
);

export default TranslateTab;
