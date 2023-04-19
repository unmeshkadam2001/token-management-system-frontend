import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CatchAll() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [queueFlag, setQueueFlag] = useState(false);
  const [waitingQueueFlag, setWaitingQueueFlag] = useState();
  const [count, setCount] = useState(3);
  const [displayQueueFlag, setDisplayQueueFlag] = useState(false);
  const [displayWaitingQueueFlag, setDisplayWaitingQueueFlag] = useState(false);
  const [tokenId, setTokenId] = useState(0);
  const [counterId, setCounterId] = useState();
  const [resolvedResponse, setResolvedResponse] = useState();
  const [tokenIdOfSelected, setTokenIdOfSelected] = useState();
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isPaused, setIsPaused] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  useEffect(() => {
    let counterExecutiveId = localStorage.getItem("id");
    axios
      .get(`http://localhost:8080/CEId?id=${counterExecutiveId}`)
      .then((response) => {
        setCounterId(response.data);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTimer && !isPaused) {
        setTimeRemaining((timeRemaining) => timeRemaining - 1);
        if (timeRemaining === 0) {
          // nextToken();
          setTimeRemaining(20);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isPaused, startTimer]);

  useEffect(() => {
    if (resolvedResponse) {
      setTimeRemaining(20);
      setStartTimer(false);
    }
  }, [resolvedResponse]);

  function pauseCounter() {
    setIsPaused(true);
  }

  function resumeCounter() {
    setIsPaused(false);
  }

  useEffect(() => {
    fetchData();
    fetchWaitingData();
  }, [])

  async function fetchWaitingData(){
    await axios
    .get(`http://localhost:8080/requestingWaitingQueue?counterId=`)
    .then((response) => {
      console.log("Waiting Queue: ");
      console.log(response.data);
      setWaitingQueue(response.data);
      if(response.data.length!=0)
        setTokenId(waitingQueue[0].tokenId);
    }).catch((error) => toast.error(error));;
  }
  async function fetchData() {
    await axios.get(`http://localhost:8080/requestingCatchAllQueue`)
      .then((response) => {
        console.log(response.data);
        setQueue(response.data);
        if(response.data.length!=0)
          setTokenId(response.data[0].tokenId);
      })
      .catch((error) => console.log(error));    
    
  }



 
  async function nextToken() {
    if (count>0 && queue.length > 0) {  
      queue.length > 0 ? await fetchData() : toast.error("Queue is Empty");
      setTokenId(queue[0].tokenId);
      setDisplayQueueFlag(true);
      setDisplayWaitingQueueFlag(false);
    }else if(waitingQueue.length>0){
      waitingQueue.length > 0 ? await fetchWaitingData() : toast.error("Queue is Empty");
      if(count == -4)setCount(4);
      setTokenId(waitingQueue[0].tokenId);
      setDisplayWaitingQueueFlag(true);
      setDisplayQueueFlag(false);
      const first = waitingQueue[0];
      setWaitingQueue(([first, ...rest]) => [...rest, first]);
      console.log("inside next token waiting queue flag is true");
    }
    setCount(count-1);
    await axios
      .get(`http://localhost:8080/statusWaiting?tokenId=${tokenId}`)
      .then((response) => {
        console.log(count);
        console.log(response.data);
      });
}



async function check(queueData){
  if(queueData == true){
    queue.length==0?toast.error("Queue is Empty!"):console.log("d");
    if(queue.length>0){
      setDisplayQueueFlag(true);
      setDisplayWaitingQueueFlag(false);
    }

  }else if(waitingQueue.length > 0 && queueData == false){
    setDisplayWaitingQueueFlag(true);
    setDisplayQueueFlag(false);
    waitingQueue.length==0?toast.error("Waiting Queue is Empty!"):console.log("object");
    await axios
      .get(`http://localhost:8080/requestingWaitingQueue?counterId=`)
      .then((response) => {
        console.log(response.data);
        setWaitingQueue(response.data);
        setTokenId(response.data[0].tokenId);
      });

  }
}
async function resolved() {
  if(queue.length > 0 && displayQueueFlag == true){
    setTokenId(queue[0].tokenId);
  }else if(waitingQueue.length > 0 && displayWaitingQueueFlag == true){
    setTokenId(waitingQueue[0].tokenId);
  }
  await axios
    .get(`http://localhost:8080/resolved?tokenId=${tokenId}`)
    .then((response) => {
      console.log(response.data);
      setResolvedResponse(response.data);
    });
  await fetchData();
  fetchWaitingData();
}

function logoutHandler() {
  sessionStorage.removeItem("accessToken");
  navigate("/CELogin");
}

return (
  <>
    <section className="bg-gray-50 dark:bg-gray-800 w-screen">
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
                    onClick={pauseCounter}
                    className="ml-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Pause counter
                  </button>
                  <button
                    type="button"
                    onClick={resumeCounter}
                    className="ml-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Resume Counter
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
          <div className="flex justify-center mt-10 w-full">
            {/* <div>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mr-4 ">
                  <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">

                  </div>
                </div>
              </div> */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mr-4 ">
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
                      onClick={ () => check(true) }
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Queue
                    </button>
                    <button
                      type="button"
                      onClick={ ()=> check(false) }
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Waiting Queue
                    </button>
                  </div>
               
                  


                  <br></br>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 ml-4 ">
              <Typography

                variant="h5"
                align="center"
                fontWeight={550}
                mt={15}
              >Details of Current Token</Typography>
              {(displayQueueFlag || displayWaitingQueueFlag ) && ( queue.length > 0 || waitingQueue.length > 0) &&
                (
                  <>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-center text-base text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Queue Type
                            </th>
                            <th scope="col" className="px-6 py-3">
                              {displayWaitingQueueFlag == true ? "Waiting Queue" : "General Queue"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>

                          <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              Token Id
                            </th>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {displayWaitingQueueFlag == true ? waitingQueue[0].tokenId : queue[0].tokenId}
                            </td>

                          </tr>
                          <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              Service Description
                            </th>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {displayWaitingQueueFlag == true ? waitingQueue[0].serviceDescription : queue[0].serviceDescription}
                            </td>

                          </tr>
                          <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              Remaining Chances
                            </th>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {displayWaitingQueueFlag == true ? waitingQueue[0].count : queue[0].count}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="  mt-5 ">
                      <button
                        type="button"
                        onClick={nextToken}
                        className="text-white bg-gradient-to-br mr-10 from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
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
                  </>
                )
              }

            </div>
          </div>
          <div className="bg-dark">
            <div className=" relative overflow-x-auto shadow-md ">
              {(displayQueueFlag && queue.length > 0) && (
                <table className="border-collapse border border-slate-500 text-lg w-100 m-10 text-center  text-gray-500 dark:text-gray-400">
                  <thead className="align-center">General Queue</thead>
                  <thead className="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
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
                      <th
                        className="border border-slate-600 px-6 py-3"
                        scope="col"
                      >
                        Frequency
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
                        <td className="border border-slate-600">
                          {token.count}
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              )}
              {(displayWaitingQueueFlag && waitingQueue.length > 0) && (
                <table className="border-collapse border border-slate-500 w-3/6 m-10 l-4 text-lg text-center text-gray-500 dark:text-gray-400">
                  <thead className="text-sx text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                      <th className="border border-slate-600 px-6 py-3">
                        Frequency
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
                        <td className="border border-slate-600">
                          {waitingQueue.count}
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              )}
            </div>
          </div>
        </div>

      )}
      <br></br>
    </section>
  </>
);
}
