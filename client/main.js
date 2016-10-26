import App                 from '../imports/components/App';
import React               from 'react';
import { render }          from 'react-dom';
import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import '../imports/accountsConfig.js';
import './styles.scss';

/* ------------------------- PEER.JS BEGIN ------------------------- */
const peer = new Peer({
  key: 'zzak1w02wffuhaor',
  debug: 3,
  config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
  ]}
});

// This event: remote peer receives a call
peer.on('open', function () {
  // update the current user's profile
  Meteor.users.update({_id: Meteor.userId()}, {
    $set: {
      profile: {
        peerId: peer.id,
        language: 'German'
      }
    }
  });
});

// This event: remote peer receives a call
peer.on('call', function (incomingCall) {
  window.currentCall = incomingCall;
  incomingCall.answer(window.localStream);
  incomingCall.on('stream', function (remoteStream) {
    window.remoteStream = remoteStream;
    var video = document.getElementById('theirVideo')
    video.src = URL.createObjectURL(remoteStream);
  });
});

navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

// get audio/video
navigator.getUserMedia({audio: true, video: true}, function (stream) {
  window.localStream = stream;
}, function (error) { 
  console.log(error); 
});
/* -------------------------- PEER.JS END -------------------------- */

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
    loading,
    peer
  };
}, App);


Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('App'));
});
