import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from "react-dom";

// function TokenDetails({ token }) {
//   return (
//     <div style={{ backgroundColor: 'lightgray', padding: '10px' , width:"430px" }}>
//       <div>
//         <table style={{ border: '1px solid black'}}>
//           <tbody>
//             <tr>
//               <th style={{ borderRight: '1px solid black' }}>
//                 ID
//               </th>
//               <td>{token.tokenId}</td>
//             </tr>
//             <tr>
//               <th style={{ borderRight: '1px solid black' }}>
//                 Service:
//               </th>
//               <td>{token.serviceDescription}</td>
//             </tr>
//             <tr>
//               <th style={{ borderRight: '1px solid black' }}>
//                 Token Generation Time:
//               </th>
//               <td>{token.tokenGenerationTime}</td>
//             </tr>
//             <tr>
//               <th style={{ borderRight: '1px solid black' }}>
//                 Expected Waiting Time:
//               </th>
//               <td>{token.expectedWaitingTime}</td>
//             </tr>
//             <tr>
//               <th style={{ borderRight: '1px solid black' }}>
//                 Status:
//               </th>
//               <td>{token.status}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }




function TokenGeneration() {
  const [servicesData, setServicesData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [tokenID, settokenID] = useState("");
  const [tokenDetails, setTokenDetails] = useState(null);
  const [error, setError] = useState(null);

  // const printToken = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8080/requestingSpecificTokenBasedOnTokenId?tokenId=${tokenID}`
  //     );
  //     const data = response.data;
  //     setTokenDetails(data);
  //     console.log(data);
  //     console.log(data.serviceDescription);
  //     const newWindow = window.open();
  //     newWindow.document.write(
  //       "<html><head><title>Token Details</title><style>body { font-family: sans-serif; }</style></head><body>"
  //     );
  //     newWindow.document.write("<div>");
  //     ReactDOM.render(
  //       <TokenDetails token={data} />,
  //       newWindow.document.body.appendChild(document.createElement("div"))
  //     );
  //     newWindow.document.write("</div></body></html>");
  //     newWindow.print();
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  useEffect(() => {
    axios
      .get("http://localhost:8080/getServicesTypesForTokenGeneration")
      .then((response) => {
        setServicesData(response.data);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);

    const services = servicesData.find(
      (service) => service.typeOfService === selectedType
    ).services;
    setSelectedServices(services);
  };

  const handleServiceChange = (event) => {
    const selectedServiceId = event.target.value;
    setSelectedServiceId(selectedServiceId);
  };

  const generateToken = () => {
    const service = servicesData.find((service) =>
      service.services.find((s) => s.id === parseInt(selectedServiceId))
    );
    const data = {
      expectedWaitingTime: "00:00",
      tokenGenerationTime: "00:00",
      status: "ACTIVE",
      service: {
        serviceId: service.services.find(
          (s) => s.id === parseInt(selectedServiceId)
        ).id,
        serviceName: service.services.find(
          (s) => s.id === parseInt(selectedServiceId)
        ).serviceName,
        serviceType: {
          id: service.id,
          typeOfService: service.typeOfService,
        },
        status: "ACTIVE",
      },
    };
    axios
      .post("http://localhost:8080/generateToken", data)
      .then((response) => {
        console.log(response.data);
        settokenID(response.data);
      })
      .catch((error) => {
        console.log(error);
        settokenID(error);
      });
  };

  return (
    <div>
      <section class="bg-gray-50 dark:bg-gray-900 h-screen">
        <div class=" flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
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
            <div class="p-6 space-y-4 md:space-y-1 sm:p-5">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Token Generation
              </h1>
              <div>
                <br></br>
                <div>
                  <label
                    htmlFor="typeOfService"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Type of Service:
                  </label>
                  <select
                    id="typeOfService"
                    name="typeOfService"
                    value={selectedType}
                    onChange={handleTypeChange}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select a type of service</option>
                    {servicesData.map((service) => (
                      <option key={service.id} value={service.typeOfService}>
                        {service.typeOfService}
                      </option>
                    ))}
                  </select>
                  <br></br>
                </div>
                {selectedServices.length > 0 && (
                  <div>
                    <label
                      htmlFor="services"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Services:
                    </label>
                    <select
                      id="services"
                      name="services"
                      value={selectedServiceId}
                      onChange={handleServiceChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Select a service</option>
                      {selectedServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.serviceName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <br></br>
                {selectedServiceId && (
                  <div>
                    <button
                      style={{ marginLeft: "120px" }}
                      type="button"
                      onClick={generateToken}
                      class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    >
                      <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Generate Token
                      </span>
                    </button>
                  </div>
                )}
              </div>
              {tokenID && (
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
                  <div>
                    <p>
                      Token Generated Succesfully! Your Token Id is: {tokenID}
                    </p>
                    <br></br>
                    {/* <div>
                      <button
                        style={{ marginLeft: "85px" }}
                        type="button"
                        onClick={printToken}
                        class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                      >
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                          Print Token
                        </span>
                      </button>
                    </div> */}
                  </div>
                  <br></br>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TokenGeneration;