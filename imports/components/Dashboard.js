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

  declineCall() {
    this.state.incomingCall.close();
    this.setState({ gotCall: false, incomingCall: null, incomingCaller: null});
  }

  acceptCall() {
    let dashboard = this;
    let incomingCall = this.state.incomingCall;

    navigator.getUserMedia({ audio: true, video: true }, stream => {
      dashboard.toggleLoading(true);
      dashboard.setStreamId(stream.id);
      dashboard.setState({ localStream: stream, currentCall: incomingCall, gotCall: false }, () => {
        incomingCall.answer(stream);
        incomingCall.on('close', () => dashboard.endChat());
        incomingCall.on('stream', dashboard.connectStream.bind(dashboard));
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
        outgoingCall.on('close', () => dashboard.endChat());
      });
    }, err => console.log(err));

    setTimeout( () => {
      dashboard.state.partner || dashboard.endChat();
    }, 12000);
  }

  setStreamId(id) {
    Meteor.users.update({_id: Meteor.userId()}, {
      $set: { 'profile.streamId': id }
    });
  }

  connectStream(theirStream) {
    this.refs.myVideo.src = URL.createObjectURL(this.state.localStream);
    this.refs.theirVideo.src = URL.createObjectURL(theirStream);
    this.setPartner(theirStream.id);
    this.toggleLoading(false);
  }

  endChat() {
    this.state.localStream.getTracks().forEach(function(track) {
      track.stop();
    });
    this.toggleLoading(false);
    this.state.currentCall.close();
    this.refs.myVideo.src = null;
    this.refs.theirVideo.src = null;
    this.setState({ 
      currentCall: false,
      localStream: false,
      callDone: true,
      partner: false
    });
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
                <h2 ref="subtitle">{this.state.showUser.username}</h2>
                <a className='quitProfile' onClick={this.closeModal.bind(this)}>&#x2715;</a>
                <div>
                  <p>Native Language: {this.state.showUser.profile.language}</p>
                  <p>Want to Learn: {this.state.showUser.profile.learning}</p>
                  <p>Interests: {this.state.showUser.profile.interests}</p>
                  <p>Location: {this.state.showUser.profile.location}</p>
                  <p onClick={this.startChat.bind(this, this.state.showUser._id, this.props.peer)} >
                    Call {this.state.showUser.username}
                  </p>
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
            {!this.state.gotCall &&
              <div className='language'>
                {
                 `${this.props.user.profile.language} / 
                  ${this.props.user.profile.learning}`
                }
              </div>
            }
            {this.state.gotCall &&
              <div className='language'>
                {this.state.incomingCaller.username} calling
              </div>
            }
            <div className='button-wrapper'>
              {this.state.gotCall &&
                <button onClick={this.acceptCall.bind(this)}>
                  Accept
                </button>
              }
              {this.state.gotCall &&
                <button onClick={this.declineCall.bind(this)}>
                  Decline
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
