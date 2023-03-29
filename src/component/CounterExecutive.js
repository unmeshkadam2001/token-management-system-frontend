import axios from "axios";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CounterExecutive() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [queueFlag, setQueueFlag] = useState(false);
  const [displayQueueFlag, setDisplayQueueFlag] = useState(false);
  const [displayWaitingQueueFlag, setDisplayWaitingQueueFlag] = useState(false);
  const [waitingQueueFlag, setWaitingQueueFlag] = useState();
  const [tokenId, setTokenId] = useState();
  const [counterId, setCounterId] = useState();
  const [resolvedResponse, setResolvedResponse] = useState();
  const [tokenIdOfSelected, setTokenIdOfSelected] = useState();
  const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    let counterExecutiveId = localStorage.getItem("id");
    axios
      .get(`http://localhost:8080/CEId?id=${counterExecutiveId}`)
      .then((response) => {
        console.log("Counter ID: ");
        console.log(response.data);
        setCounterId(response.data);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((timeRemaining) => timeRemaining - 1);
    }, 1000);
    if (timeRemaining === 0) {
      nextToken();
      setTimeRemaining(60);
    }
    return () => clearInterval(timer);
  }, [timeRemaining]);

  useEffect(() => {
    if (resolvedResponse) {
      setTimeRemaining(60);
    }
  }, [resolvedResponse]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((timeRemaining) => timeRemaining - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function fetchQueue() {
    axios
      .get(`http://localhost:8080/requestingQueue?counterId=${counterId}`)
      .then((response) => {
        console.log(response.data[0].tokenId);
        setQueue(response.data);
        setDisplayQueueFlag(true);
        setDisplayWaitingQueueFlag(false);
        setQueueFlag(true);
        setWaitingQueueFlag(false);
        setTokenId(response.data[0].tokenId);
      });
  }

  function fetchWaitingQueue() {
    axios
      .get(
        `http://localhost:8080/requestingWaitingQueue?counterId=${counterId}`
      )
      .then((response) => {
        console.log(response.data);
        setWaitingQueue(response.data);
        setWaitingQueueFlag(true);
        setQueueFlag(false);
        setDisplayWaitingQueueFlag(true);
        setDisplayQueueFlag(false);
      });
  }

  function nextToken() {
    if (waitingQueueFlag == true && queueFlag != true) {
      const first = waitingQueue[0];
      setWaitingQueue(([first, ...rest]) => [...rest, first]);
    } else {
      axios
      .get(`http://localhost:8080/statusWaiting?tokenId=${tokenId}`)
      .then((response) => {
        console.log(response.data);
      });
    }
  }

  function chooseFromWaitingQueue() {
    setWaitingQueueFlag(true);
    setWaitingQueueFlag(true);
    setTokenIdOfSelected(waitingQueue[0].tokenId);
  }

  function chooseFromQueue() {
    setQueueFlag(true);
    setWaitingQueueFlag(false);
    setTokenIdOfSelected(queue[0].tokenId);
    console.log(
      "this is in choose from queue with queue[0] is  " + queue[0].tokenId
    );
  }

  function resolved() {
    axios
      .get(`http://localhost:8080/resolved?tokenId=${tokenIdOfSelected}`)
      .then((response) => {
        console.log(response.data);
        setResolvedResponse(response.data);
      });
  }

  function logoutHandler() {
    sessionStorage.removeItem("accessToken");
    navigate("/CELogin");
  }

  return (
    <>
      <section class="bg-gray-50 dark:bg-gray-800">
        {sessionStorage.getItem("accessToken") && (
          <div>
            <div>
              <nav class="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
                <div class="container flex flex-wrap items-center justify-between mx-auto">
                  <a href="https://flowbite.com/" class="flex items-center">
                    <img
                      src="https://flowbite.com/docs/images/logo.svg"
                      class="h-6 mr-3 sm:h-9"
                      alt="Flowbite Logo"
                    />
                    <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                      Counter Executive Dashboard
                    </span>
                  </a>
                  <div class="flex  md:order-4">
                    <button
                      type="button"
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Timer : {timeRemaining}
                    </button>
                    <button
                      type="button"
                      onClick={logoutHandler}
                      class="ml-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Logout
                    </button>
                    <button
                      data-collapse-toggle="navbar-sticky"
                      type="button"
                      class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      aria-controls="navbar-sticky"
                      aria-expanded="false"
                    >
                      <span class="sr-only">Open main menu</span>
                      <svg
                        class="w-6 h-6"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
            <br></br>
            <br></br>
            <div class="flex justify-center mt-10">
              <div class="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mr-4">
                <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                  <div class="flex justify-end px-4 pt-4">
                    <button
                      id="dropdownButton"
                      data-dropdown-toggle="dropdown"
                      class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                      type="button"
                    >
                      <span class="sr-only">Open dropdown</span>
                      <svg
                        class="w-6 h-6"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      </svg>
                    </button>
                  </div>
                  <div class=" flex flex-col items-center">
                    <img
                      class="w-24 h-24 mb-3 rounded-full shadow-lg"
                      src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                      alt="Bonnie image"
                    />
                    <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                      {localStorage.getItem("username").toUpperCase()}
                    </h5>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      ID : {localStorage.getItem("id")}
                    </span>
                    <p class="text-sky-400">
                      -----------------------------------------------------------
                    </p>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      Display
                    </span>
                    <div class="flex mt-4 space-x-3 md:mt-6">
                      <button
                        type="button"
                        onClick={fetchQueue}
                        class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Queue
                      </button>
                      <button
                        type="button"
                        onClick={fetchWaitingQueue}
                        class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Waiting Queue{" "}
                      </button>
                    </div>
                    <p class="text-sky-400">
                      -----------------------------------------------------------
                    </p>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      Select From
                    </span>
                    <div class="flex mt-4 space-x-3 md:mt-6">
                      <button
                        type="button"
                        onClick={chooseFromQueue}
                        class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Queue
                      </button>
                      <button
                        type="button"
                        onClick={chooseFromWaitingQueue}
                        class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Waiting Queue
                      </button>
                    </div>
                    <p class="text-sky-400">
                      -----------------------------------------------------------
                    </p>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      Actionable Buttons
                    </span>
                    <div class="flex mt-4 space-x-3 md:mt-6">
                      <button
                        type="button"
                        onClick={nextToken}
                        class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Next Token
                      </button>
                      <button
                        type="button"
                        onClick={resolved}
                        class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Serviced
                      </button>
                    </div>
                    <br></br>
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 ml-4">
                <div class=" relative overflow-x-auto shadow-md ">
                  {displayQueueFlag &&(
                    <table class="border-collapse border border-slate-500 w-full text-sm text-center  text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                        <tr>
                          <th
                            class="border border-slate-600 px-6 py-3"
                            scope="col"
                          >
                            Token Id
                          </th>
                          <th
                            class="border border-slate-600 px-6 py-3"
                            scope="col"
                          >
                            Service Name
                          </th>
                          <th
                            class="border border-slate-600 px-6 py-3"
                            scope="col"
                          >
                            Service Id
                          </th>
                        </tr>
                      </thead>
                      {queue.map((token) => (
                        <tbody>
                          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td
                              scope="row"
                              class="border border-slate-600 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {token.tokenId}
                            </td>
                            <td class="border border-slate-600">
                              {token.serviceDescription}
                            </td>
                            <td class="border border-slate-600">
                              {token.serviceId}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  )}
                  {displayWaitingQueueFlag && waitingQueue.length != 0 &&(
                    <table class="border-collapse border border-slate-500 w-full text-sm text-center text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="mb-0">
                          <th class="border border-slate-600 px-6 py-3">
                            Token Id
                          </th>
                          <th class="border border-slate-600 px-6 py-3">
                            Service Name
                          </th>
                          <th class="border border-slate-600 px-6 py-3">
                            Service Id
                          </th>
                        </tr>
                      </thead>
                      {waitingQueue.map((waitingQueue) => (
                        <tbody>
                          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td
                              scope="row"
                              class="border border-slate-600 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {waitingQueue.tokenId}
                            </td>
                            <td class="border border-slate-600">
                              {waitingQueue.serviceDescription}
                            </td>
                            <td class="border border-slate-600">
                              {waitingQueue.serviceId}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <br></br>
      </section>
    </>
  );
}

