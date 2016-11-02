import React             from 'react';
import { Meteor }        from 'meteor/meteor';
import AccountsUIWrapper from './accounts';
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile';
import Clock             from './Clock';
import TopicSuggestion   from './TopicSuggestion';
import Review            from './Review';
import Waiting           from './Waiting';
import Welcome           from './Welcome';
import UserList          from './UserList';
import Modal             from 'react-modal';
import Toggle            from './Toggle';

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
      showUser: this.props.user,
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
    var user = Meteor.users.findOne({ 'profile.peerId': incomingCall.peer});
    this.setState({ gotCall: true, incomingCall: incomingCall, incomingCaller: user});
  }

  acceptCall() {
    let dashboard = this;
    let incomingCall = this.state.incomingCall;
    dashboard.toggleLoading(true);

    navigator.getUserMedia({ audio: true, video: true }, stream => {
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: { 'profile.streamId': stream.id }
      });

      dashboard.setState({ localStream: stream, currentCall: incomingCall, gotCall: false });   

      incomingCall.answer(stream);
      incomingCall.on('close', () => dashboard.endChat());
      incomingCall.on('stream', function (theirStream) {
        dashboard.refs.myVideo.src = URL.createObjectURL(stream);
        dashboard.refs.theirVideo.src = URL.createObjectURL(theirStream);
        dashboard.setPartner(theirStream.id);
        dashboard.toggleLoading(false);
      });

    }, err => console.log(err));
  }

  startChat(userId, peer) {
    let dashboard = this;
    dashboard.closeModal();
    dashboard.toggleLoading(true);
    
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: { 'profile.streamId': stream.id }
      });

      let user = Meteor.users.findOne({ _id: userId});
      let outgoingCall = peer.call(user.profile.peerId, stream);

      dashboard.setState({ currentCall: outgoingCall, localStream: stream });

      outgoingCall.on('close', () => dashboard.endChat());
      outgoingCall.on('stream', function (theirStream) {
        dashboard.refs.myVideo.src = URL.createObjectURL(stream);
        dashboard.refs.theirVideo.src = URL.createObjectURL(theirStream);
        dashboard.setPartner(theirStream.id);
        dashboard.toggleLoading(false);
      });

    }, err => console.log(err));
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


  endChat() {
    // close peerjs connection
    this.state.currentCall.close();
 
    // turn off camera and microphone
    this.state.localStream.getTracks().forEach(function(track) {
      track.stop();
    });

    // remove streams from html video elements
    this.refs.myVideo.src = null;
    this.refs.theirVideo.src = null;
    
    this.setState({ 
      currentCall: false,
      callDone: true 
    });
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
    var partner = Meteor.users.findOne({ 'profile.streamId': id });
    if (partner) {
      this.setState({
        partner: partner
      });
    }
  }

  clearPartner () {
    this.setState({
      partner: false,
      callDone: false
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
          <div className='video-box'>
            {!this.state.callDone &&
              <div className='video-wrapper'>
                {!this.state.callLoading && !this.state.currentCall &&
                  <Welcome numMatches={this.props.onlineUsers.length}/>
                }
                {this.state.callLoading &&
                  <Waiting />
                }
                <video ref='myVideo' id='myVideo' muted='true' autoPlay='true' 
                  className={this.state.callLoading ? 'hidden' : null}></video>
                <video ref='theirVideo' id='theirVideo' muted='true' autoPlay='true'
                  className={this.state.callLoading ? 'hidden' : null}></video>
              </div>
            }

            {!this.state.currentCall && this.state.callDone &&
              <Review 
                partner={this.state.partner}
                clearPartner={this.clearPartner.bind(this)}
              />
            }
          </div>
          <div className='profile'>
            <div className='userbar'>
              <Toggle switch={this.switchToggle.bind(this)}/>
              <AccountsUIWrapper className='userInfo' />
            </div>
            {
              this.state.userListToggle ? <UserProfile user={this.props.user}/> :
               <UserList users={this.props.onlineUsers} profilePopup={this.openModal.bind(this)} />
            }
            <div onClick={this.closeModal.bind(this)}>
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={customStyles} 
              >
                <h2 ref="subtitle">User Profile</h2>
                <a className='quitProfile' onClick={this.closeModal.bind(this)}>&#x2715;</a>
                <div>
                  <p>Username: {this.state.showUser.username}</p>
                  <p>Native Language: {this.state.showUser.profile.language}</p>
                  <p>Want to Learn: {this.state.showUser.profile.learning}</p>
                  <p>Interests: {this.state.showUser.profile.interests}</p>
                  <p>Location: {this.state.showUser.profile.location}</p>
                  <button onClick={this.startChat.bind(this, this.state.showUser._id, this.props.peer)} >
                    Call {this.state.showUser.username}
                  </button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <div className='bottom'>
          <div className='text-box'>
            { 
              this.state.partner &&
              <div className='clock-suggestion-wrapper'>
                <Clock partner={this.state.partner} callDone={this.state.callDone} />
                <TopicSuggestion partner={this.state.partner}/>
              </div>
            }
            {
              !this.state.partner &&
              <div className='waiting-for-match'>Waiting for match...</div>
            }
          </div>
          <div className='new-chat'>
            <div className='selected-language'>
              Selected Languages
            </div>
            <div className='language'>
              {
               `${this.props.user.profile.language} / 
                ${this.props.user.profile.learning}`
              }
            </div>
            <div className='button-wrapper'>
              {this.state.gotCall &&
                <button onClick={this.acceptCall.bind(this)}>
                  Accept
                </button>
              }
              {!this.state.currentCall && !this.state.recording &&
                <button onClick={this.startRecording.bind(this)}>
                  Record
                </button>
              }
              {!this.state.gotCall && this.state.currentCall &&
                <button onClick={this.endChat.bind(this)}>
                  End Chat
                </button>
              }
              {!this.state.currentCall && this.state.recording &&
                <button onClick={this.stopRecording.bind(this)}>
                  Stop Recording
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
