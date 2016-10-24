import React          from 'react';
import { Meteor }     from 'meteor/meteor';
import Dashboard      from './Dashboard';
import HomePage       from './HomePage';
import SelectLanguage from './SelectLanguage';


const App = ({
  onlineUsers, 
  user, 
  loading,
}) => {
  if (!loading && user) {
    if (!user.profile) {
      return (
        <SelectLanguage id={Meteor.userId()} /> 
      );
    } else {
      return (
        <Dashboard 
          onlineUsers={onlineUsers} 
          language={user.profile.language}
          user={user}
        />
      );
    }
  } else { return <HomePage /> }
}

export default App;