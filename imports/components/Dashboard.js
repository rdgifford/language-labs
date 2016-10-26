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
      inCall: true
    };
  }

  startChat(user, peer) {
    var outgoingCall = peer.call(user.profile.peerId, window.localStream);
    window.currentCall = outgoingCall;
    outgoingCall.on('stream', function (remoteStream) {
      var myVideo = document.getElementById('myVideo');
      myVideo.src = URL.createObjectURL(window.localStream);

      window.remoteStream = remoteStream;
      var theirVideo = document.getElementById('theirVideo')
      theirVideo.src = URL.createObjectURL(remoteStream);
    });
  }

  toggleCall() {
    this.setState({
      inCall: !this.state.inCall
    })
  }

  render() {
    return (
      <div className='dashboard'>
        <div className='top'>
          <div className='video-box'>
            {this.state.inCall && 
              <div className='video-wrapper'>
                <video id='theirVideo' autoPlay='true'></video>
                <video id='myVideo' muted='true' autoPlay='true'></video>
                <h1> Im in a call right now! </h1>
              </div>
            }
            {!this.state.inCall &&
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
              <button onClick={() => this.startChat(this.props.onlineUsers[0], this.props.peer)}>
                {this.props.onlineUsers[0] ? 'Start Chat' : 'Waiting'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;

// <Matches 
//   matches={onlineUsers.filter(u => (
//     u.profile.language === language
//   ))} 
// />