import React from 'react';
import { Meteor } from 'meteor/meteor';

class SelectLanguage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      submitButton: false
    }
  }

  updateUser(event) {
    event.preventDefault();
    Meteor.users.update(this.props.id, {$set: {'profile.language': this.languageInput.value}});
    this.languageInput.value = "";
  }

  toggleSubmit() {
    this.setState({
      submitButton: true
    });
  }

  render() {
    return (
      <div className='language-select'>
        <form 
          className='language-form'
          onSubmit={this.updateUser.bind(this)}
        >
          <input 
            type="text" 
            placeholder="Choose A Language"
            ref={(ref) => this.languageInput = ref}
            onFocus={this.toggleSubmit.bind(this)}
          />
          <button 
            type="submit" 
            className={
              this.state.submitButton 
                ? 'submit-button'
                : 'hidden'}
            onFocus={this.updateUser.bind(this)}
          > <i className="fa fa-check" 
               aria-hidden="true"
            ></i>
          </button>
        </form>
      </div>
    );
  }
}

export default SelectLanguage;