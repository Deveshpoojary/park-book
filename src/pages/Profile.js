import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Profile() {
  const { user } = useAuth0();

  const username = user.name.substring(0,user.name.indexOf('@')).charAt(0).toUpperCase() + user.name.substring(1,user.name.indexOf('@'));

  return <div className='text-xl text-rose-500 font-mono font-bold mr-4'>Welcome, {username}</div>;
}

export default Profile;
