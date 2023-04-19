import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CELogin(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  function userInput(e) {
    setUsername(e.target.value);
  }

  function passwordInput(e) {
    setPassword(e.target.value);
  }

  function validate() {
    axios
      .post(
        "http://localhost:8080/login",
        { name: username, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        console.log(response.data.status);
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        sessionStorage.setItem("accessToken", "true");
        localStorage.setItem("id", response.data.id);
        if (username=="catchAll" && password=="catchAll") {
          const resolveAfter3Sec = new Promise((resolve) =>
            setTimeout(resolve, 1000)
          );
          toast.promise(resolveAfter3Sec, {
            pending: "Login is pending ",
            success: "Login Successful 👌",
            error: "Login Rejected 🤯",
          });
          setTimeout(() => {
            navigate("/CatchAll");
          }, 1000);
          toast("Welcome CatchAll !, You are good to go...", {
            type: "success",
            delay: 2500,
          });
        } else if (response.data.status === true) {
         
          toast("Welcome " + response.data.name + "!, You are good to go...", {
            type: "success",
            delay: 2200,
          });
          const resolveAfter3Sec = new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
        toast.promise(resolveAfter3Sec, {
          pending: "Login is pending ",
          success: "Login Successful 👌",
          error: "Login Rejected 🤯",
        });
        setTimeout(() => {
          navigate("/CounterExecutive");
        }, 1000);
        } else {  
          toast("Invalid Credentials...😵");
        }
      });
  }

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.com/docs/images/logo.svg"
              alt="logo"
            ></img>
            Pratiti
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Username
                  </label>
                  <input
                    type="text"
                    name="text"
                    id="form2Example1"
                    onChange={userInput}
                    // className="form-control"
                    className="bg-gray-50 form-control border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter username..."
                    required=""
                  ></input>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="form2Example2"
                    onChange={passwordInput}
                    // className="form-control"
                    placeholder="Enter your Password..."
                    className="bg-gray-50 border form-control border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  ></input>
                </div>
                <div>
                  <button
                    style={{ marginLeft: "140px" }}
                    type="button"
                    onClick={validate}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Sign in
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
