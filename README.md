# OrganDonationTransplantation
To run this code you need to have Ganache, truffle, node js of version v16
Open Ganache first and go to new workspace and add truffle-config.js in the truffle projects section
Deploy the smart contract by running truffle migrate and truffle compile in the terminal or command prompt
once the smart contracts are deployed go the app folder and run "npm run dev" command in the terminal
The application runs at "http://localhost:8080/" port
First open the "http://localhost:8080/admin.html" and register the doctor (both donor surgeon and transplant surgeon). Also register the transporter in the admin page.
Now go to "http://localhost:8080/". Here you can see the dashboard
Now register patient and donor
Go to the transplant match page and assign the transporter
once the transporter is assigned, go to the transporter page and set the status
After setting the status, you can able to see the status in track status page.
After coming to the delivery completed status in the transporter page, you can go the transplantation page and set the status
After setting the status, come to the track status page where you can see the status is updated.
