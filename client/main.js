import App                 from '../imports/components/App';
import React               from 'react';
import { render }          from 'react-dom';
import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import '../imports/accountsConfig.js';
import './styles.scss';


const AppContainer = createContainer(() => {

  const presencesSub = Meteor.subscribe('presences');
  const usersSub     = Meteor.subscribe('users');
  const user         = Meteor.users.findOne(Meteor.userId());
  const userIds      = Meteor.presences.find().map(presence => presence.userId);
  const loading      = !usersSub.ready() && !presencesSub.ready();
  
  const onlineUsers  = Meteor.users.find({ 
    $and: [ 
      { _id: { $in: userIds, $ne: Meteor.userId() } }, 
      { 'profile.language': { $exists: true } } 
    ] 
  }).fetch();

  return {
    onlineUsers,
    user,
    loading
  };
}, App);


Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('App'));
});
