import _ from 'lodash';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from './accounts';
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile';
import TopicSuggestion   from './TopicSuggestion';
import VideoBox          from './VideoBox';
import ButtonBox         from './ButtonBox';
import ProfileBox        from './ProfileBox';
import TabBox from './TabBox';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: false,
      currentCall: false,
      callDone: false,
      callLoading: false,
      partner: false,
      gotCall: false,
      incomingCall: false,
      incomingCaller: false,
      modalIsOpen: false,
      showUser: props.user,
      recorder: false,
      recording: false,
      userListToggle: false,
    };

    props.peer.on('call', this.receiveCall.bind(this));

    Meteor.users.update({_id: Meteor.userId()}, {
      $set: { 'profile.peerId': props.peer.id }
    });
  }

  receiveCall(incomingCall) {
    if (this.state.localStream) {return;}
    let user = Meteor.users.findOne({ 'profile.peerId': incomingCall.peer});
    this.setState({ gotCall: true, incomingCall: incomingCall, incomingCaller: user});
  }

  componentDidMount() {
    if (!this.state.partner) {
      document.getElementById('timelink').click();
    }
  }

  componentDidUpdate() {
    if (!this.state.partner) {
      document.getElementById('timelink').click();
    }
  }

  declineCall() {
    this.state.incomingCall.close();
    this.setState({ gotCall: false, incomingCall: null, incomingCaller: null});
  }

  acceptCall() {
    let dashboard = this;
    let incomingCall = this.state.incomingCall;
    dashboard.toggleLoading(true);

    navigator.getUserMedia({ audio: true, video: true }, stream => {
      dashboard.setStreamId(stream.id);
      dashboard.setState({ localStream: stream, currentCall: incomingCall, gotCall: false }, () => {
        incomingCall.on('stream', dashboard.connectStream.bind(dashboard));
        incomingCall.on('close', dashboard.endChat.bind(dashboard));
        incomingCall.answer(stream);
      });   
    }, err => console.log(err));
  }

  startChat(userId, peer) {
    if (this.state.localStream) {return;}
    let dashboard = this;
    let user = Meteor.users.findOne({ _id: userId});
    dashboard.closeModal();
    dashboard.toggleLoading(true);
    
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {
      let outgoingCall = peer.call(user.profile.peerId, stream);
      dashboard.setStreamId(stream.id);

      dashboard.setState({ currentCall: outgoingCall, localStream: stream }, () => {
        outgoingCall.on('stream', dashboard.connectStream.bind(dashboard));
        outgoingCall.on('close', dashboard.endChat.bind(dashboard));
      });
    }, err => console.log(err));

    setTimeout( () => {
      dashboard.state.callLoading && dashboard.endChat();
    }, 12000);
  }

  setStreamId(id) {
    Meteor.users.update({_id: Meteor.userId()}, {
      $set: { 'profile.streamId': id }
    });
  }

  connectStream(theirStream) {
    document.getElementById('myVideo').src = URL.createObjectURL(this.state.localStream);
    document.getElementById('theirVideo').src = URL.createObjectURL(theirStream);
    this.setPartner(theirStream.id);
    this.toggleLoading(false);
  }

  endChat() {
    document.getElementById('myVideo').src = null;
    document.getElementById('theirVideo').src = null;
    this.state.currentCall.close();
    this.state.localStream.getTracks().forEach(function(track) {
      track.stop();
    });
    this.toggleLoading(false);
    this.setState({ 
      localStream: false,
      currentCall: false,
      callDone: true,
      callLoading: false,
      partner: false,
      gotCall: false,
      incomingCall: false,
      incomingCaller: false,
      modalIsOpen: false,
    });
    this.props.peer.on('call', this.receiveCall.bind(this));
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true})
      .then((videoStream) => {
        recorder = new MediaRecorder(videoStream);
        console.log('recording', recorder.state);
        this.setState({
          recorder: recorder,
          recording: true,
        })
        console.log(!this.state.currentCall, this.state.recording);
        recorder.start();

        recorder.ondataavailable = (e) => {
          console.log(e.data);
        }

        recorder.onstop = (e) => {
          console.log('onstop event', e);
          this.setState({
            recording: false,
          });
          recorder.stream.getTracks().forEach(track => {track.stop()});
        }
      })
  }

  stopRecording() {
    this.state.recorder.stop();
  }

  switchToggle() {
    this.setState({
      userListToggle: !this.state.userListToggle 
    });
  }
  
  toggleLoading(loading) {
    this.setState({
      callLoading: loading
    });
  }

  setPartner(id) {
    setTimeout( () => {
      var partner = Meteor.users.findOne({ 'profile.streamId': id });
      if (partner) {
        this.setState({
          partner: partner
        });
      }
    }, 1000)
  }

  clearPartner() {
    this.setState({
      partner: false,
      callDone: false,
    });
  }

  openModal(user) {
    this.setState({
      modalIsOpen: true,
      showUser: user
    })
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    })
  }

  render() {
    return (
      <div className='dashboard'>
        <div className='top'>
          <VideoBox 
            callDone={this.state.callDone}
            callLoading={this.state.callLoading}
            currentCall={this.state.currentCall}
            onlineUsers={this.props.onlineUsers}
            partner={this.state.partner}
            clearPartner={this.clearPartner.bind(this)}
          />
          <ProfileBox
            switchToggle={this.switchToggle.bind(this)}
            userListToggle={this.state.userListToggle}
            user={this.props.user}
            onlineUsers={this.props.onlineUsers}
            modalIsOpen={this.state.modalIsOpen}
            openModal={this.openModal.bind(this)}
            closeModal={this.closeModal.bind(this)}
            showUser={this.state.showUser}
            startChat={this.startChat.bind(this, this.state.showUser._id, this.props.peer)}
          />
        </div>
        <div className='bottom'>
          <TabBox
            partner={this.state.partner}
            callDone={this.state.callDone}
          />
          <ButtonBox 
            gotCall={this.state.gotCall}
            user={this.props.user}
            incomingCaller={this.state.incomingCaller}
            acceptCall={this.acceptCall.bind(this)}
            declineCall={this.declineCall.bind(this)}
            currentCall={this.state.currentCall}
            recording={this.state.recording}
            stopRecording={this.stopRecording.bind(this)}
            startRecording={this.startRecording.bind(this)}
            endChat={this.endChat.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
