import { Button } from "@/components/ui/button";
import { AvatarIcon, EmailIcon, GoogleIcon, LockIcon, Signup } from "@/assets";
import { InputField, Loading, RightSvgBanner } from "@/components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateUserCredentials } from "@/lib/validateAuthData";
import { useDispatch, useSelector } from "react-redux";
import { logIn, sendEmailOtp, signUp } from "@/Redux/Actions/core";
import { auth, signInWithGoogleRedirect } from "@/lib/config/firebase-config";
import { getRedirectResult } from "firebase/auth";
import { cn } from "@/lib/utils";
import { setError } from "@/Redux/Features/core";
function setDataWithExpiration(key, authData, minutes) {
  const now = new Date();
  const expirationTime = new Date(now.getTime() + minutes * 60000);

  const data = {
    authData,
    expiresAt: expirationTime.getTime(),
  };

  localStorage.setItem(key, JSON.stringify(data));
}

const Auth = ({ type }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referCode = queryParams.get("referal");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authData, setAuthData] = useState({
    username: "",
    email: "",
    password: "",
    referredCode: referCode || "",
  });
  // const [error, setError] = useState(null);

  const loading = useSelector((state) => state.core.loading);
  const googleLoading = localStorage.getItem("authloading");
  const errors = useSelector((state) => state.core.error);

  const handleChange = (e) => {
    setAuthData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateUserCredentials({
      ...authData,
      type: type,
    });
    dispatch(setError({ message: validationError }));

    if (!validationError) {
      if (type === "signup") {
        setDataWithExpiration("authData", authData, 5);

        dispatch(sendEmailOtp({ email: authData.email, navigate }));
      } else
        dispatch(
          logIn({ userData: { ...authData, type: "manual" }, navigate })
        );

      dispatch(setError({ message: null }));
    }
  };

  const handleGoogleAction = (e) => {
    e.preventDefault();
    localStorage.setItem("type", JSON.stringify(type));
    localStorage.setItem("authloading", JSON.stringify(true));
    signInWithGoogleRedirect();
  };

  useEffect(() => {
    const type = JSON.parse(localStorage.getItem("type"));

    async function getLoginResult() {
      try {
        const response = await getRedirectResult(auth);

        if (response) {
          const dataForMongo = {
            username: response.user.displayName,
            email: response._tokenResponse.email,
            profilePic: response.user.photoURL,
            uid: response.user.uid,
          };

          if (type === "signup")
            dispatch(
              signUp({
                userData: { ...dataForMongo, type: "google" },
                navigate,
              })
            );
          else
            dispatch(
              logIn({
                userData: { ...dataForMongo, type: "google" },
                navigate,
              })
            );
        }
        setAuthData({
          username: "",
          email: "",
          password: "",
          referredCode: "",
        });
      } catch (error) {
        dispatch(setError(`Login failed: ${error.message}`));
      }
    }
    getLoginResult();
  }, []);

  useEffect(() => {
    dispatch(setError({ message: null }));
    setAuthData({
      username: "",
      email: "",
      password: "",
      referredCode: referCode,
    });
    if (
      JSON.parse(localStorage.getItem("authData"))?.expiresAt &&
      JSON.parse(localStorage.getItem("authData"))?.expiresAt <
        new Date().getTime()
    )
      localStorage.removeItem("authData");

    localStorage.removeItem("timer");
  }, [type]);

  useEffect(() => {
    const handlePopState = () => {
      localStorage.removeItem("authloading");
      localStorage.removeItem("type");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (referCode) {
      setAuthData((prevState) => ({
        ...prevState,
        referredCode: referCode,
      }));
    }
  });
  return (
    <>
      {/* {!loading || error ? ( */}
      <main className="flex flex-col-reverse items-center justify-center md:flex-row h-full font-sans md:bg-lightGreen  lg:bg-white">
        <div className=" w-full  max-h-5/12 lg:w-1/2  flex flex-col  items-center ">
          <div className="bg-white  rounded-xl w-9/12 md:w-8/12 h-full md:px-[5%] md:py-[10%]  lg:p-0 flex flex-col justify-center">
            <form
              className="w-full space-y-5 md:space-y-2 h-fit"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <h1
                className={cn(
                  type === "signup" ? " mb-3 md:mb-8" : "mb-3 md:mb-12",
                  "text-xl md:text-4xl font-extrabold md:font-bold "
                )}
              >
                {type === "signup" ? "Sign up" : "Sign In"}
              </h1>
              {type === "signup" && (
                <InputField
                  title="Name"
                  name="username"
                  astrik
                  value={authData.username}
                  icon1={<AvatarIcon />}
                  placeholder="User name"
                  type="text"
                  onChange={handleChange}
                />
              )}
              <InputField
                title="Email"
                astrik
                name="email"
                value={authData.email}
                icon1={<EmailIcon />}
                placeholder="1234@gmail.com"
                type="mail"
                onChange={handleChange}
              />
              <div className="space-y-2 md:space-y-3">
                <InputField
                  title="Password"
                  astrik
                  name="password"
                  value={authData.password}
                  icon1={<LockIcon />}
                  placeholder="************"
                  type="password"
                  onChange={handleChange}
                />
                {type === "signup" && (
                  <InputField
                    title="Referrel Code?"
                    name="referredCode"
                    value={authData?.referredCode}
                    placeholder="enter referrel code if any.."
                    type="text"
                    onChange={handleChange}
                    disabled={referCode}
                  />
                )}
                <div className="w-full flex justify-between gap-5">
                  {type === "signup" ? (
                    <p className="text-xs md:text-sm">
                      Already have an account ?{" "}
                      <Link to="/login" className="text-darkGreen font-bold ">
                        Log in.
                      </Link>
                    </p>
                  ) : (
                    <p className="text-xs md:text-sm">
                      Don't have an account ?{" "}
                      <Link to="/signup" className="text-darkGreen font-bold">
                        Sign up.
                      </Link>
                    </p>
                  )}
                  <Link to="/forgot-password">
                    <p className="text-xs md:text-sm">Forgot password</p>
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-darkGreen text-white py-3 md:py-6 hover:bg-darkGreen hover:text-white rounded-xl text-sm md:text-lg"
                >
                  {loading ? (
                    <div
                      className="w-full flex justify-center items-center text-center"
                      role="status"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-teal-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="text-[#778899]">Please Wait...</span>
                    </div>
                  ) : type === "signup" ? (
                    "Sign up"
                  ) : (
                    "Log in"
                  )}
                </Button>
                {errors && (
                  <p className="text-xs text-red-500 font-semibold">
                    <span className="mr-1">*</span>
                    {errors}
                  </p>
                )}
              </div>
            </form>

            <div className="w-full my-2 md:my-6">
              <div className="flex justify-between items-center">
                <div className="relative w-[43%] ">
                  <hr className="w-full circle-right" size="20px" />
                </div>
                <p className="font-bold text-iconColor -mt-0.5">OR</p>
                <div className="relative w-[43%] ">
                  <hr className="w-full circle-left" />
                </div>
              </div>
            </div>

            <Button
              className="w-full  gap-2 py-2 text-sm md:text-md md:py-6  bg-lightGrey text-black hover:bg-lightGrey hover:text-black rounded-xl"
              onClick={handleGoogleAction}
            >
              <GoogleIcon />{" "}
              {googleLoading ? (
                <div
                  className="w-fit ml-4 flex justify-center items-center text-center"
                  role="status"
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-teal-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="text-[#778899]">Please Wait...</span>
                </div>
              ) : type === "signup with Google" ? (
                "Sign up"
              ) : (
                "Log in with Google"
              )}
            </Button>
          </div>
        </div>
        <RightSvgBanner icon={Signup} />
      </main>
      {/* ) : (
        <Loading />
      )} */}
    </>
  );
};

export default Auth;
