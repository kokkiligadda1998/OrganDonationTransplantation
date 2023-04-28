// Import Web3 JS library
const Web3 = require('web3');
const web3 = new Web3("HTTP://127.0.0.1:7545");

// Import the ABI definition of the DemoContract
const artifact = require('../../build/contracts/DonorContract.json');
const artifact2 = require('../../build/contracts/TransplantContract.json');

// const netid = await web3.eth.net.getId()
const deployedContract = artifact.networks[5777];
const contractAddress = deployedContract.address;

const deployedContract2 = artifact2.networks[5777];
const contractAddress2 = deployedContract2.address;

const MIN_GAS = 1000000;

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}
function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
        }
    }
}
async function generateTableForTransplantMatch(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
        }
        cell = row.insertCell();
        let btn = document.createElement("button");
        let isAssigned= await App.contractInstance2.methods.isTransporterAssigned(element["Donor Medical ID"]+element["Patient Medical ID"]).call();
        if(isAssigned)
        {
            btn.innerHTML="Assigned";
            btn.disabled=true;
        }
        else
        {
            btn.innerHTML = "Assign Transporter";
        }
        btn.onclick= async function(){
            await App.assignTransporter(element["Donor Medical ID"]+element["Patient Medical ID"]);
            btn.innerHTML="Assigned";
            btn.disabled=true;
        }
        cell.appendChild(btn);
    }
}

async function generateTableForTransportDelivery(table, data) {
    let opt=["","Organ Received","Started delivery","Delivery on the way","Delivery Completed"]
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
        }
        cell = row.insertCell();
        let selectList = document.createElement("select");
        let option;
        for(let i of opt)
        {
            option = document.createElement("option");
            option.value = i;
            option.text = i;
            selectList.appendChild(option);
        }
        selectList.onchange=async function(){
            let index= selectList.selectedIndex;
            let status=opt[index];
            let medicalid= await App.contractInstance2.methods.getMedicalidOfTransporter(element["Donor Medical ID"]+element["Patient Medical ID"]).call();
            if(medicalid!="")
            {
                await App.setStatus(element["Donor Medical ID"]+element["Patient Medical ID"],status);
            }
        }
        let status= await App.contractInstance2.methods.getStatus(element["Donor Medical ID"]+element["Patient Medical ID"]).call();
        selectList.selectedIndex=opt.indexOf(status);
        cell.appendChild(selectList);
    }
}

async function generateTableForTansplantation(table, data) {
    let opt=["","Organ Received from transporter","Started surgery","Surgery In-process","Surgery Completed"]
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
        }
        cell = row.insertCell();
        let selectList = document.createElement("select");
        let option;
        for(let i of opt)
        {
            option = document.createElement("option");
            option.value = i;
            option.text = i;
            selectList.appendChild(option);
        }
        let status= await App.contractInstance2.methods.getStatus(element["Donor Medical ID"]+element["Patient Medical ID"]).call();
        selectList.selectedIndex=opt.indexOf(status);
        selectList.onchange=async function(){
            let index= selectList.selectedIndex;
            let status=opt[index];
            let medicalid= await App.contractInstance2.methods.getMedicalidOfTransporter(element["Donor Medical ID"]+element["Patient Medical ID"]).call();
            if(medicalid!="")
            {
                await App.setStatus(element["Donor Medical ID"]+element["Patient Medical ID"],status);
            }
        }
        cell.appendChild(selectList);
    }
}

async function generateTableForTrackStatus(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
        }
        cell = row.insertCell();
        let status= await App.contractInstance2.methods.getStatus(element["Donor Medical ID"]+element["Patient Medical ID"]).call();
        let text = document.createTextNode(status);
        cell.appendChild(text);
    }
}

let table = document.querySelector("table");


function showWarning(user, message, color) {
    let userid = user+"InputCheck";
    var warning = document.querySelector(".alert.warning");
    warning.style.background = color;
    document.getElementById(userid).innerHTML = message;
    warning.style.opacity = "100";
    warning.style.display = "block";
}

function checkInputValues(user, fullname, age, gender, medical_id, organ, weight, height){
    var color = "#ff9800"
    if (fullname=="")
        showWarning(user, "Enter your name", color);
    else if (age.length==0)
        showWarning(user, "Enter your age", color);
    else if (age<18)
        showWarning(user, "You must be over 18 to donate", color);
    else if (gender==null)
        showWarning(user, "Enter your gender", color);
    else if (medical_id.length == 0)
         showWarning(user, "Enter your Medical ID", color);
    else if (user!="Doctor" && user !="Transporter" && organ.length == 0)
        showWarning(user, "Enter organ(s)", color);
    else if (weight.length == 0)
        showWarning(user, "Enter your weight", color);
    else if (weight < 20 || weight > 200)
        showWarning(user, "Enter proper weight", color);
    else if (height.length == 0)
        showWarning(user, "Enter your height", color);
    else if (height < 54 || height > 272)
        showWarning(user, "Enter proper height", color);
    else {
        return true;
    }
}

function assignSearchValues(result, user){
    document.getElementById("get"+user+"FullName").innerHTML = "Full Name: " + result[0];
    document.getElementById("get"+user+"Age").innerHTML = "Age: " + result[1];
    document.getElementById("get"+user+"Gender").innerHTML = "Gender: " + result[2];
    document.getElementById("get"+user+"BloodType").innerHTML = "Blood Type: " + result[3];
    document.getElementById("get"+user+"Organ").innerHTML = "Organ: " + result[4];
    document.getElementById("get"+user+"Weight").innerHTML = "Weight: " + result[5];
    document.getElementById("get"+user+"Height").innerHTML = "Height: " + result[6];
}

function clearSearchValues(user){
    document.getElementById("get"+user+"FullName").innerHTML = null;
    document.getElementById("get"+user+"Age").innerHTML = null;
    document.getElementById("get"+user+"Gender").innerHTML = null;
    document.getElementById("get"+user+"BloodType").innerHTML = null;
    document.getElementById("get"+user+"Organ").innerHTML = null;
    document.getElementById("get"+user+"Weight").innerHTML = null;
    document.getElementById("get"+user+"Height").innerHTML = null;
}

const App = {
    web3: null,
    contractInstance: null,
    accounts: null,

    start: async function() {
        const { web3 } = this;
        // Get the accounts
        this.accounts = await web3.eth.getAccounts();

        console.log(this.accounts);

        this.contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
        this.contractInstance2 = new web3.eth.Contract(
            artifact2.abi,
            contractAddress2
        );
    },

    closeAlert: async function (){
        var alert = document.querySelector(".alert.warning");
        alert.style.opacity = "0";
        setTimeout(function(){ alert.style.display = "none"; }, 600);
    },

    register: async function(user) {
        console.log(user);
        const fullname = document.getElementById(user+'FullName').value;
        const age = document.getElementById(user+'Age').value;
        const selectedGender = document.querySelector("input[name='gender']:checked");
        const gender = (selectedGender) ? selectedGender.value : null;
        const medical_id = document.getElementById(user+'MedicalID').value;
        const blood_type = document.getElementById(user+'BloodType').value;
        let doctor_type=null;
        if(user=="Doctor")
        {
            doctor_type = document.getElementById(user+'Type').value;
        }
        
        let checkboxes = document.querySelectorAll("input[name='Organ']:checked");
        let organ = [];
        checkboxes.forEach((checkbox) => {
            organ.push(checkbox.value);
        });
        const weight = document.getElementById(user+'Weight').value;
        const height = document.getElementById(user+'Height').value;

        let checkedValues = false;
        checkedValues = checkInputValues(user, fullname, age, gender, medical_id, organ, weight, height);
        console.log("Values Checked");
        var warning = document.querySelector(".alert.warning");
        if (checkedValues) {
            let validate;
            if (user=="Donor") {
                validate = await this.contractInstance.methods.validateDonor(medical_id).call();
                console.log(validate);
            }
            else if (user=="Patient") {
                validate = await this.contractInstance.methods.validatePatient(medical_id).call();
                console.log(validate);
            }
            else if (user=="Doctor") {
                validate = await this.contractInstance2.methods.validateDoctor(medical_id).call();
                console.log(validate);
            }
            else if (user=="Transporter") {
                validate = await this.contractInstance2.methods.validateTransporter(medical_id).call();
                console.log(validate);
            }

            if (!validate) {        
                console.log(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                if (user=="Donor")
                    this.setDonor(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                else if (user=="Patient") 
                    this.setPatient(fullname, age, gender, medical_id, blood_type, organ, weight, height);
                else if(user=="Doctor")
                    this.setDoctor(fullname, age, gender, medical_id, blood_type, doctor_type, weight, height);
                else if(user=="Transporter")
                    this.setTransporter(fullname, age, gender, medical_id, blood_type, weight, height);    
                showWarning(user, "Registration Successful!", "#04AA6D");
                setTimeout(function(){
                    warning.style.opacity = "0";
                    setTimeout(function(){ warning.style.display = "none"; }, 1200);
                }, 5000);
            }
            else {
                showWarning(user, "Medical ID already exists!", "#f44336");
            }
        }
    },

    setDonor: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance.methods.setDonors(fullname, age, gender, medical_id, blood_type, organ, weight, height
        ).send({
            from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        })
    },

    setPatient: async function(fullname, age, gender, medical_id, blood_type, organ, weight, height) {
        const gas = await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance.methods.setPatients(fullname, age, gender, medical_id, blood_type, organ, weight, height).send({
            from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        });
    },

    setDoctor: async function(fullname, age, gender, medical_id, blood_type, doctor_type, weight, height) {
        const gas = await this.contractInstance2.methods.setDoctor(fullname, age, gender, medical_id, blood_type, doctor_type, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance2.methods.setDoctor(fullname, age, gender, medical_id, blood_type, doctor_type, weight, height).send({
            from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        });
    },

    setTransporter: async function(fullname, age, gender, medical_id, blood_type, weight, height) {
        const gas = await this.contractInstance2.methods.setTransporter(fullname, age, gender, medical_id, blood_type, weight, height).estimateGas({
            from: this.accounts[0]
        });
        await this.contractInstance2.methods.setTransporter(fullname, age, gender, medical_id, blood_type, weight, height).send({
            from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        });
    },

    assignTransporter: async function(assigned_id) {
        const gas=await this.contractInstance2.methods.assignTransporter(assigned_id).estimateGas({
            from: this.accounts[0]});
        
        await this.contractInstance2.methods.assignTransporter(assigned_id).send({
                from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        });
    },

    setStatus:async function(assigned_id,status) {
        const gas=await this.contractInstance2.methods.setStatus(assigned_id,status).estimateGas({
            from: this.accounts[0]});
        
        await this.contractInstance2.methods.setStatus(assigned_id,status).send({
                from: this.accounts[0], gas: Math.max(gas, MIN_GAS)
        });
    },

    search: async function(user) {
        console.log(user);
        const medical_id = document.getElementById("input"+user+"MedicalID").value;
        if (medical_id.length==0) {
            document.getElementById("search"+user+"Check").innerHTML = "Enter Medical ID";
            clearSearchValues(user);
        }

        else {
            let validate = false;
            if (user=="Donor"){
                validate = await this.contractInstance.methods.validateDonor(medical_id).call();
            }
            else if (user="Patient") {
                validate = await this.contractInstance.methods.validatePatient(medical_id).call();
            }
            console.log("Inside getDonor: "+validate);

            if (validate) {
                if (user=="Donor"){
                    await this.contractInstance.methods.getDonor(medical_id).call().then(function(result){
                        console.log(result);
                        document.getElementById("search"+user+"Check").innerHTML = null;
                        assignSearchValues(result, user);
                    });
                }
                else if (user="Patient"){
                    await this.contractInstance.methods.getPatient(medical_id).call().then(function(result){
                        console.log(result);
                        document.getElementById("search"+user+"Check").innerHTML = null;
                        assignSearchValues(result, user);
                    });
                }
            }
            else {
                document.getElementById("search"+user+"Check").innerHTML = "Medical ID does not exist!";
                clearSearchValues(user);
            }
        }
    },

    viewDonors: async function() {
        this.accounts = await web3.eth.getAccounts();
        this.contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
        const DonorCount = await this.contractInstance.methods.getCountOfDonors().call();
        const DonorIDs = await this.contractInstance.methods.getAllDonorIDs().call();
        let Donor;

        for (let i=0; i<DonorCount; i++) {
            await this.contractInstance.methods.getDonor(DonorIDs[i]).call().then(function(result) {
                console.log(result);
                Donor = [
                    { Index: i+1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": DonorIDs[i], "Blood Type": result[3], "Organ(s)": result[4], "Weight(kg)": result[5], "Height(cm)": result[6]},
                ];

                let data = Object.keys(Donor[0]);
                if (i==0)
                    generateTableHead(table, data);
                generateTable(table, Donor);
            });
        }
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
    },

    viewPatients: async function() {
        this.accounts = await web3.eth.getAccounts();
        this.contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
        const patientCount = await this.contractInstance.methods.getCountOfPatients().call();
        const patientIDs = await this.contractInstance.methods.getAllPatientIDs().call();
        let patient;

        for (let i=0; i<patientCount; i++) {
            await this.contractInstance.methods.getPatient(patientIDs[i]).call().then(function(result) {
                console.log(result);
                patient = [
                    { Index: i+1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": patientIDs[i], "Blood Type": result[3], "Organ(s)": result[4], "Weight(kg)": result[5], "Height(cm)": result[6]},
                ];

                let data = Object.keys(patient[0]);
                if (i==0)
                    generateTableHead(table, data);
                generateTable(table, patient);
            });
        }
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
    },

    viewDoctors: async function() {
        this.accounts = await web3.eth.getAccounts();
        this.contractInstance2 = new web3.eth.Contract(
            artifact2.abi,
            contractAddress2
        );
        const patientCount = await this.contractInstance2.methods.getCountOfDoctors().call();
        const patientIDs = await this.contractInstance2.methods.getAllDoctorIDs().call();
        let patient;

        for (let i=0; i<patientCount; i++) {
            await this.contractInstance2.methods.getDoctor(patientIDs[i]).call().then(function(result) {
                console.log(result);
                patient = [
                    { Index: i+1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": patientIDs[i], "Blood Type": result[3], "Doctor Type": result[4], "Weight(kg)": result[5], "Height(cm)": result[6]},
                ];

                let data = Object.keys(patient[0]);
                if (i==0)
                    generateTableHead(table, data);
                generateTable(table, patient);
            });
        }
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
    },

    viewTransporters: async function() {
        this.accounts = await web3.eth.getAccounts();
        this.contractInstance2 = new web3.eth.Contract(
            artifact2.abi,
            contractAddress2
        );
        const patientCount = await this.contractInstance2.methods.getCountOfTransporters().call();
        const patientIDs = await this.contractInstance2.methods.getAllTransporterIDs().call();
        let patient;

        for (let i=0; i<patientCount; i++) {
            await this.contractInstance2.methods.getTransporter(patientIDs[i]).call().then(function(result) {
                console.log(result);
                patient = [
                    { Index: i+1, "Full Name": result[0], Age: result[1], Gender: result[2], "Medical ID": patientIDs[i], "Blood Type": result[3], "Weight(kg)": result[4], "Height(cm)": result[5]},
                ];

                let data = Object.keys(patient[0]);
                if (i==0)
                    generateTableHead(table, data);
                generateTable(table, patient);
            });
        }
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
    },

    transplantMatch: async function(html) {
        this.accounts = await web3.eth.getAccounts();
        this.contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
        document.getElementById("transplantTable").innerHTML = null;
        var patientCount = await this.contractInstance.methods.getCountOfPatients().call();
        var donorCount = await this.contractInstance.methods.getCountOfDonors().call();
        var patientIDs = await this.contractInstance.methods.getAllPatientIDs().call();
        var donorIDs = [''];
        await this.contractInstance.methods.getAllDonorIDs().call().then(function(result){
            for (let i=0; i<donorCount; i++) {
                donorIDs[i] = result[i];
            }
        });

        let donor = [];
        for (let i=0; i<donorCount; i++) {
            await this.contractInstance.methods.getDonor(donorIDs[i]).call().then(function(result){
                let organsArr = [];
                let temp = result[4];
                for (let o=0; o<temp.length; o++) {
                    organsArr[o] = temp[o];
                }
                donorObj = { ID: donorIDs[i], name: result[0], bloodtype: result[3], organs: organsArr, organcount: organsArr.length };
                donor[i] = donorObj;
            });
        }
        console.log(donor);

        let match;
        console.log("Patient Count: " + patientCount);
        console.log("Donor Count: " + donorCount);

        let initialTableGeneration = true;

        for (var i=0; i<patientCount; i++) {
            var patientname;
            var patientbloodtype;            
            var patientorgans;
            await this.contractInstance.methods.getPatient(patientIDs[i]).call().then(function(result){
                patientname = result[0];
                patientbloodtype=result[3];
                patientorgans=result[4];
            });
            console.log("Checking patient: "+patientname);
            for (var poi=0; poi < patientorgans.length; poi++) {
                console.log("Checking patient organ: "+patientorgans[poi]);
                for (var j=0; j<donorCount; j++) {
                    let matchedOrgan = false;
                    console.log("Checking donor: "+donor[j].name);
                    console.log("Organ count: "+donor[j].organcount);
                    for (let doi=0; doi < donor[j].organcount; doi++) {
                        console.log("Checking donor organ: "+donor[j].organs[doi])
                        if (patientbloodtype==donor[j].bloodtype && patientorgans[poi]==donor[j].organs[doi]) {
                            matchedOrgan = true;
                            console.log("Matched: "+patientname+" "+patientorgans[poi]+"<->"+donor[j].name+" "+donor[j].organs[doi]);
                            match = [
                                { "Patient Name": patientname, "Patient Organ": patientorgans[poi], "Patient Medical ID": patientIDs[i],"": "↔️", "Donor Medical ID": donorIDs[j], "Donor Organ": donor[j].organs[doi], "Donor Name": donor[j].name},
                            ];
                            
                            if(html== "transplant-matching")
                            {
                                let data = Object.keys(match[0]);
                                data.push("Transporter");
                                if (initialTableGeneration){
                                    generateTableHead(table, data);
                                    initialTableGeneration = false;
                                }
                                generateTableForTransplantMatch(table, match);
                            }
                            else if(html=="transporterDelivery")
                            {
                                let data = Object.keys(match[0]);
                                data.push("Status");
                                if (initialTableGeneration){
                                    generateTableHead(table, data);
                                    initialTableGeneration = false;
                                }
                                generateTableForTransportDelivery(table, match);
                            }
                            else if(html=="track-status")
                            {
                                let data = Object.keys(match[0]);
                                data.push("Status");
                                if (initialTableGeneration){
                                    generateTableHead(table, data);
                                    initialTableGeneration = false;
                                }
                                generateTableForTrackStatus(table, match);
                            }
                            else if(html=="tansplantation")
                            {
                                let data = Object.keys(match[0]);
                                data.push("Status");
                                if (initialTableGeneration){
                                    generateTableHead(table, data);
                                    initialTableGeneration = false;
                                }
                                generateTableForTansplantation(table, match);
                            }
                            
                            
                            // Removing marked donor organ
                            donor[j].organs[doi] = donor[j].organs[donor[j].organcount-1];
                            donor[j].organs.pop();
                            donor[j].organcount--;
                            break;
                        }
                    }
                    if (donor[j].organcount == 0) {
                        donor[j] = donor[donorCount-1];
                        donorCount--;
                    }
                    if (matchedOrgan) {
                        break;
                    }
                }
            }
        }
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
    }

}

window.App = App;

window.addEventListener("load", function() {
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );

  App.start();
});