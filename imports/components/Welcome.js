import React from 'react';

const Welcome = ({numMatches}) => {
  const match_matches = numMatches === 1 ? 'match' : 'matches';

  return (
    <div className='welcome'>
      <div className='welcome-title'>
        Welcome to Language.next
      </div>
      <div className='welcome-matches'>
        {`You have ${numMatches} ${match_matches} waiting to chat`}
      </div>
      <div className='welcome-prompt'>
        Press "Start Chat" to begin
      </div>
    </div>
  );
};

export default Welcome;