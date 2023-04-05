import axios from "axios";
import { Link } from "react-router-dom";
import { Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ManagerHomePage() {
  const navigate = useNavigate();

  function logoutHandler() {
    sessionStorage.removeItem("accessTokenManager");
    navigate("/MLogin");
  }

  return (
    <div>
      {sessionStorage.getItem("accessTokenManager") ? (
        <div class="bg-gray-50 dark:bg-gray-900 h-screen">
          <div>
            <nav
              style={{ padding: "20px" }}
              class="bg-white border-gray-200 px-4 lg:px-7 py-2.5 dark:bg-gray-800"
            >
              <div class="container flex flex-wrap items-center justify-between mx-auto">
                <a href="https://flowbite.com/" class="flex items-center">
                  <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    class="h-6 mr-3 sm:h-9"
                    alt="Flowbite Logo"
                  />
                  <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                    Pratiti Bank
                  </span>
                </a>
                <div class="flex md:order-2 space-x-9">
                  <button
                    type="button"
                    onClick={logoutHandler}
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Logout
                  </button>
                </div>
                <div
                  class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                  id="navbar-cta"
                ></div>
              </div>
            </nav>
          </div>

          <section class="bg-gray-50 dark:bg-gray-900 ">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div class="flex flex-wrap ml-4 pl-8 space-x-20">
                <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <a href="/addServices">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Add Services
                    </h5>
                  </a>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Click here to add the type of services and the
                    sub services.
                  </p>
                  <a
                    href="/addServices"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Click Here
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>

                <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <a href="/assignCounter">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Assign the counter
                    </h5>
                  </a>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Click here to add counter Executive and 
                    assign counter to him.
                  </p>
                  <a
                    href="/assignCounter"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Click Here
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        (window.location.href = "http://localhost:3000/MLogin")
      )}
    </div>
  );
}

export default ManagerHomePage;
