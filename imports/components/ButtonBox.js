import React             from 'react';

const ButtonBox = ({gotCall, user, incomingCaller, acceptCall, declineCall, currentCall, recording, stopRecording, startRecording, endChat}) => (
  <div className="new-chat">
    {!gotCall &&
      <div className="language">
        {
         `${user.profile.language} / 
          ${user.profile.learning}`
        }
      </div>
    }
    {gotCall &&
      <div className="language">
        {incomingCaller.username} calling
      </div>
    }
    <div className="button-wrapper">
      {gotCall &&
        <div className="call-buttons">
          <button className="button-accept" onClick={acceptCall}>
            Accept
          </button>
          <button className="button-decline" onClick={declineCall}>
            Decline
          </button>
        </div>
      }
      {!currentCall && !recording && !gotCall &&
        <button onClick={startRecording}>
          Record
        </button>
      }
      {!gotCall && currentCall &&
        <button onClick={endChat}>
          End Chat
        </button>
      }
      {!currentCall && recording && !gotCall &&
        <button onClick={stopRecording}>
          Stop
        </button>
      }
    </div>
  </div>
);

export default ButtonBox;
