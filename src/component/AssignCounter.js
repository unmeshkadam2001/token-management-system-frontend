import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AssignCounter() {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [counterExecutiveName, setCounterExecutiveName] = useState("");
  const [password, setPassword] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/getServicesTypes")
      .then((response) => {
        console.log(response.data);
        setServiceTypes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // check if all fields have a value
    if (!counterExecutiveName || !password || !serviceTypeId) {
      toast.warning("All fields are required");
      return;
    }

    const data = {
      counterExecutiveName: counterExecutiveName,
      password: password,
      serviceTypeId: serviceTypeId,
    };
    axios
      .post("http://localhost:8080/assignCounter", data)
      .then((response) => {
        // setMessage("Counter assigned successfully.");
        toast.success(response.data, {icon:"✌️"});
      })
      .catch((error) => {
        console.log(error);
        toast.error("Counter Assignment Failed!", {icon:"❌"})
        // setMessage("Counter assignment failed.");
      });
  };

  return (
    <div>
      <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              class="w-8 h-8 mr-2"
              src="https://flowbite.com/docs/images/logo.svg"
              alt="logo"
            ></img>
            Pratiti
          </a>
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Assign counter
              </h1>
              <form
                onSubmit={handleSubmit}
                class="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Counter Executive Name:
                  </label>
                  <input
                    type="text"
                    name="text"
                    value={counterExecutiveName}
                    onChange={(event) =>
                      setCounterExecutiveName(event.target.value)
                    }
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter counter executive name..."
                    required=""
                  ></input>
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="form2Example2"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="form-control"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  ></input>
                </div>
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select a service type:
                  </label>
                  <select
                    value={serviceTypeId}
                    onChange={(event) => setServiceTypeId(event.target.value)}
                    required
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select a service type</option>
                    {serviceTypes.map((serviceType) => (
                      <option key={serviceType.id} value={serviceType.id}>
                        {serviceType.typeOfService}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    style={{ marginLeft: "120px" }}
                    type="submit"
                    class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                  >
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Assign Counter
                    </span>
                  </button>
                </div>
                {/* {message && (
                  <div
                    class="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      class="flex-shrink-0 inline w-5 h-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="sr-only">Info</span>
                    <div>{message}</div>
                  </div>
                )} */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AssignCounter;
