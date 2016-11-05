import App                 from '../imports/components/App';
import React               from 'react';
import { render }          from 'react-dom';
import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import '../imports/accountsConfig.js';
import './styles.scss';
import { Videos }          from '../imports/collections.js';
import { Messages }          from '../imports/messages';

/* ------------------------- PEER.JS INIT ------------------------- */
const peer = new Peer({
  key: 'zzak1w02wffuhaor',
  debug: 3,
  config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
  ]}
});

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
/* -------------------------- PEER.JS END -------------------------- */

const AppContainer = createContainer(() => {
  const presencesSub = Meteor.subscribe('presences');
  const usersSub = Meteor.subscribe('users');
  const messagesSub = Meteor.subscribe('messages');
  const videosSub = Meteor.subscribe('videos');
  // we only want videos of users, add later
  const videos = Videos.find().fetch();
  const user = Meteor.users.findOne(Meteor.userId());
  const userIds = Meteor.presences.find().map(presence => presence.userId);
  const loading = !usersSub.ready() && !presencesSub.ready() &&
                  !videosSub.ready() && !messagesSub.ready();

  const onlineUsers = Meteor.users.find({
    $and: [
      // { 'profile.language': { $exists: true } },
      { _id: { $in: userIds, $ne: Meteor.userId() } },
    ],
  }).fetch();
  return { onlineUsers, user, loading, peer, videos };
}, App);


Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('App'));
});
