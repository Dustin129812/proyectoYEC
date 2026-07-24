import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {
    CareerListComponent
} from "@modules/admin/work-flows/career/components/career-list/career-list.component";
import {CareerFormComponent} from "@modules/admin/work-flows/career/components/career-form/career-form.component";
import { EnrollmentApplication } from './work-flows/enrollment-application/enrollment-application';

export default [
    {
        path: MY_ROUTES.adminPages.user.base,
        title: 'Listado de Carreras',
        loadComponent: () => CareerListComponent
    },
    {
        path: MY_ROUTES.adminPages.user.form.base + '/:id',
        title: 'Formulario de Carrera',
        loadComponent: () => CareerFormComponent
    },
    {
        path: MY_ROUTES.adminPages.enrollment.application.base,
        title: 'Solicitud de Matrícula',
        loadComponent: () => EnrollmentApplication
    },
] as Routes;
