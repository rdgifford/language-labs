import React             from 'react';
import AWS               from 'aws-sdk';
import { Meteor }        from 'meteor/meteor';
import AccountsUIWrapper from './accounts';
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile';
import TopicSuggestion   from './TopicSuggestion';
import VideoBox          from './VideoBox';
import ButtonBox         from './ButtonBox';
import ProfileBox        from './ProfileBox';
import TabBox            from './TabBox';
import Review            from './Review';
import Waiting           from './Waiting';
import Welcome           from './Welcome';
import UserList          from './UserList';
import Modal             from 'react-modal';
import Toggle            from './Toggle';
import Popup             from 'react-popup';
import _                 from 'lodash';
import { Videos }        from '../api/videos';
const uploader = new Slingshot.Upload('uploadToAmazonS3');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : '20%',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
    background            : '#5fa9d9',
    color                 : '#fff',
  }
};

var Troll = () => {
  var troll = {};
  var online = false;

  var troll1 = null;
  var troll2 = null;

  troll.start = () => {
    if (online) {return;}
    troll1 = setInterval(() => {
      document.getElementById('theirVideo').style.filter = 'invert(1)'
    }, 57)
    troll2 = setInterval(() => {
      document.getElementById('theirVideo').style.filter = 'invert(0)'
    }, 83)
    online = true;
  }

  troll.end = () => {
    clearInterval(troll1);
    clearInterval(troll2);
    document.getElementById('theirVideo').style.filter = 'invert(0)'
    troll1 = null;
    troll2 = null;
    online = false;
  }
  return troll;
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    var troll = new Troll();
    const user = Meteor.users.findOne({_id: Meteor.userId()});

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
      flash: false,
      troll: troll,
      user,
    };
    this.blobSize = 1 * 1024 * 1024;
    props.peer.on('call', this.receiveCall.bind(this));
    Meteor.users.update({_id: Meteor.userId()}, {
      $set: { 'profile.peerId': props.peer.id }
    });

    document.onkeydown = this.keyPress.bind(this);
  }

  keyPress(e) {
    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: { 'profile.flash': true }
      });
    }
    if (evtobj.keyCode == 88 && evtobj.ctrlKey) {
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: { 'profile.flash': false }
      });
    }
  }

  receiveCall(incomingCall) {
    if (this.state.localStream) {return;}
    let user = Meteor.users.findOne({ 'profile.peerId': incomingCall.peer});
    this.setState({ gotCall: true, incomingCall: incomingCall, incomingCaller: user, flash: user.profile.flash});
  }

  declineCall() {
    this.state.incomingCall.close();
    this.setState({ gotCall: false, incomingCall: null, incomingCaller: null});
  }

  acceptCall() {
    let dashboard = this;
    let incomingCall = this.state.incomingCall;

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
    
    navigator.getUserMedia({ audio: true, video: true}, function (stream) {
      let outgoingCall = peer.call(user.profile.peerId, stream);
      dashboard.setStreamId(stream.id);
      dashboard.setState({ currentCall: outgoingCall, localStream: stream}, () => {
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

    let dashboard = this;
    var flash = setInterval( () => {
      if (this.state.incomingCall.peer) {
        let user = Meteor.users.findOne({ 'profile.peerId': this.state.incomingCall.peer});
        if (user.profile.flash) { dashboard.state.troll.start(); }
        else { dashboard.state.troll.end(); }
      }
    }, 500);
    this.setState({flash: flash});
  }

  endChat() {
    document.getElementById('myVideo').src = null;
    document.getElementById('theirVideo').src = null;
    this.state.currentCall.close();
    this.state.localStream.getTracks().forEach(function(track) {
      track.stop();
    });
    this.toggleLoading(false);
    clearInterval(this.state.flash);
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
      flash: false,
    });
    this.props.peer.on('call', this.receiveCall.bind(this));
  }  
  // get input from user for recording name
  createVideoArr() {
    Popup.prompt('Name your recording', 'What are you recording?', {
      placeholder: 'Recording name',
      type: 'text',
    }, {
      text: 'Save',
      className: 'success',
      action: (Box) => {
        this.startRecording(Box.value);
        Box.close();
      },
    });
  }

  startRecording(videoTitle) {
    let videoPath = 'profile.videos.' + videoTitle;
    console.log('start recording');
    navigator.mediaDevices.getUserMedia({ audio: true, video: true})
      .then((_stream) => {
        let blobPacket = [];
        let theirVideo = document.getElementById('theirVideo');
        recorder = new MediaRecorder(_stream);
        console.log('recording', recorder.state);
        this.setState({
          recorder: recorder,
          recording: true,
        })
        console.log(!this.state.currentCall, this.state.recording);
        theirVideo.src = URL.createObjectURL(_stream);
        recorder.start();
        // prevents screeching from audio feedback
        _stream.getAudioTracks()[0].enabled = false;

        if (Videos.findOne({ userId: Meteor.userId() }) === undefined) {
          console.log('Created Videos property', Videos.findOne({ userId: Meteor.userId() }));
          Videos.insert({ userId: Meteor.userId(), videos: {} });
        }

        let uploadBlob = (blobArray) => {

          uploader.send(new Blob(blobArray), (error, downloadUrl) => {
            if (error) {
              console.error('Error uploading', uploader.xhr.response);
            } else {
              // console.log('download url', downloadUrl);
              let vidObj = Videos.findOne({userId: Meteor.userId()});
              // console.log('Vids:', vidObj);
              vidObj.videos[videoTitle] = downloadUrl;
              Videos.update({_id: vidObj['_id']}, {$set: {'videos': vidObj.videos}});
              // console.log(Videos.findOne({userId: Meteor.userId()}));
            }
          })
        };

        recorder.ondataavailable = (e) => {
          blobPacket.push(e.data);
        };

        recorder.onstop = (e) => {
          console.log('onstop event', e);
          this.setState({
            recording: false,
          });
          uploadBlob(blobPacket);
          blobPacket = [];
          recorder.stream.getTracks().forEach(track => {track.stop()});
          document.getElementById('theirVideo').src = null;
        }
      })
  }

  stopRecording() {
    this.state.recorder.stop();
  }

  switchToggle() {
    this.setState({ userListToggle: !this.state.userListToggle });
  }
  
  toggleLoading(loading) {
    this.setState({ callLoading: loading });
  }

  setPartner(id) {
    setTimeout( () => {
      var partner = Meteor.users.findOne({ 'profile.streamId': id });
      if (partner) { this.setState({ partner: partner }); }
    }, 1000)
  }


  clearPartner() {
    this.setState({
      partner: false,
      callDone: false,
    });
  }


  openModal(user) {
    this.setState({ modalIsOpen: true, showUser: user })
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  render() {
    return (
      <div className='dashboard'>
      <div id='popupContainer'>
      <Popup className="mm-popup"/>
      </div>
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
            user={this.state.user}
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
            startRecording={this.createVideoArr.bind(this)}
            endChat={this.endChat.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
