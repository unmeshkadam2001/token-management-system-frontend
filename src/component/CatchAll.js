import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function CatchAll() {

  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [queueFlag, setQueueFlag] = useState(false);
  const [waitingQueueFlag, setWaitingQueueFlag] = useState();
  const [displayQueueFlag, setDisplayQueueFlag] = useState(false);
  const [displayWaitingQueueFlag, setDisplayWaitingQueueFlag] = useState(false);
  const [tokenId, setTokenId] = useState(0);
  const [counterId, setCounterId] = useState();
  const [resolvedResponse, setResolvedResponse] = useState();
  const [tokenIdOfSelected, setTokenIdOfSelected] = useState();
  const [timeRemaining, setTimeRemaining] = useState(60);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining-1);
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

  useEffect(() => {
    let counterExecutiveId = localStorage.getItem("id");
    axios
      .get(`http://localhost:8080/CEId?id=${counterExecutiveId}`)
      .then((response) => {
        setCounterId(response.data);
      });
  }, []);

  function fetchCatchAllQueue() {
    axios
      .get(`http://localhost:8080/requestingCatchAllQueue`)
      .then((response) => {
        setQueue(response.data);
        setDisplayQueueFlag(true);
        setDisplayWaitingQueueFlag(false);
        setTokenId(response.data[0].tokenId);
      }).catch(error => console.log(error));
    }
    function fetchWaitingQueueCatchAllQueue() {
      axios.get(`http://localhost:8080/requestingWaitingQueue?counterId=`)
      .then((response) => {
        console.log(response.data);
        setWaitingQueue(response.data);
        setDisplayQueueFlag(false);
        setDisplayWaitingQueueFlag(true);
      });
  }

  function nextToken(){
    if (waitingQueueFlag == true) {
      const first = waitingQueue[0];
      console.log(first.tokenId)
      setWaitingQueue(([first, ...rest]) => [...rest, first]);
      console.log("inside next token waiting queue flag is true")
      // fetchWaitingQueueCatchAllQueue();
    } else {
      fetchCatchAllQueue();
      axios
        .get(`http://localhost:8080/statusWaiting?tokenId=${tokenId}`)
        .then((response) => {
          console.log(response.data);
        });
    }
  }
  
  function chooseFromWaitingQueue() {
    console.log("inside waiting queue flag...")
    setWaitingQueueFlag(true);
    console.log(waitingQueueFlag, " :Flag status")
    setQueueFlag(false)
    setTokenIdOfSelected(waitingQueue[0].tokenId);
  }

  function chooseFromQueue() {
    axios.get(`http://localhost:8080/processing?tokenId=${tokenId}`)
      .then((response) => {
        console.log("Status of topmost token changed to Processing...:)")
      });
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

        if (queueFlag)
          fetchCatchAllQueue();
        else if (waitingQueueFlag)
          fetchWaitingQueueCatchAllQueue();
        });
  }

  function logoutHandler() {
    sessionStorage.removeItem("accessToken");
    navigate("/CELogin");
  }



  return (
    <>
    <section className="bg-gray-50 dark:bg-gray-800">
      {sessionStorage.getItem("accessToken") && (
        <div>
          <div>
            <nav className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
              <div className="container flex flex-wrap items-center justify-between mx-auto">
                <a href="https://flowbite.com/" className="flex items-center">
                  <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-6 mr-3 sm:h-9"
                    alt="Flowbite Logo"
                  />
                  <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                    Counter Executive Dashboard
                  </span>
                </a>
                <div className="flex  md:order-4">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Timer : {timeRemaining}
                  </button>
                  <button
                    type="button"
                    onClick={logoutHandler}
                    className="ml-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Logout
                  </button>
                  <button
                    data-collapse-toggle="navbar-sticky"
                    type="button"
                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-sticky"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </nav>
          </div>
          <br></br>
          <br></br>
          <div className="flex justify-center mt-10">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mr-4">
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                <div className="flex justify-end px-4 pt-4">
                  <button
                    id="dropdownButton"
                    data-dropdown-toggle="dropdown"
                    className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                    type="button"
                  >
                    <span className="sr-only">Open dropdown</span>
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                  </button>
                </div>
                <div className=" flex flex-col items-center">
                  <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                    alt="Bonnie image"
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {localStorage.getItem("username").toUpperCase()}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ID : {localStorage.getItem("id")}
                  </span>
                  <p className="text-sky-400">
                    -----------------------------------------------------------
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Display
                  </span>
                  <div className="flex mt-4 space-x-3 md:mt-6">
                    <button
                      type="button"
                      onClick={ fetchCatchAllQueue }
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Queue
                    </button>
                    <button
                      type="button"
                      onClick={ fetchWaitingQueueCatchAllQueue }
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Waiting Queue
                    </button>
                  </div>
                  <p className="text-sky-400">
                    -----------------------------------------------------------
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Select From
                  </span>
                  <div className="flex mt-4 space-x-3 md:mt-6">
                    <button
                      type="button"
                      onClick={chooseFromQueue}
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Queue
                    </button>
                    <button
                      type="button"
                      onClick={chooseFromWaitingQueue}
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Waiting Queue
                    </button>
                  </div>
                  <p className="text-sky-400">
                    -----------------------------------------------------------
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Actionable Buttons
                  </span>
                  <div className="flex mt-4 space-x-3 md:mt-6">
                    <button
                      type="button"
                      onClick={ nextToken }
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Next Token
                    </button>
                    <button
                      type="button"
                      onClick={resolved}
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Serviced
                    </button>
                  </div>
                  <br></br>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 ml-4">
              <div className=" relative overflow-x-auto shadow-md ">
                {displayQueueFlag && (
                  <table className="border-collapse border border-slate-500 w-full text-sm text-center  text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                      <tr>
                        <th
                          className="border border-slate-600 px-6 py-3"
                          scope="col"
                        >
                          Token Id
                        </th>
                        <th
                          className="border border-slate-600 px-6 py-3"
                          scope="col"
                        >
                          Service Name
                        </th>
                        <th
                          className="border border-slate-600 px-6 py-3"
                          scope="col"
                        >
                          Service Id
                        </th>
                      </tr>
                    </thead>
                    {queue.map((token) => (
                      <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td
                            scope="row"
                            className="border border-slate-600 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {token.tokenId}
                          </td>
                          <td className="border border-slate-600">
                            {token.serviceDescription}
                          </td>
                          <td className="border border-slate-600">
                            {token.serviceId}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                )}
                {displayWaitingQueueFlag && waitingQueue.length != 0 && (
                  <table className="border-collapse border border-slate-500 w-full text-sm text-center text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr className="mb-0">
                        <th className="border border-slate-600 px-6 py-3">
                          Token Id
                        </th>
                        <th className="border border-slate-600 px-6 py-3">
                          Service Name
                        </th>
                        <th className="border border-slate-600 px-6 py-3">
                          Service Id
                        </th>
                      </tr>
                    </thead>


                    {waitingQueue.map((waitingQueue) => (
                      <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td
                            scope="row"
                            className="border border-slate-600 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {waitingQueue.tokenId}
                          </td>
                          <td className="border border-slate-600">
                            {waitingQueue.serviceDescription}
                          </td>
                          <td className="border border-slate-600">
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
  )
}