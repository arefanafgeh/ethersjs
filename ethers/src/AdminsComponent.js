
import { useEffect, useState ,useRef} from "react";

function AdminsComponent({contract,singercontract}){


    const [adminCount , setAdminCount] = useState(null);
    const [admins , setAdmins] = useState(null);
    const inputRef = useRef(null);

    const fetchAdmins = async function () {
        let tempadmins = await contract.lastVotingAdminId();
        setAdminCount(tempadmins);
    };

    useEffect(()=>{
          
        singercontract.on(contract.filters.NewAdminAdded, async (admin, event) => {
            await fetchAdmins();
          });

          fetchAdmins();

    },[]);

    const fetchAdminsOneByOne = async function(adminCount){
        let adminsArr = [];
        for(let i=1;i<=parseInt(adminCount);i++){
            let adminData = await contract.votingAdmins(i);
            let parsedAdmin = {
                address: adminData[0], // Convert BigNumber to Number
                enabled: adminData[1],
                added: adminData[2],
              };
              adminsArr[i] = parsedAdmin;
        }
        setAdmins(adminsArr);
        // let historicevents = contract.filters.NewAdminAdded;
        // let events = await singercontract.queryFilter(historicevents, -100)
        // console.log(events);
    }
    useEffect(()=>{
        if(adminCount==null)
            return;
        
        fetchAdminsOneByOne(adminCount);
        

    },[adminCount]);

    const addNewVotingAdmin = async function (){
        try{
            let tx = await singercontract.addVotingAdmin(inputRef.current.value);
            await tx.wait();
            console.log("Transaction sent:", tx);
        } catch (error) {
        console.error("Error sending transaction:", error);
      }
    }

    return(

        <div id="admins">
            <h2>Admins</h2>
            <hr/>
            {admins && admins.map((admin) => (
            <li key={admin.id}>
                <strong>address:</strong> {admin.address} | <strong>enabled:</strong> {admin.enabled?1:0} | <strong>added:</strong> {admin.added?1:0}
            </li>
            ))}
            <input type="text" ref={inputRef} placeholder="new admin address"/>
            <button onClick={async ()=>{await addNewVotingAdmin()}}>Add new Admin</button>
        </div>
    );

};

export default AdminsComponent;