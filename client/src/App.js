import React, { useState, useEffect } from "react";
import "./App.css";
import { Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Web3 from "web3";
const web3 = new Web3(window.ethereum);
const path = require("./contracts/WillRegistrar.json");
const contractAddress = "0xf64f129ed3dcc64a5Ee764AAf42E20A93b8dbE0F";
const contract = new web3.eth.Contract(path.abi, contractAddress);

const ethEnabled = () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    return true;
  }
  return false;
};
function App() {
  // states

  //Will Registration
  const [testatorName, setTestatorName] = useState("");
  const [propName, setPropName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryAddress, setBeneficiaaryAddress] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [ownerHomeAddress, setOwnerHomeAddress] = useState("");
  const [ownerAccAddress, setOwnerAccAddress] = useState("");
  //executor
  const [executorAddress, setExecutorAddress] = useState("");
  //will Transfer
  const [toowner, setToOwner] = useState("");
  const [newTestatorName, setNewTestatorName] = useState("");
  const [newBeneficiary, setNewBeneficiary] = useState("");
  const [newBeneficiaryAddress, setNewBeneficiaryAddress] = useState("");
  const [newOwnerHomeAddress, setNewOwnerHomeAddress] = useState("");

  const [willOwner, setWillOwner] = useState(null);
  const [willStatus, setWillStatus] = useState(null);
  const [willstatAddr, setWillStatAddr] = useState(null);
  //contract ownership transfer
  const [transferOwnershipAddress, setTransferOwnershipAddress] = useState("");
  //showcontractownerr
  const [owner, setOwner] = useState("");
  //get will owner address for detail
  const [showWillOwner, setShowWillOwner] = useState("");
  //Will Details
  const [showWillAddress, setShowWillAddress] = useState("");
  // will details in table states
  const [showWillAddress1, setShowWillAddress1] = useState("");
  const [showWillAddress2, setShowWillAddress2] = useState("");
  const [showWillAddress3, setShowWillAddress3] = useState("");
  const [showWillAddress4, setShowWillAddress4] = useState("");
  const [showWillAddress5, setShowWillAddress5] = useState("");

  //this function runs only once,
  //o we have put accounts and willtable function in this code block.
  useEffect(() => {
    accounts();
    //getOwner();
    getWillinTable();
    ethEnabled();
  }, []);

  let accounts;
  //fethching  web3 accounts
  accounts = async () => {
    await web3.eth.getAccounts(function (error, result) {
      console.log(result);
    });
  };
  //get contract owner, this is fetched from access control contract importing from open zeppelin library
  let getOwner = async () => {
    let own = await contract.methods.owner().call();
    setOwner(own);
  };

  // renounceOwnershipCall, this is fetched from access control contract importing from open zeppelin library
  // only callable by contract owner, when this is called succesfully then the contract has not any owner.
  async function renounceOwnershipCall() {
    let accounts = await web3.eth.getAccounts();
    let ownRenounce = await contract.methods
      .renounceOwnership()
      .send({ from: accounts[0] });
    console.log("result====", ownRenounce);
  }
  // gives list of registered owners
  async function getallwillOwners() {
    let accounts = await web3.eth.getAccounts();
    let owners = await contract.methods
      .getAllUsersAddresses()
      .call({ from: accounts[0] });
    setWillOwner(owners);
  }
  // our will contract has 3 states, so user can fetch his state by this function
  async function getallwillStatus() {
    let accounts = await web3.eth.getAccounts();
    let willStat = await contract.methods
      .WillStatus(willstatAddr)
      .call({ from: accounts[0] });
    setWillStatus(willStat);
  }
  // will owner can fetch his asset details by this function
  async function getWill() {
    let accounts = web3.eth.getAccounts();
    let myWill = await contract.methods
      .getPropertyOwner(showWillOwner)
      .call({ from: accounts[0] });
    setShowWillAddress(myWill);
    console.log(myWill);
  }
  //for showing some assets details in table, as this table is nt dynamic we have to do hard code here.
  async function getWillinTable() {
    let accounts = web3.eth.getAccounts();
    let tableWill1 = await contract.methods
      .getPropertyOwner("0xE51eBE2Acd85213165Ca03e543cD1bC94cC29a5C")
      .call({ from: "0xE51eBE2Acd85213165Ca03e543cD1bC94cC29a5C" });
    setShowWillAddress1(tableWill1);
    let tableWill2 = await contract.methods
      .getPropertyOwner("0x2E1F56956f69304Acf2c9deB6Ce8eD7BC5375C1C")
      .call({ from: "0x2E1F56956f69304Acf2c9deB6Ce8eD7BC5375C1C" });
    setShowWillAddress2(tableWill2);
    let tableWill3 = await contract.methods
      .getPropertyOwner("0x56EE54eD0Fc26c2B0B8205FaE4837977a6a34807")
      .call({ from: "0x56EE54eD0Fc26c2B0B8205FaE4837977a6a34807" });
    setShowWillAddress3(tableWill3);
    let tableWill4 = await contract.methods
      .getPropertyOwner("0xE51eBE2Acd85213165Ca03e543cD1bC94cC29a5C")
      .call({ from: accounts[0] });
    setShowWillAddress4(tableWill4);
    let tableWill5 = await contract.methods
      .getPropertyOwner("0xE51eBE2Acd85213165Ca03e543cD1bC94cC29a5C")
      .call({ from: accounts[0] });
    setShowWillAddress5(tableWill5);
    console.log(tableWill1);
  }
  // contract owner address is not able to call this function, only callable by user which are not registered on this contract
  async function registerProperty() {
    let accounts = await web3.eth.getAccounts();
    let result = await contract.methods
      .registerProperty(
        testatorName,
        propName,
        beneficiaryName,
        beneficiaryAddress,
        registrationDate,
        ownerHomeAddress,
        ownerAccAddress
      )
      .send({ from: accounts[0] });
    console.log("result====", result);
  }
  // someone who want to get benfit from ones property, callable by current willowner
  async function executor() {
    let accounts = await web3.eth.getAccounts();
    let result = await contract.methods
      .Executor(executorAddress)
      .send({ from: accounts[0] });
    console.log("result====", result);
  }

  // user can transfer his will to other owner, #ownership of will isntransferring here
  async function propTransfer() {
    let accounts = await web3.eth.getAccounts();
    let Twill = await contract.methods
      .transferWill(
        toowner,
        newTestatorName,
        newBeneficiary,
        newBeneficiaryAddress,
        newOwnerHomeAddress
      )
      .send({ from: accounts[0] });
    console.log("result====", Twill);
  }
  // If I deplpoy the contract to blockchain by my address, I am the owner of contract.
  //So, this function is for onlyOwner(access control) and it transfers the contract ownership to other owner, not will/asset
  async function transferContractOwnership() {
    let accounts = await web3.eth.getAccounts();
    let result = await contract.methods
      .transferOwnership(transferOwnershipAddress)
      .send({ from: accounts[0] });
    console.log("result====", result);
  }

  return (
    <div>
      {/* navigation bar from bootstrap */}
      <nav className="navbar navbar-expand-lg  navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand" href="#">
          <img
            style={{ height: "40px", width: "50" }}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/512px-Ethereum-icon-purple.svg.png"
            className="App-logo"
            alt="Ethereum logo"
          />
        </a>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a className="nav-link" href="#headingRegistration">
                Register Will <span className="sr-only">(current)</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link " href="#headingTwo">
                Executor
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#headingThree">
                Will Transfer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#willDetails">
                Show My Will
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#headingWillStatus">
                Get Will Status
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {/* navigation  bar end */}

      {/* scrolspy call, for all divisions */}
      <div
        className=" container-fluid jumbotron"
        data-spy="scroll"
        data-target="#navbar-example2"
        data-offset="0"
      >
        <div className="accordion" id="accordionExample">
          {/* Will Dteails Table */}
          <div className="card">
            <div className="card-header" id="headingOne">
              <h2 className="mb-0">
                <button
                  className="btn btn-link btn-block text-left collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Some Registered Assets
                </button>
              </h2>
            </div>
            <div
              id="collapseOne"
              className="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                {/* TableStart */}
                <h5 className="card-title d-flex justify-content-center">
                  List of Wills Registered on our Decentralized Plateform
                </h5>
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">TesTatorName</th>
                      <th scope="col">Beneficiary Name</th>
                      <th scope="col">Asset Name</th>
                      <th scope="col">Home Address</th>
                      <th scope="col">Date Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{showWillAddress1["0"]}</td>
                      <td>{showWillAddress1["2"]}</td>
                      <td>{showWillAddress1["1"]}</td>
                      <td>{showWillAddress1["6"]}</td>
                      <td>{showWillAddress1["4"]}</td>
                    </tr>
                    <tr>
                      <td>{showWillAddress2["0"]}</td>
                      <td>{showWillAddress2["2"]}</td>
                      <td>{showWillAddress2["1"]}</td>
                      <td>{showWillAddress2["6"]}</td>
                      <td>{showWillAddress2["4"]}</td>
                    </tr>
                    <tr>
                      <td>{showWillAddress3["0"]}</td>
                      <td>{showWillAddress3["2"]}</td>
                      <td>{showWillAddress3["1"]}</td>
                      <td>{showWillAddress3["6"]}</td>
                      <td>{showWillAddress3["4"]}</td>
                    </tr>
                    <tr>
                      <td>{showWillAddress4["0"]}</td>
                      <td>{showWillAddress4["2"]}</td>
                      <td>{showWillAddress4["1"]}</td>
                      <td>{showWillAddress4["6"]}</td>
                      <td>{showWillAddress4["4"]}</td>
                    </tr>
                    <tr>
                      <td>{showWillAddress5["0"]}</td>
                      <td>{showWillAddress5["2"]}</td>
                      <td>{showWillAddress5["1"]}</td>
                      <td>{showWillAddress5["6"]}</td>
                      <td>{showWillAddress5["4"]}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RegisterWill */}
          <div className="card">
            <div className="card-header" id="headingRegistration">
              <h2 className="mb-0">
                <button
                  className="btn btn-link btn-block text-left"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseRegister"
                  aria-expanded="true"
                  aria-controls="collapseRegister"
                >
                  Will Registration
                </button>
              </h2>
            </div>
            <div
              id="collapseRegister"
              className="collapse "
              aria-labelledby="headingRegistration"
              data-parent="#accordionExample"
            >
              <div className="card-body ">
                <h5 className="card-title d-flex justify-content-center">
                  Enter your Will Detials Carefully, not changeable once
                  registered
                </h5>

                {/* register will form */}
                <form className=" d-flex justify-content-center">
                  <p>
                    <label></label>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Testator Name"
                        onChange={(e) => {
                          setTestatorName(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                      <input
                        type="text"
                        placeholder="Asset Name"
                        onChange={(e) => {
                          setPropName(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />

                      <input
                        type="text"
                        placeholder="Beneficiary"
                        onChange={(e) => {
                          setBeneficiaryName(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Beneficiary Address"
                        onChange={(e) => {
                          setBeneficiaaryAddress(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                      <input
                        type="text"
                        placeholder="R-Date dd/mm//yy"
                        onChange={(e) => {
                          setRegistrationDate(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                      <input
                        type="text"
                        placeholder="WillOwner Home Address"
                        onChange={(e) => {
                          setOwnerHomeAddress(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                    </div>
                    <div className="form-group form-inline">
                      <input
                        type="text"
                        placeholder="Will Owner Account Address"
                        onChange={(e) => {
                          setOwnerAccAddress(e.target.value);
                        }}
                        required
                        style={{ margin: "12px", width: "230px" }}
                      />
                    </div>
                    <div className=" d-flex justify-content-center">
                      <Button
                        className="btn btn-success"
                        onClick={registerProperty}
                      >
                        Register
                      </Button>
                    </div>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Executor */}
          <div className="card">
            <div className="card-header" id="headingTwo">
              <h2 className="mb-0">
                <button
                  className="btn btn-link btn-block text-left collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Executor
                </button>
              </h2>
            </div>
            <div
              id="collapseTwo"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                <h5 className="card-title  d-flex justify-content-center">
                  It fetches data from blockchain and authenticate automatically
                </h5>

                {/* executor registration */}
                <form className=" d-flex justify-content-center form-inline">
                  <input
                    type="text"
                    placeholder="Will owner Address"
                    onChange={(e) => {
                      setExecutorAddress(e.target.value);
                    }}
                    required
                    style={{ margin: "12px" }}
                  />
                  <Button className="btn btn-success" onClick={executor}>
                    Executor Registration
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Will Transfer */}
          <div className="card">
            <div className="card-header" id="headingThree">
              <h2 className="mb-0">
                <button
                  className="btn btn-link btn-block text-left collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Will Transfer
                </button>
              </h2>
            </div>
            <div
              id="collapseThree"
              className="collapse"
              aria-labelledby="headingThree"
              data-parent="#accordionExample"
            >
              <div className="card-body ">
                <h5 className="card-title d-flex justify-content-center">
                  Transfer Your Will Carefully
                </h5>
                {/* register will form */}
                <form className=" d-flex justify-content-center">
                  <p>
                    <label></label>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="New OwnerAddress"
                        onChange={(e) => {
                          setToOwner(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                      <input
                        type="text"
                        placeholder="New Owner Name"
                        onChange={(e) => {
                          setNewTestatorName(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />

                      <input
                        type="text"
                        placeholder="New Beneficiary"
                        onChange={(e) => {
                          setNewBeneficiary(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="New Beneficiary Address"
                        onChange={(e) => {
                          setNewBeneficiaryAddress(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                      <input
                        type="text"
                        placeholder="New Owner Home Address"
                        onChange={(e) => {
                          setNewOwnerHomeAddress(e.target.value);
                        }}
                        required
                        style={{ margin: "12px" }}
                      />
                    </div>
                    <div className=" d-flex justify-content-center">
                      <Button
                        className="btn btn-success "
                        onClick={propTransfer}
                      >
                        Transfer
                      </Button>
                    </div>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/*   WillShow */}
          <div className="card">
            <div className="card-header" id="willDetails">
              <h2 className="mb-0">
                <button
                  className="btn btn-link btn-block text-left collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapsefour"
                  aria-expanded="false"
                  aria-controls="collapsefour"
                >
                  Show My Asset Details
                </button>
              </h2>
            </div>
            <div
              id="collapsefour"
              className="collapse"
              aria-labelledby="willDetails"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-center">
                  You can see your will details by providing your address{" "}
                </h5>

                {/* { table to show only for testing purpose, you can uncomment to test this.
                // showWillAddress && (
                    <div>
                        <p><b>Testator Name  : </b>{showWillAddress['0']} </p>
                        <p><b>Property Name  : </b>{showWillAddress['1']}</p>
                        <p><b>Beneficiary  : </b>{showWillAddress['2']}</p>
                        <p><b>Beneficiary Address : </b>{showWillAddress['3']}</p>
                        <p><b>Registration Date : </b>{showWillAddress['4']}</p>
                        <p><b>Will Owner Address : </b>{showWillAddress['5']}</p>
                        <p><b>Will Owner Home Address : </b>{showWillAddress['6']}</p>
                    </div>
               // )
      } */}

                <div
                  className=" d-flex justify-content-center"
                  style={{ margin: "0px 150px 0px 150px" }}
                >
                  <table className="table table-striped table-md table-bordered ">
                    <thead>
                      <tr>
                        <th scope="col">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Address 0xE51"
                            onChange={(e) => {
                              setShowWillOwner(e.target.value);
                            }}
                            required
                          />
                        </th>
                        <th scope="col">
                          <Button
                            className="btn btn-primary btn-lg btn-block  btn-sm"
                            onClick={getWill}
                          >
                            Show My Will
                          </Button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Testator Name </th>
                        <td>{showWillAddress["0"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Property Name</th>
                        <td>{showWillAddress["1"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Beneficiary</th>
                        <td>{showWillAddress["2"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Beneficiary Address</th>
                        <td>{showWillAddress["3"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Registration Date</th>
                        <td>{showWillAddress["4"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Will Owner Address</th>
                        <td>{showWillAddress["5"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Will Owner Home Address</th>
                        <td>{showWillAddress["6"]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* will Status */}
          <div className="card">
            <div className="card-header" id="headingWillStatus">
              <h2 className="mb-0">
                <button
                  className="btn btn-link btn-block text-left collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseStatus"
                  aria-expanded="false"
                  aria-controls="collapseStatus"
                >
                  Check Will Registration Status
                </button>
              </h2>
            </div>
            <div
              id="collapseStatus"
              className="collapse"
              aria-labelledby="headingWillStatus"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-center">
                  You can see your will status(0,1,2 = not Registered,
                  Registered,Finalize) by providing your address
                </h5>
                <form
                  className="d-flex justify-content-center"
                  style={{ margin: "12px" }}
                >
                  <input
                    type="text"
                    placeholder="Addr to check will status"
                    onChange={(e) => {
                      setWillStatAddr(e.target.value);
                    }}
                    required
                    style={{ margin: "12px" }}
                  />
                </form>
                <div className="d-flex justify-content-center">
                  <div style={{ margin: "12px" }}>{willStatus}</div>
                  <Button
                    className=" btn-sm card-title "
                    onClick={getallwillStatus}
                  >
                    get My Will Status
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Admin functionality */}
          <div className="card">
            <div className="card-header" id="headingadministration">
              <h2 className="mb-0">
                <button
                  className="btn btn-link btn-block text-left collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseAdmin"
                  aria-expanded="false"
                  aria-controls="collapseAdmin"
                >
                  Admin Fucntions
                </button>
              </h2>
            </div>
            <div
              id="collapseAdmin"
              className="collapse"
              aria-labelledby="headingadministration"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                {/* contract ownership transfer */}
                <h5 className="card-title">
                  Transfer Contrat ownership to new contract
                </h5>
                <form>
                  <input
                    type="text"
                    placeholder="Address to TransferOwnership"
                    onChange={(e) => {
                      setTransferOwnershipAddress(e.target.value);
                    }}
                    required
                    style={{ margin: "12px" }}
                  />
                  <Button
                    className="btn btn-primary mb-2"
                    onClick={transferContractOwnership}
                  >
                    TransferOwnerShip
                  </Button>
                </form>
                <hr />
                {/* //show Contract Owner */}
                <h5 className="card-title">
                  By Clicking this button contract owner address will show
                </h5>
                <form className="form-inline">
                  <Button className="btn btn-primary mb-2" onClick={getOwner}>
                    get Owner
                  </Button>
                  <p style={{ marginLeft: "35px" }}>{owner}</p>
                </form>
                <hr />
                {/* //Get All Registered Users */}
                <h5 className="card-title">
                  By Clicking this button all registered addresses will show
                </h5>

                {willOwner && <p>{`totol address:${willOwner["0"]}`}</p>}
                {willOwner &&
                  willOwner["1"].map((owner, index) => (
                    <div>
                      <span>{index}: </span>
                      <span style={{ marginLeft: 10 }}>{owner}</span>
                    </div>
                  ))}
                <Button onClick={getallwillOwners}>getAllOwners</Button>
                <hr />
                {/* //Renounce OwnerShip */}
                <h5 className="card-title">
                  By Clicking this button ownership will be renounced
                </h5>
                <Button onClick={renounceOwnershipCall}>
                  renounceOwnership
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end scrollspy class */}
    </div>
  );
}
export default App;
