import { useNavigate } from "react-router-dom"
const PageNotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center  justify-center overflow-hidden">
    <div className="text-center ">
      <img
        src='/assets/error.png'
        alt="404 Illustration"
        className="mx-auto mb-8 w-40 md:w-72"
      
      />
      <p className="text-2xl text-gray-600">Page Not Found</p>
      <p className="text-lg text-gray-500 mt-4">
        Oops! Looks like you took a wrong turn.
      </p>
      <button
        className="mt-8 bg-darkGreen text-white py-2 px-4 rounded hover:bg-teal-900"
        onClick={() => navigate('/')}
      >
        Go Back
      </button>
    </div>
  </div>
  )
}

export default PageNotFound