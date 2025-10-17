import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const App = () => {
  const [signIn, setSignIn] = useState(true);
  const signInHandler = () => {
    setSignIn(true);
  };
  const signUpHandler = () => {
    setSignIn(false);
  };
  return (
    <>
      <div className="flex items-center justify-center bg-gray-100">
        <div className="flex flex-col gap-5 items-center justify-center py-10">
          <h1 className="sm:text-bold md:text-2xl font-bold text-blue-600">
            🧑‍💼 Employee Profile Record (EPR) Management System
          </h1>
          <div className="bg-white w-full flex flex-col gap-5 items-center justify-center">
            <h1>{signIn ? 'Sign In' : 'Sign Up'}</h1>
            <div className="flex gap-5">
              <button
                onClick={signInHandler}
                className={
                  signIn
                    ? 'bg-gradient-to-t from-blue-500 to-purple-300 rounded-md px-10 py-2 text-white mb-2 hover:bg-gradient-to-t hover:from-blue-600 hover:to-purple-400'
                    : ''
                }
              >
                Sign In
              </button>
              <button
                onClick={signUpHandler}
                className={
                  !signIn
                    ? 'bg-gradient-to-t from-blue-500 to-purple-300 rounded-md px-10 py-2 text-white mb-2 hover:bg-gradient-to-t hover:from-blue-600 hover:to-purple-400'
                    : ''
                }
              >
                Sign Up
              </button>
            </div>
            {signIn ? <Login /> : <Signup />}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
