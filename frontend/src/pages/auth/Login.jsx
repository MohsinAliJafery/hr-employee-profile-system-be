import { useState } from "react";

const Login = () => {
  const [errors, setErrors] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    // Just logging — no API call
    console.log("Login form submitted:", { email, password });
  };

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center gap-4 w-full"
      >
        {errors?.length > 0 && (
          <ul style={{ color: "red", marginTop: "10px" }}>
            {errors.map((err, i) => (
              <li key={i}>{err.replace(/"/g, "")}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 w-3/4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter registered email"
            className="p-2 border border-gray-400 rounded w-full"
          />
        </div>

        <div className="flex flex-col gap-2 w-3/4">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            className="p-2 border border-gray-400 rounded w-full"
          />
          <div>
            <a className="text-blue-500 underline float-right cursor-pointer">
              Forget password?
            </a>
          </div>
        </div>

        <div className="w-3/4 flex justify-start">
          <button
            type="submit"
            className="bg-gradient-to-t from-blue-500 to-purple-300 rounded-md px-10 py-2 text-white mb-2 hover:bg-gradient-to-t hover:from-blue-600 hover:to-purple-400"
          >
            Login
          </button>
        </div>
      </form>

      <div className="flex gap-2">
        <p>You don't have account already?</p>
        <a className="text-blue-500 underline float-right cursor-pointer">
          Sign Up
        </a>
      </div>
    </>
  );
};

export default Login;
