import { signUp } from 'next-auth-sanity/client';


import React from 'react'

const signUpHandler=async(email,password,name)=>{
  const user = await signUp({
    email,
    password,
    name
  });
}

const SignUp = () => {
  return (
<div>
  <form >

  </form>
</div>
  )
}

export default SignUp
