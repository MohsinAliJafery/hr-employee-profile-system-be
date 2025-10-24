import { useState } from 'react';

const Signup = ({ onSignupSuccess }) => {
  const [errors, setErrors] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleChangeLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrors(null);

    const formData = new FormData(e.target);

    // API REMOVED — Do nothing here
    console.log("Form Submitted", Object.fromEntries(formData));

    // If you want to call onSignupSuccess after submit
    if (onSignupSuccess) onSignupSuccess();
  };

  return (
    <>
      <form
        onSubmit={handleSignUpSubmit}
        className="flex flex-col items-center gap-4 w-full"
        encType="multipart/form-data"
      >
        {errors?.length > 0 && (
          <ul style={{ color: 'red', marginTop: '10px' }}>
            {errors.map((err, i) => (
              <li key={i}>{err.replace(/"/g, '')}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-col md:flex-row w-full px-8 gap-4">
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="border border-gray-400 rounded p-2"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name."
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="middleName">Middle Name</label>
            <input
              type="text"
              className="border border-gray-400 rounded p-2"
              id="middleName"
              name="middleName"
              placeholder="Enter your middle name."
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full px-8 gap-4">
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="border border-gray-400 rounded p-2"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name."
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              className="border border-gray-400 rounded p-2"
              id="companyName"
              name="companyName"
              placeholder="Enter your company name."
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full px-8 gap-4">
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              className="border border-gray-400 rounded p-2"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your company phone number."
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="text"
              className="border border-gray-400 rounded p-2"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Enter mobile number."
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full px-8 gap-4">
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="companyEmailId">Company Email (Login email)</label>
            <input
              type="text"
              className="border border-gray-400 rounded p-2"
              id="companyEmailId"
              name="companyEmailId"
              placeholder="Enter your email."
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="website">Company Website (optional)</label>
            <input
              type="text"
              className="border border-gray-400 rounded p-2"
              id="website"
              name="website"
              placeholder="Enter company website."
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full px-8 gap-4">
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="logo">Company Logo</label>
            <input
              type="file"
              className="border border-gray-400 rounded p-2"
              id="logo"
              name="logo"
              onChange={handleChangeLogo}
            />
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Logo preview"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="address">Company Address</label>
            <textarea
              className="border border-gray-400 rounded p-2"
              id="address"
              name="address"
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full px-8 gap-4">
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="border border-gray-400 rounded p-2"
              id="password"
              name="password"
              placeholder="Enter password."
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 gap-2">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="border border-gray-400 rounded p-2"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password."
            />
          </div>
        </div>

        <div className="w-full px-8">
          <div className="w-full md:w-1/2">
            <button
              type="submit"
              className="bg-gradient-to-t from-blue-500 to-purple-300 rounded-md px-10 py-2 text-white mb-2 hover:bg-gradient-to-t hover:from-blue-600 hover:to-purple-400"
            >
              Create company profile
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Signup;
