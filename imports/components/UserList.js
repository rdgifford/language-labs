import React from 'react';

const UserList = ({users}) => (
  <div className='user-profile'>
    {users.map((user, i) => (
    	<button key={i}>{user.username}</button>
    ))}
  </div>
);

export default UserList;