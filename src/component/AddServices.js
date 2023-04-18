import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AddServices() {
  const [typeOfService, setTypeOfService] = useState("");
  const [services, setServices] = useState([
    { serviceName: "", statusOfService: "activate" },
  ]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [message, setMessage] = useState("");

  const handleServiceChange = (index, event) => {
    const updatedServices = [...services];
    updatedServices[index].serviceName = event.target.value;
    setServices(updatedServices);
  };

  const handleStatusChange = (index, event) => {
    const updatedServices = [...services];
    updatedServices[index].statusOfService = event.target.value;
    setServices(updatedServices);
  };

  const handleAddService = () => {
    setServices([
      ...services,
      { serviceName: "", statusOfService: "activate" },
    ]);
  };

  const handleRemoveService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { typeOfService, services };
    const errors = [];
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      if (!service.serviceName) {
        errors.push(`Service ${i + 1} name is required`);
      }
    }
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    await axios
      .post("http://localhost:8080/addService", data)
      .then((response) => {
        // setMessage("Servies added successfully!");
        toast.success("Services added successfully...!", { icon:"✌️" })
      })
      .catch((error) => {
        console.log(error);
        // setMessage("Inserting services failed!");
        toast.error("Failed to insert services!", { icon:"❌" })
      });
  };

  return (
    <div>
      <section class=" bg-gray-50 dark:bg-gray-900 w-full flex flex-col items-center justify-center">
          <a
            href="#"
            class="flex items-center py-9 w-full justify-center text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              class="w-8 h-8 mr-2"
              src="https://flowbite.com/docs/images/logo.svg"
              alt="logo"
            ></img>
            Pratiti
          </a>
          <div class="mb-6 w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 h-max">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add Services
              </h1>
              <form
                onSubmit={handleSubmit}
                class="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <br></br>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Type of Service:
                  </label>
                  <input
                    type="text"
                    name="text"
                    value={typeOfService}
                    onChange={(e) => setTypeOfService(e.target.value)}
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter type of service..."
                    required=""
                  ></input>
                </div>
                <div>
                  {services.map((service, index) => (
                    <div key={index}>
                      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Service {index + 1}:
                        <input
                          type="text"
                          style={{ width:"388px" }}
                          value={service.serviceName}
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required=""
                          onChange={(e) => handleServiceChange(index, e)}
                        />
                      </label>
                      {validationErrors.length > 0 && !service.serviceName && (
                        <p style={{ color: "red" }}>Service name is required</p>
                      )}
                      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Status:
                        <select
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={service.statusOfService}
                          onChange={(e) => handleStatusChange(index, e)}
                        >
                          <option value="activate">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </label>
                      <br></br>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(index)}
                          class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        >
                          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Remove Service
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAddService}
                    class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                  >
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Add Service
                    </span>
                  </button>
                  <button
                    
                    type="submit"
                    class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                  >
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Submit
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
      </section>
    </div>
  );
}

export default AddServices;
