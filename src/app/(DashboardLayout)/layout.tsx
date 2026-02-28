import { getCurrentUser } from '@/services/auth';

import React from 'react';

 export const dynamic = "force-dynamic";

const DashboardLayout =async ({admin,provider,customer}:{admin:React.ReactNode;provider:React.ReactNode,customer:React.ReactNode}) => {
    const user = await getCurrentUser();

    const Roles = user?.role;
    return (
        <div>
           {Roles=== "CUSTOMER" && customer}
           {Roles=== "PROVIDER" && provider}
           {Roles=== "ADMIN" && admin}
        </div>
    );
};

export default DashboardLayout;