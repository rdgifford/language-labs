import React from 'react';

const UserEntry = ({user, profilePopup}) => {
  const showProfile = () => {
    profilePopup(user);
  }

  return(
    <p className="userBtn" onClick={showProfile}>{user.username}</p>
  );
};


export default UserEntry;