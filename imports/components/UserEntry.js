import React from 'react';

const UserEntry = ({user, profilePopup}) => {
  const showProfile = () => {
    profilePopup(user);
  }

  return(
    <button className="userBtn" onClick={showProfile}>{user.username}</button>
  );
};


export default UserEntry;