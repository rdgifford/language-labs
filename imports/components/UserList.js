import React from 'react';
import UserEntry from './UserEntry';

const UserList = ({users, profilePopup}) => (
  <div className='user-profile'>
    {users.map((user, i) => (
    	<UserEntry user={user} key={i} profilePopup={profilePopup} />
    ))}
  </div>
);



export default UserList;