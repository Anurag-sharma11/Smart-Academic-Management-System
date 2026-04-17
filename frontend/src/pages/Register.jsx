import { Link } from "react-router-dom"

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          ALASK Register
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white outline-none"
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Register
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register