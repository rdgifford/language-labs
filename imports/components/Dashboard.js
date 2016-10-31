import React             from 'react';
import { Meteor }        from 'meteor/meteor';
import AccountsUIWrapper from './accounts'
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile'
import Clock             from './Clock';
import TopicSuggestion   from './TopicSuggestion';
import Review            from './Review';
import Waiting           from './Waiting';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inCall: false,
      callDone: true,
      initialCall: true,
      callLoading: false,
      partner: null
    };
  }

  startChat(users, peer) {
    // get html video elements
    var myVideo = this.refs.myVideo;
    var theirVideo = this.refs.theirVideo;
    var context = this;
    
    // get audio/video permissions
    navigator.getUserMedia({audio: true, video: true}, function (stream) {  
      // show own videostream of user
      myVideo.src = URL.createObjectURL(stream);

      // give the current user a peerId
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: { 'profile.peerId': peer.id }
      });

      Meteor.users.update({_id: Meteor.userId()}, {
        $set: { 'profile.streamId': stream.id }
      });

      // find other person to call
      var user = users[0];

      // receive a call from other person
      peer.on('call', function (incomingCall) {
        incomingCall.answer(stream);
        incomingCall.on('stream', function (theirStream) {
          context.toggleLoading(false);
          theirVideo.src = URL.createObjectURL(theirStream);
          context.setPartner(theirStream.id);
        });
      });

      // if call not received first, call other person
      var outgoingCall = peer.call(user.profile.peerId, stream);
      outgoingCall.on('stream', function (theirStream) {
        context.toggleLoading(false)
        theirVideo.src = URL.createObjectURL(theirStream);
        context.setPartner(theirStream.id);
      });
    }, function (error) { 
      console.log(error); 
    });
  }

  toggleCall() {
    if (this.state.initialCall) {
      this.setState({
        initialCall: false,
        inCall: !this.state.inCall,
        callDone: !this.state.callDone
      });
    } else {
      this.setState({
        inCall: !this.state.inCall,
        callDone: !this.state.callDone
      });
    }

    if (this.state.callLoading === false) {
      this.toggleLoading(true)
    }
  }

  toggleLoading(loading){
    this.setState({
      callLoading: loading
    })
  }

  setPartner(id) {
   const partner = Meteor.users.findOne({"profile.streamId": id})
   this.setState({
    partner: partner
   });
  }

  render() {
    return (
      <div className='dashboard'>
        <div className='top'>
          <div className='video-box'>
            {this.state.inCall ?
              <div className='video-wrapper'>
                {this.state.callLoading ? <Waiting /> : null}
                <video 
                  ref='myVideo' 
                  id='myVideo' 
                  muted='true' 
                  autoPlay='true'
                ></video>
                <video 
                  ref='theirVideo' 
                  id='theirVideo' 
                  autoPlay='true'
                  className={this.state.callLoading ? 'hidden' : null}
                ></video>
              </div>
              : this.state.callDone && !this.state.initialCall 
                ? <Review partner={this.state.partner}/>
                : <Waiting />
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
            <TopicSuggestion  />
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
              <button 
                onClick={() => {
                  this.toggleCall();
                  setTimeout(() => {
                    this.startChat(this.props.onlineUsers, this.props.peer)
                  }, 100)
                }}
              > {this.state.inCall 
                  ? 'End Chat' 
                  : 'Start Chat'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;