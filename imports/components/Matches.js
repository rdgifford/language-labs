import React from 'react';
import { Meteor } from 'meteor/meteor';
import Waiting from './Waiting';

const Matches = ({matches}) => {
  if (matches.length > 0) {

    let MatchFound = () => (
      <div>
        <span> 
          {`practice ${Meteor.user().profile.language} with: `} 
        </span>
        {matches.map((u, i) => (
          <span key={i}> 
            {u.username} 
          </span>
        ))}
      </div>
    );

    return  <MatchFound /> 
  } 
  else return <Waiting /> 
};

export default Matches;