import React from 'react'

const AlreadyLoggedIn = () => {
  return (
    <div className="container pl-5 pr-5 pt-5 pb-5 mb-auto text-dark font-size-32">
      <div className="font-weight-bold mb-3">You’re Already Logged In on Another Tab</div>
      <div className="text-gray-6 font-size-24">
        For security and session integrity, using this application in multiple tabs is not allowed.
        <br />
        Please return to your original tab to continue.
      </div>
    </div>
  )
}

export default AlreadyLoggedIn
