import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import AccountsUiWrapper from './accounts.js'
import '../imports/accountsConfig.js';
import { createContainer } from 'meteor/react-meteor-data';

class ProfileForm extends React.Component {
  constructor(props) {
    super(props)
  }

  updateUser(event) {
    event.preventDefault();

    Meteor.users.update(this.props.id, {$set: {'profile.location': this.locationInput.value}});
    Meteor.users.update(this.props.id, {$set: {'profile.language': this.languageInput.value}});

    this.locationInput.value = "";
    this.languageInput.value = "";
  }

  render() {
    return (
      <div>
        <form onSubmit={this.updateUser.bind(this)}>
          <input 
            type="text" 
            placeholder="location"
            ref={(ref) => this.locationInput = ref}
          />
          <input 
            type="text" 
            placeholder="language"
            ref={(ref) => this.languageInput = ref}
          />
          <button 
            type="submit" 
          > Submit
          </button>
        </form>
      </div>
    );
  }
}

const Matches = ({users, language}) => {

  if (users.length > 0) {

    let matches = users.filter(
      u => u.profile.language === language
    ).map(u => (u.username))

    let MatchFound = () => (
      <div>
        <span> {`practice ${language} with: `} </span>
        <span> {matches} </span>
      </div>
    );

    return (
      <div>
        <span>
         {matches.length ? <MatchFound /> : <p>waiting for matches</p>}
        </span>
      </div>
    )
  } else {
    return <p>no online users</p>
  }
};

const App = ({
  presences, 
  onlineUsers, 
  user, 
  loading,
  language
}) => {
  if (!loading && user) {
    if (!user.profile) {
      return (
        <div>
          <AccountsUiWrapper />
          <ProfileForm id={Meteor.userId()} /> 
        </div>
      );
    }
    else {
      return (
        <div>
          <AccountsUiWrapper />
          <div>
            {Meteor.userId() 
              ? <ProfileForm id={Meteor.userId()} /> 
              : "sign in to chat"}
          </div>
          <div>
          { user.profile.language.length ?
            <Matches 
              users={onlineUsers} 
              language={user.profile.language} 
            />
            : <div>Select your desired language!</div>
          }
          </div>
        </div>
      );
    }
  } else { return <AccountsUiWrapper /> }
}


const AppContainer = createContainer(() => {
  const presencesSub = Meteor.subscribe('presences');
  const usersSub = Meteor.subscribe('users');
  
  let user = Meteor.users.findOne({_id: Meteor.userId()})
  let userIds = Meteor.presences.find().map(presence => presence.userId);

  let onlineUsers = Meteor.users.find({ 
    $and: [ 
      { _id: { $in: userIds, $ne: Meteor.userId() } }, 
      { 'profile.language': { $exists: true} } 
    ] 
  }).fetch();

  const loading = !usersSub.ready() && !presencesSub.ready();

  return {
    onlineUsers,
    user,
    loading
  };
}, App);


Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('App'));
});
