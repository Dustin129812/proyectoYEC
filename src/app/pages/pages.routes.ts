import {Routes} from '@angular/router';
import {MY_ROUTES} from "@routes";
import {OriginPlace} from "../pages/admin/components/student/enrollment-application/origin-place/origin-place"

export default [
    {
        path: MY_ROUTES.adminPages.user.base,
        title: 'Users',
        loadChildren: () => import('@/pages/admin/admin.routes')
    },
    
    {path: '**', redirectTo: '/notfound'}
] as Routes;
