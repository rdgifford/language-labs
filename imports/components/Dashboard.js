import React             from 'react';
import { Meteor }        from 'meteor/meteor';
import AccountsUIWrapper from './accounts'
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile'
import Clock             from './Clock';
import TopicSuggestion   from './TopicSuggestion';
import Review            from './Review';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: false,
      currentCall: false,
      callDone: false
    };

    this.startChat.bind(this);
    this.endChat.bind(this);
  }

  startChat(users, peer) {
    var dashboard = this;
    // get html video elements
    var myVideo = this.refs.myVideo;
    var theirVideo = this.refs.theirVideo;
    
    // get audio/video permissions
    navigator.getUserMedia({audio: true, video: true}, function (stream) {
      dashboard.setState({ localStream: stream });

      // show own videostream of user
      myVideo.src = URL.createObjectURL(stream);
      
      // give the current user a peerId
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: {
          profile: {
            peerId: peer.id,
            language: 'German'
          }
        }
      });

      // find other person to call
      var user = users[0];

      // receive a call from other person
      peer.on('call', function (incomingCall) {
        dashboard.setState({ currentCall: incomingCall });
        incomingCall.answer(stream);
        incomingCall.on('stream', function (theirStream) {
          theirVideo.src = URL.createObjectURL(theirStream);
        });

        // if other person ends chat, end chat too
        incomingCall.on('close', function() {
          dashboard.endChat();
        });
      });

      // if call not received first, call other person
      var outgoingCall = peer.call(user.profile.peerId, stream);
      dashboard.setState({ currentCall: outgoingCall });
      outgoingCall.on('stream', function (theirStream) {
        theirVideo.src = URL.createObjectURL(theirStream);
      });

      // if other person ends chat, end chat too
      outgoingCall.on('close', function() {
        dashboard.endChat();
      });
    }, function (error) { 
      console.log(error); 
    });
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

  toggleCall() {
    this.setState({
      currentCall: !this.state.currentCall
    });
  }

  render() {
    return (
      <div className='dashboard'>
        <div className='top'>
          <div className='video-box'>
            {!this.state.callDone &&
              <div className='video-wrapper'>
                <video ref='myVideo' id='myVideo' muted='true' autoPlay='true'></video>
                <video ref='theirVideo' id='theirVideo' muted='true' autoPlay='true'></video>
              </div>
            }

            {/*We'll need to figure out how to switch between video view and review view elegantly*/}
            {!this.state.currentCall && this.state.callDone &&
              <Review />
            }
          </div>
          <div className='profile'>
            <div className='sign-out'>
              <AccountsUIWrapper />
            </div>
            <UserProfile user={this.props.user}/>
          </div>
        </div>
        <div className='bottom'>
          <div className='text-box'>
            <Clock />
            <TopicSuggestion />
            {/*This button toggles call on/off to conditionally render call or review logic */}
            <button className='toggleCall' onClick={this.toggleCall.bind(this)}> Toggle call </button>
          </div>
          <div className='new-chat'>
            <div className='selected-language'>
              Selected Language
            </div>
            <div className='language'>
              {this.props.language}
            </div>
            <div className='button-wrapper'>
              {!this.state.currentCall &&
                <button onClick={this.startChat.bind(this, this.props.onlineUsers, this.props.peer)}>
                  Start Chat
                </button>
              }
              {this.state.currentCall &&
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
};

export default Dashboard;