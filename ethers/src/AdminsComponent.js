
import { useEffect, useState ,useRef} from "react";

function AdminsComponent({contract}){

    const [admins , setAdmins] = useState(null);
    const adminsRef = useRef(admins);

    useEffect(()=>async function(){
        console.log("dsfdsfsdf:"+adminsRef.admins);
    },[admins]);
    useEffect(()=>async function(){
        let tempadmins =null;
        tempadmins =  await contract.lastVotingAdminId();
        setAdmins(tempadmins);
        console.log(admins);
    },[]);



    return(

        <div id="admins">
            <h2>Admins</h2>
            <hr/>

        </div>
    );

};

export default AdminsComponent;