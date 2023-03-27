import axios from 'axios'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


export default function CounterExecutive() {

    const navigate = useNavigate();
    
    const [queue, setQueue] = useState([]);
    const [queueFlag, setQueueFlag] = useState(false);
    const [counterId, setCounterId] = useState();
    const [waitingQueueFlag, setWaitingQueueFlag] = useState();
    const [tokenId, setTokenId] = useState();
    const [waitingQueue, setWaitingQueue] = useState([]);
    const [resolvedResponse, setResolvedResponse] = useState();
    const [tokenIdOfSelected, setTokenIdOfSelected] = useState();


    useEffect(() => {
        let counterExecutiveId = localStorage.getItem("id");
        axios.get(`http://localhost:8080/CEId?id=${counterExecutiveId}`)
            .then(response => {
                console.log("Counter ID: ")
                console.log(response.data)
                setCounterId(response.data);
            })
    }, [])

    function fetchQueue() {
        axios.get(`http://localhost:8080/requestingQueue?counterId=${counterId}`)
            .then(response => {
                console.log(response.data[0].tokenId);
                setQueue(response.data);
                setQueueFlag(true);
                setWaitingQueueFlag(false);
                setTokenId(response.data[0].tokenId);
            })
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
            });
    }

    function nextToken() {
        axios
            .get(`http://localhost:8080/statusWaiting?tokenId=${tokenId}`)
            .then((response) => {
                console.log(response.data);
            });
        console.log("kjfslkdhflksdfhlkdfhldskhdk");
        // this.fetchQueue();
    }

    function chooseFromWaitingQueue() {
        setWaitingQueueFlag(true);
        setTokenIdOfSelected(waitingQueue[0].tokenId);
    }

    function chooseFromQueue() {
        setQueueFlag(true);
        setTokenIdOfSelected(queue[0].tokenId);
        console.log("this is in choose from queue with queue[0] is  " + queue[0].tokenId);
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
            {
                sessionStorage.getItem("accessToken") &&
                <div >
                    <nav className="navbar navbar-light">
                        <a className="navbar-brand text-light" href="/">
                            Counter Executive Dashboard
                        </a>
                        <button type="button" class="btn btn-danger" onClick={logoutHandler}>Logout</button>
                    </nav>
                    <div className='row'>
                        <div>
                            <section className="mt-0 vh-10 pl-5 justify-content-left align-items-left h-100" style={{ background: "transparent" }}>
                                <div className="container">
                                    {/* <div className="row d-flex justify-content-left align-items-left h-100"> */}
                                    {/* <div className=" col-lg-6 mb-3 mb-lg-0"> */}
                                    <div className="card mb-2" style={{ borderRadius: ".5rem" }}>
                                        <div className="row g-3">
                                            <div className="col-md-4 gradient-custom text-center text-white"
                                                style={{ borderTopLeftRadius: ".5rem", borderBottomLeftRadius: ".5rem" }}>
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                    alt="Avatar" className="img-fluid my-5" style={{ width: "80px" }} />
                                                <h5 className='text-dark'>{localStorage.getItem("username").toUpperCase()}</h5>
                                                <button className='btn-success'>ID : {localStorage.getItem("id")}</button>
                                                <p>Counter Executive</p>
                                                <i className="far fa-edit mb-5"></i>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body pt-5">
                                                    <h6 className='font-weight-bolder'>Functionalities</h6>
                                                    <hr className="mt-0"></hr>
                                                    <div className="row ">
                                                        <div className="col-10 mb-2">
                                                            <h6 className='text-align-center'>Display</h6>
                                                            <div className='btn-group pl-3'>
                                                                <button className='btn btn-success m-2' onClick={fetchQueue}>Queue</button>
                                                                <button className='btn btn-success m-2' onClick={fetchWaitingQueue}>Waiting Queue </button>
                                                            </div>
                                                            <h6 className='text-align-center'>Select From...</h6>
                                                            <div className='btn-group pl-3'>
                                                                <button className='btn btn-success m-2' onClick={chooseFromQueue}>Queue</button>
                                                                <button className='btn btn-success m-2' onClick={chooseFromWaitingQueue}>Waiting Queue</button>
                                                            </div>
                                                            <h6 className='text-align-center'>Actionable Buttons...</h6>
                                                            <div className='btn-group pl-3 btn-align-center'>
                                                                <button className='btn btn-success m-2' onClick={nextToken}>Next Token</button>
                                                                <button className='btn btn-success m-2' onClick={resolved}>Serviced</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-start">
                                                        <a href="/"><i className="fab fa-facebook-f fa-lg me-3"></i></a>
                                                        <a href="/"><i className="fab fa-twitter fa-lg me-3"></i></a>
                                                        <a href="/"><i className="fab fa-instagram fa-lg"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {queueFlag &&
                            <table className='table table-hover ml-5 col-md-6 bg-white align-middle text-center table-bordered'>
                                <tbody className=''>
                                    <tr className='mb-0'>
                                        <th className='mb-0'>Token Id</th>
                                        <th className='mb-0'>Service Name</th>
                                        <th className='mb-0'>Service Id</th>
                                    </tr>
                                    {queue.map(token => (
                                        <tr>
                                            <td >{token.tokenId}</td>
                                            <td >{token.serviceDescription}</td>
                                            <td >{token.serviceId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                        {waitingQueueFlag &&
                            <table className='table table-hover ml-5 col-md-6 bg-white align-middle text-center table-bordered'>
                                <tbody className=''>
                                    <tr className='mb-0'>
                                        <th className='mb-0'>Token Id</th>
                                        <th className='mb-0'>Service Name</th>
                                        <th className='mb-0'>Service Id</th>
                                    </tr>
                                    {waitingQueue.map(waitingQueue => (
                                        <tr>
                                            <td >{waitingQueue.tokenId}</td>
                                            <td >{waitingQueue.serviceDescription}</td>
                                            <td >{waitingQueue.serviceId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            }
        </>
    )    
}