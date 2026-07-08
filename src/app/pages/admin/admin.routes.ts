import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {
    CareerListComponent
} from "@modules/admin/work-flows/career-registration/components/career-list/career-list.component";
import {CareerComponent} from "@modules/admin/work-flows/career-registration/components/career/career.component";
import { EnrollmentApplication } from './work-flows/enrollment-application/enrollment-application';

export default [
    {
        path: MY_ROUTES.adminPages.user.base,
        title: 'Listado de Usuarios',
        loadComponent: () => CareerListComponent
    },
    {
        path: MY_ROUTES.adminPages.user.form.base,
        title: 'Listado de Usuarios',
        loadComponent: () => CareerComponent
    },
    {
        path: MY_ROUTES.adminPages.enrollment.application.base,
        title: 'Solicitud de Matrícula',
        loadComponent: () => EnrollmentApplication
    },
] as Routes;
