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
    this.blobSize = 1 * 1024 * 1024;
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

  componentDidUpdate() {
    if (this.state.partner) {
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
  };
  
  // get input from user for recording name
  createVideoArr() {
    console.log('record pressed')   
    Popup.prompt('Name your recording', 'What are you recording?', {
      placeholder: 'Recording name',
      type: 'text'
    }, {
      text: 'Save',
      className: 'success',
      action: (Box) => {
        this.startRecording(Box.value);
        Box.close();
      }
    });
  };

  startRecording(videoTitle) {
    let videoPath = 'profile.videos.' + videoTitle;
    console.log('start recording');
    navigator.mediaDevices.getUserMedia({ audio: true, video: true})
      .then((_stream) => {
        let blobPacket = {
          size: 0,
          blobs: [],
        };
        let theirVideo = this.refs.theirVideo;
        recorder = new MediaRecorder(_stream);
        console.log('recording', recorder.state);
        this.setState({
          recorder: recorder,
          recording: true,
        })
        console.log(!this.state.currentCall, this.state.recording);
        theirVideo.src = URL.createObjectURL(_stream);
        recorder.start();

        // let videos = Meteor.user().profile.videos || {};
        // videos[videoTitle] = [];
        // Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.videos': videos}});

        let uploadBlob = (blobArray) => {
          uploader.send(new Blob(blobArray), (error, downloadUrl) => {
            if (error) {
              console.error('Error uploading', uploader.xhr.response);
            } else {
              console.log('download url', downloadUrl);
              Meteor.users.update(
                { _id: Meteor.userId() },
                { $push: { videoPath: downloadUrl } }
              )
            }
          })
        }

        recorder.ondataavailable = (e) => {
          blobPacket.blobs.push(e.data);
          blobPacket.size += e.data.size;
          if(blobPacket.size >= this.blobSize) {
            console.log('uploaded data', blobPacket.blobs, blobPacket.size);
            uploadBlob(blobPacket.blobs.slice())
            blobPacket.blobs = [];
            blobPacket.size = 0;
          }
        }

        recorder.onstop = (e) => {
          console.log('onstop event', e);
          this.setState({
            recording: false,
          });
          recorder.stream.getTracks().forEach(track => {track.stop()});
          this.refs.theirVideo.src = null;
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
