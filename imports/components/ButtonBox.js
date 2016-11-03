import React             from 'react';

const ButtonBox = ({gotCall, user, incomingCaller, acceptCall, declineCall, currentCall, recording, stopRecording, startRecording, endChat}) => (
  <div className='new-chat'>
    {!gotCall &&
      <div className='language'>
        {
         `${user.profile.language} / 
          ${user.profile.learning}`
        }
      </div>
    }
    {gotCall &&
      <div className='language'>
        {incomingCaller.username} calling
      </div>
    }
    <div className='button-wrapper'>
      {gotCall &&
        <button onClick={acceptCall}>
          Accept
        </button>
      }
      {gotCall &&
        <button onClick={declineCall}>
          Decline
        </button>
      }
      {!currentCall && !recording &&
        <button onClick={startRecording}>
          Record
        </button>
      }
      {!gotCall && currentCall &&
        <button onClick={endChat}>
          End Chat
        </button>
      }
      {!currentCall && recording &&
        <button onClick={stopRecording}>
          Stop Recording
        </button>
      }
    </div>
  </div>
)

export default ButtonBox;