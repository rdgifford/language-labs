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
      modalIsOpen: false,
      showUser: this.props.user
    };

    this.startChat.bind(this);
    this.endChat.bind(this);

    props.peer.on('call', this.receiveCall.bind(this));

    Meteor.users.update({_id: Meteor.userId()}, {
      $set: { 'profile.peerId': props.peer.id }
    });
  }

  receiveCall(incomingCall) {
    var user = Meteor.users.findOne({ 'profile.peerId': incomingCall.peer});
    this.setState({ gotCall: true, incomingCall: incomingCall});
  }

  acceptCall() {
    this.setState({ gotCall: false });

    let dashboard = this;
    let incomingCall = this.state.incomingCall;
    let myVideo = this.refs.myVideo;
    let theirVideo = this.refs.theirVideo;

    dashboard.toggleLoading(true);

    navigator.getUserMedia({ audio: true, video: true }, stream => {
      
      dashboard.setState({ localStream: stream, currentCall: incomingCall });   

      Meteor.users.update({_id: Meteor.userId()}, {
        $set: { 'profile.streamId': stream.id }
      });

      incomingCall.answer(stream);
      incomingCall.on('stream', function (theirStream) {
        
        myVideo.src = URL.createObjectURL(stream);
        theirVideo.src = URL.createObjectURL(theirStream);

        dashboard.setPartner(theirStream.id);
        dashboard.toggleLoading(false);
      });

      dashboard.state.currentCall.on('close', function() {
        dashboard.endChat();
      });

    }, err => console.log(err));
  }

  startChat(users, peer) {

    let dashboard = this;
    let myVideo = this.refs.myVideo;
    let theirVideo = this.refs.theirVideo;
    
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {

      dashboard.setState({ localStream: stream });
      dashboard.toggleLoading(true);
      myVideo.src = URL.createObjectURL(stream);
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: {
          'profile.streamId': stream.id
        }
      });

      let user = users[0]; 

      if (!dashboard.state.currentCall) {
        let outgoingCall = peer.call(user.profile.peerId, stream);
        dashboard.setState({ currentCall: outgoingCall });
        outgoingCall.on('stream', function (theirStream) {
          dashboard.toggleLoading(false);
          theirVideo.src = URL.createObjectURL(theirStream);
          dashboard.setPartner(theirStream.id);
        });
      }

      dashboard.state.currentCall.on('close', function() {
        dashboard.endChat();
      });

    }, err => console.log(err));
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
              <Toggle />
              <AccountsUIWrapper className='userInfo' />
            </div>
            <UserList users={this.props.onlineUsers} profilePopup={this.openModal.bind(this)} />
            {//<UserProfile user={this.props.user}/>
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
                <button onClick={this.acceptCall.bind(this)}>Accept</button>
              }
              {!this.props.gotCall && !this.props.onlineUsers[0] &&
                <button>Waiting</button>
              }
              {!this.props.gotCall && this.props.onlineUsers[0] && !this.state.currentCall &&
                <button onClick={this.startChat.bind(this, this.props.onlineUsers, this.props.peer)}>
                  Start Chat
                </button>
              }
              {!this.props.gotCall && this.state.currentCall &&
                <button onClick={this.endChat.bind(this)}>
                  End Chat
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
