// SPDX-License-Identifier: No Lisence
pragma solidity ^0.6.2;
//importing access control contract from open zeppelin library
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract WillRegistrar is Ownable {
    event TransferWill(address indexed from, address indexed to, string name);
    //array to store UserAddresses
    address[] registeredUsersList;

    address private contractOwner;

    //store property against address
    mapping(address => property) public getPropertyOwner;

    //check Registration Status
    mapping(address => Status) public WillStatus;

    //Registration Status 0/1/2/3 = 4
    enum Status {notRegistered, registeredOnContract, registeredFromExecutor}
    Status registrationStatus;

    //storing property in array
    struct property {
        string testatorName;
        string propertyName;
        string beneficiariry;
        address beneficiariryAddress;
        string registrationDate;
        address ownerAddress;
        string ownerHomeAddress;
    }

    //setting contract deployer equals to contract owner just like onlyOwner
    constructor() public {
        registrationStatus = Status.notRegistered;
        msg.sender == contractOwner;
    }

    //trsnsferWill LasstFunction, based on final state(registered from executor)
    function transferWill(
        address _to,
        string memory _newTestatorName,
        string memory _newBeneficiariry,
        address _newBeneficiariryAddress,
        string memory _newOwnerHomeAddress
    ) public returns (bool) {
        require(
                WillStatus[msg.sender] == Status.registeredFromExecutor &&
                msg.sender != contractOwner
        );
        require(_to != address(0));

        for (uint256 i = 0; i < registeredUsersList.length; i++) {
            if (registeredUsersList[i] == msg.sender) {
                getPropertyOwner[_to] = getPropertyOwner[msg.sender];
                getPropertyOwner[_to].testatorName = _newTestatorName;
                getPropertyOwner[_to].beneficiariry = _newBeneficiariry;
                getPropertyOwner[_to]
                    .beneficiariryAddress = _newBeneficiariryAddress;
                getPropertyOwner[_to].ownerHomeAddress = _newOwnerHomeAddress;

                getPropertyOwner[_to].ownerAddress = _to;
                WillStatus[_to] = WillStatus[msg.sender];
                delete getPropertyOwner[msg.sender];
                registeredUsersList.push(_to);
                //event
                // emit TransferWill(msg.sender, _to, _name);
            }
        }
        return true;
    }

    //registerProperty function
    function registerProperty(
        string memory _testatorName,
        string memory _propertName,
        string memory _beneficiariry,
        address _beneficiariryAddress,
        string memory _registrationDate,
        string memory _ownerHomeAddress,
        address _ownerAddress
    ) public returns (bool) {
        require(
            WillStatus[msg.sender] == Status.notRegistered &&
            WillStatus[msg.sender] != Status.registeredOnContract
        );
        require(msg.sender != address(0) && msg.sender != contractOwner);

                getPropertyOwner[msg.sender].testatorName = _testatorName;
                getPropertyOwner[msg.sender].propertyName = _propertName;
                getPropertyOwner[msg.sender].beneficiariry = _beneficiariry;
                getPropertyOwner[msg.sender]
                    .beneficiariryAddress = _beneficiariryAddress;
                getPropertyOwner[msg.sender].registrationDate = _registrationDate;
                getPropertyOwner[msg.sender].ownerHomeAddress = _ownerHomeAddress;
                getPropertyOwner[msg.sender].ownerAddress = _ownerAddress;

                registrationStatus = Status.registeredOnContract;
                WillStatus[msg.sender] = registrationStatus;
                registeredUsersList.push(msg.sender);
                return true;
    }

    //Executor
    function Executor(address _ownerAddress) public returns (bool) {
        require(
                WillStatus[msg.sender] == Status.registeredOnContract &&
                getPropertyOwner[msg.sender].ownerAddress == _ownerAddress
        );
                registrationStatus = Status.registeredFromExecutor;
                WillStatus[msg.sender] = registrationStatus;
    }
    
    //getAllUsers who are in our contract  address[] memory

    function getAllUsersAddresses()
        public
        view
        onlyOwner
        returns (uint256, address[] memory)
    {
        for (uint256 i = 0; i <= registeredUsersList.length; ) {
            //return reregisteredUsersList[i];

            return (registeredUsersList.length, registeredUsersList);
        }
    }
}
