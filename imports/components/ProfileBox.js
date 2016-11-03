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
    right                 : '20%',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
    background            : '#5fa9d9',
    color                 : '#fff',
  }
};

const ProfileBox = ({switchToggle, userListToggle, user, onlineUsers, openModal, modalIsOpen, closeModal, showUser, startChat }) => (
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
	    <h2>{showUser.username}</h2>
	    <a className='quitProfile' onClick={closeModal}>&#x2715;</a>
	    <div>
	      <p>Native Language: {showUser.profile.language}</p>
	      <p>Want to Learn: {showUser.profile.learning}</p>
	      <p>Interests: {showUser.profile.interests}</p>
	      <p>Location: {showUser.profile.location}</p>
	      <p onClick={startChat} >
	        Call {showUser.username}
	      </p>
	    </div>
	  </Modal>
	</div>
)

export default ProfileBox;

 // <div className='profile'>
 //            <div className='userbar'>
 //              <Toggle switch={this.switchToggle.bind(this)}/>
 //              <AccountsUIWrapper className='userInfo' />
 //            </div>
 //            {
 //              this.state.userListToggle ? <UserProfile user={this.props.user}/> :
 //               <UserList users={this.props.onlineUsers} profilePopup={this.openModal.bind(this)} />
 //            }
 //            <Modal
 //              isOpen={this.state.modalIsOpen}
 //              onRequestClose={this.closeModal.bind(this)}
 //              style={customStyles} 
 //            >
 //              <h2 ref="subtitle">{this.state.showUser.username}</h2>
 //              <a className='quitProfile' onClick={this.closeModal.bind(this)}>&#x2715;</a>
 //              <div>
 //                <p>Native Language: {this.state.showUser.profile.language}</p>
 //                <p>Want to Learn: {this.state.showUser.profile.learning}</p>
 //                <p>Interests: {this.state.showUser.profile.interests}</p>
 //                <p>Location: {this.state.showUser.profile.location}</p>
 //                <p onClick={this.startChat.bind(this, this.state.showUser._id, this.props.peer)} >
 //                  Call {this.state.showUser.username}
 //                </p>
 //              </div>
 //            </Modal>
 //          </div>