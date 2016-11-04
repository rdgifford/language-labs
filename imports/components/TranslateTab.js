import React from 'react';
import LanguageSelector from './LanguageSelector';

const TranslateTab = props => (
  <div id="Translate" className="translate-container tabcontent">
    <div className="translate-content-container">
      <div className="sourceTextContainer">
        <LanguageSelector id="lang-selector-1" defaultValue="en" />
        <textarea
          onChange={props.handleTranslateInput}
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

export default TranslateTab;
