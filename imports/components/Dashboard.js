import React             from 'react';
import { Meteor }        from 'meteor/meteor';
import AccountsUIWrapper from './accounts'
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile'
import Clock             from './Clock';
import TopicSuggestion   from './TopicSuggestion';

<<<<<<< HEAD
const Dashboard = ({onlineUsers, language}) => {
=======
const Dashboard = ({
  onlineUsers, 
  language, 
  user
}) => {
  console.log(onlineUsers)
>>>>>>> language-labs/master
  return (
    <div className='dashboard'>
      <div className='top'>
        <div className='video-box'>
          <div className='video-wrapper'>
            {onlineUsers[0] ? onlineUsers[0].username : 'waiting'}
          </div>
        </div>
        <div className='profile'>
          <div className='sign-out'>
            <AccountsUIWrapper />
          </div>
          <UserProfile user={user}/>
        </div>
      </div>
      <div className='bottom'>
        <div className='text-box'>
          <Clock />
          <TopicSuggestion />
        </div>
        <div className='new-chat'>
          <div className='selected-language'>
            Selected Language
          </div>
          <div className='language'>
            {language}
          </div>
          <div className='button-wrapper'>
            <button>
              Start New Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// <Matches 
//   matches={onlineUsers.filter(u => (
//     u.profile.language === language
//   ))} 
// />