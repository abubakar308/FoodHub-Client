import { userService } from '@/services/user.service';
import React from 'react';


 export const dynamic = "force-dynamic";


const DashboardLayout =async ({admin,provider,customer}:{admin:React.ReactNode;provider:React.ReactNode,customer:React.ReactNode}) => {
    const user = await userService.getUser();
    console.log(user.data.role)
    const Roles = user.data.role;
    return (
        <div>
           {Roles==="CUSTOMER"&& customer}
           {Roles==="PROVIDER"&& provider}
           {Roles==="ADMIN"&& admin}
        </div>
    );
};

export default DashboardLayout;