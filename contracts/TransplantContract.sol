pragma solidity ^0.8.10;

contract TransplantContract {
    struct doctor
    {
        string fullname;
        uint age;
        string gender;
        string medical_id;
        string blood_type;
        string doctorType;
        uint weight;
        uint height;
    }
    struct transporter
    {
        string fullname;
        uint age;
        string gender;
        string medical_id;
        string blood_type;
        string assigned_id;
        bool isAssigned;
        uint weight;
        uint height;
    }
    struct trackStatus
    {
        string medical_id;
        string status;
    }
    mapping (string=>doctor) doctorMap;
    mapping (string=>transporter) transporterMap;
    mapping (string=>trackStatus) trackStatusMap;
    string[] TransportersArray;
    string[] DoctorsArray;
    string[] trackStatusArray;

    function setTransporter(string memory _fullname, uint _age, string memory _gender, string memory _medical_id,
                       string memory _blood_type, uint _weight, uint _height)
    public
    {
        require ( keccak256(abi.encodePacked((transporterMap[_medical_id].medical_id))) != keccak256(abi.encodePacked(_medical_id)));
        transporterMap[_medical_id].fullname = _fullname;
        transporterMap[_medical_id].age = _age;
        transporterMap[_medical_id].gender = _gender;
        transporterMap[_medical_id].medical_id = _medical_id;
        transporterMap[_medical_id].blood_type = _blood_type;
        transporterMap[_medical_id].assigned_id= "";
        transporterMap[_medical_id].isAssigned=false;
        transporterMap[_medical_id].weight = _weight;
        transporterMap[_medical_id].height = _height;

        TransportersArray.push(_medical_id);
    }
    function getDoctor(string memory _medical_id) view public returns(string memory, uint, string memory, string memory, string memory, uint, uint)
    {
        return
        (
            doctorMap[_medical_id].fullname,
            doctorMap[_medical_id].age,
            doctorMap[_medical_id].gender,
            doctorMap[_medical_id].blood_type,
            doctorMap[_medical_id].doctorType,
            doctorMap[_medical_id].weight,
            doctorMap[_medical_id].height
        );
    }
    function setDoctor(string memory _fullname, uint _age, string memory _gender, string memory _medical_id,
                       string memory _blood_type, string memory _type, uint _weight, uint _height)
    public
    {
        require ( keccak256(abi.encodePacked((doctorMap[_medical_id].medical_id))) != keccak256(abi.encodePacked(_medical_id)));
        doctorMap[_medical_id].fullname = _fullname;
        doctorMap[_medical_id].age = _age;
        doctorMap[_medical_id].gender = _gender;
        doctorMap[_medical_id].medical_id = _medical_id;
        doctorMap[_medical_id].blood_type = _blood_type;
        doctorMap[_medical_id].doctorType = _type;
        doctorMap[_medical_id].weight = _weight;
        doctorMap[_medical_id].height = _height;

        DoctorsArray.push(_medical_id);
    }
    function setStatus(string memory _medical_id,string memory status)
    public
    {
        trackStatusMap[_medical_id].medical_id = _medical_id;
        trackStatusMap[_medical_id].status = status;

        trackStatusArray.push(_medical_id);
    }
    function getStatus(string memory _medical_id) view public returns(string memory)
    {
        for(uint i=0;i<trackStatusArray.length;i++)
        {
            if(keccak256(abi.encodePacked((trackStatusMap[trackStatusArray[i]].medical_id))) == keccak256(abi.encodePacked(_medical_id)))
            {
                return trackStatusMap[trackStatusArray[i]].status;
            }
        }
        return "";
    }
    function assignTransporter(string memory _medical_id) public
    {
        for(uint i=0;i<TransportersArray.length;i++)
        {
            if(transporterMap[TransportersArray[i]].isAssigned==false)
            {
                transporterMap[TransportersArray[i]].isAssigned=true;
                transporterMap[TransportersArray[i]].assigned_id=_medical_id;
                break;
            }
        }
    }
    function isTransporterAssigned(string memory _assigned_id) view public returns(bool)
    {
        for(uint i=0;i<TransportersArray.length;i++)
        {
            if(keccak256(abi.encodePacked((transporterMap[TransportersArray[i]].assigned_id))) == keccak256(abi.encodePacked(_assigned_id)))
            {
                return transporterMap[TransportersArray[i]].isAssigned;
            }
        }
        return false;
    }
    function getMedicalidOfTransporter(string memory _assigned_id) view public returns(string memory)
    {
        for(uint i=0;i<TransportersArray.length;i++)
        {
            if(keccak256(abi.encodePacked((transporterMap[TransportersArray[i]].assigned_id))) == keccak256(abi.encodePacked(_assigned_id)))
            {
                return TransportersArray[i];
            }
        }
        return "";
    }

    function getTransporter(string memory _medical_id) view public returns(string memory, uint, string memory, string memory, uint, uint)
    {
        return
        (
            transporterMap[_medical_id].fullname,
            transporterMap[_medical_id].age,
            transporterMap[_medical_id].gender,
            transporterMap[_medical_id].blood_type,
            transporterMap[_medical_id].weight,
            transporterMap[_medical_id].height
        );
    }

    function validateDoctor(string memory _medical_id) view public returns(bool)
    {

     if (keccak256(abi.encodePacked((doctorMap[_medical_id].medical_id))) == keccak256(abi.encodePacked(_medical_id)))
        return true;
     else return false;

    }
    function validateTransporter(string memory _medical_id) view public returns(bool)
    {

     if (keccak256(abi.encodePacked((transporterMap[_medical_id].medical_id))) == keccak256(abi.encodePacked(_medical_id)))
        return true;
     else return false;

    }
    function getAllTransporterIDs() view public returns(string[] memory)
    {
        return TransportersArray;
    }
    function getAllDoctorIDs() view public returns(string[] memory)
    {
        return DoctorsArray;
    }
    function getCountOfTransporters() view public returns (uint)
    {
        return TransportersArray.length;
    }
    function getCountOfDoctors() view public returns (uint)
    {
        return DoctorsArray.length;
    }
}