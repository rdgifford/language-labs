import React             from 'react';
import Toggle            from './Toggle';
import AccountsUIWrapper from './accounts';
import UserList          from './UserList';
import UserProfile       from './UserProfile';
import Modal             from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : '-10%',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
    background            : '#5fa9d9',
    color                 : '#fff',
  }
};

const showVideo = (videos, user) => {
	let result = [];
	let userVideos = videos.findOne({userId: user._id}).videos;
	for (var key in userVideos) {
		result.push([key, userVideos[key]]);
	}
	console.log(result);
	return result;
}

const ProfileBox = ({switchToggle, userListToggle, user, onlineUsers, openModal, modalIsOpen, closeModal, showUser, startChat, videos, playVideo }) => (
	<div className='profile'>
	  <div className='userbar'>
	    <Toggle switch={switchToggle}/>
	    <AccountsUIWrapper className='userInfo' />
	  </div>
	  {
	    userListToggle ? <UserProfile user={user}/> :
	     <UserList users={onlineUsers} profilePopup={openModal} />
	  }
	  <Modal 
	    isOpen={modalIsOpen}
	    onRequestClose={closeModal}
	    style={customStyles} 
	  >
	    <h2 className='modalHeader'>{showUser.username}</h2>
	    <a className='quitProfile' onClick={closeModal}>&#x2715;</a>
	    <div className='theprofile'>
	    	<div className='profileinfo'>
		      <div><p>Native Language: {showUser.profile.language}</p></div>
		      <div><p>Want to Learn: {showUser.profile.learning}</p></div>
		      <div><p>Interests: {showUser.profile.interests}</p></div>
		      <div><p>Location: {showUser.profile.location}</p></div>
		      
	      </div>
	     	<div className='profilevideos'>
	     		<p>Videos: </p>
	     		{showVideo(videos, showUser).map(tuple => (
	     			<p onClick={() => playVideo(tuple[1])}>{tuple[0]}</p>
	     			))}
	     	</div>
	    </div>
	    <div className='startCall' onClick={startChat}>
        <p>Call {showUser.username}</p>
      </div>
	  </Modal>
	</div>
)

export default ProfileBox;
