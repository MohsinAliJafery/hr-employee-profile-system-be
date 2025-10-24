import { useState } from 'react';
import { POST } from '../../api-calls/apiFunctions';

const Signup = ({ onSignupSuccess }) => {
  const [errors, setErrors] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleChangeLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSignUpSubmit = async (e) => {
    setErrors(null);
    e.preventDefault();

    // ✅ Use e.target (the <form> element)
    const formData = new FormData(e.target);

    // Add fields manually if needed (though FormData can already capture them)
    /*  const body = {
      firstName: formData.get('firstName'),
      middleName: formData.get('middleName'),
      lastName: formData.get('lastName'),
      companyWebsite: formData.get('website'),
      companyName: formData.get('companyName'),
      companyPhone: formData.get('phoneNumber'),
      mobileNumber: formData.get('mobileNumber'),
      companyEmailId: formData.get('companyEmailId'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      address: formData.get('address'),
      logo: formData.get('logo').name,
    };
    */
    // ✅ Add the file
    try {
      const response = await POST('/auth/signUp', formData);
      alert('Registered successfully.', response);
      if (onSignupSuccess) onSignupSuccess();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data.messages);
      } else {
        setErrors(['Something is went wrong. Please check.']);
      }
    }
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
              <li key={i}>{err.replace(/"/g, '')}</li> // remove Joi quotes
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
