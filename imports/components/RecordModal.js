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

const recordModalStyle = {
  borderWidth: 0,
  borderBottomWidth: 1,
  borderBottomColor: 'white',
  backgroundColor: 'transparent',
  height: 40,
  width: '100%',
  fontSize: 25,
  fontFamily: 'quicksand',
  textAlign: 'center',
  color: 'white'
}

const RecordModal = ({ startRecording, toggleRecordModal, recordModalIsOpen }) => (
	<div className='recordModal'>
	  <Modal 
	    isOpen={ recordModalIsOpen }
	    onRequestClose={ toggleRecordModal }
	    style={ customStyles } 
	  >
	    <h2 className='modalHeader'>Name your recording</h2>
	    <a className='quitProfile' onClick={ toggleRecordModal }>&#x2715;</a>
      <p><input id='recordModalInput' style={ recordModalStyle }/></p>
      <div className='startCall' onClick={() => {
        var title = document.getElementById('recordModalInput').value
        startRecording();
        toggleRecordModal();
      }}>
        <p>Start Recording</p>
      </div>
	  </Modal>
	</div>
)

export default RecordModal;
