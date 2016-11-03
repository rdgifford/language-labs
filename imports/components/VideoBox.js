import React             from 'react';
import Welcome           from './Welcome';
import Review            from './Review';

const VideoBox = ({callDone, callLoading, currentCall, onlineUsers, partner, clearPartner}) => (
	<div className='video-box'>
	  {!callDone &&
	    <div className='video-wrapper'>
	      {!callLoading && !currentCall &&
	        <Welcome numMatches={onlineUsers.length}/>
	      }
	      {callLoading && 
	        <div className='waiting'>
				    <div className='loader'></div>
				  </div>
	      }
	      <video id='myVideo' muted='true' autoPlay='true' 
	        className={callLoading ? 'hidden' : null}></video>
	      <video id='theirVideo' autoPlay='true'
	        className={callLoading ? 'hidden' : null}></video>
	    </div>
	  }

	  {!currentCall && callDone &&
	    <Review 
	      partner={partner}
	      clearPartner={clearPartner}
	    />
	  }
	</div>
);

export default VideoBox;
