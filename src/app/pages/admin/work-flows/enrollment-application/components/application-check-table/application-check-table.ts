import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { EnrollmentAplicationStore } from '../../work-flow/enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { ApplicationData } from '../../work-flow/enrollment-application.state';
import { FieldTree, form } from '@angular/forms/signals';
import { ApplicationDataGetters } from '../application/application-getters';
import { validateApplicationData } from '../../validators/validate-application-data';
import { TableModule } from "primeng/table";
import { PrimeIcons } from 'primeng/api';
const FORM_STATE_KEY = "application"
@Component({
    selector: 'app-application-check-table',
    imports: [TableModule],
    templateUrl: './application-check-table.html',
    styleUrl: './application-check-table.scss'
})
export class ApplicationCheckTable extends ApplicationDataGetters {
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    private readonly formRegistryService = inject(FormRegistryService);

    PrimeIcons = PrimeIcons
        ;
    subjects: any[] = [];
    columns: any[] = [
        { field: 'code', header: 'Código' },
        { field: 'name', header: 'Asignatura' }
    ];
    selectedItems = signal<any[]>([]);
    selectedCurriculum = signal<any>(null);

    protected form$: WritableSignal<ApplicationData> = signal(this.enrollmentApplicationStore.application());

    protected formData: FieldTree<ApplicationData> = this.buildForm;

    constructor() {
        super();
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        });
        effect(() => {
            this.form$.update(form => ({
                ...form,
                enrollmentDetails: this.selectedItems()
            }));
        });
    }
    get buildForm() {
        return form(this.form$, (schema) => {
            validateApplicationData(schema);
        });
    }
    ngOnInit(): void {
        this.formRegistryService.register(
            'Solicitud de Matricula',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
        const data = this.enrollmentApplicationStore.application();
        this.selectedItems.set([...(data.enrollmentDetails || [])])

        this.subjects = [
            {
                id: '1',
                code: 'DSW101',
                name: 'Programación I'
            },
            {
                id: '2',
                code: 'DSW102',
                name: 'Base de Datos I'
            },
            {
                id: '3',
                code: 'DSW103',
                name: 'Programación Web'
            },
            {
                id: '4',
                code: 'DSW104',
                name: 'Arquitectura de Software'
            },
            {
                id: '5',
                code: 'DSW105',
                name: 'Estructura de Datos'
            },
            {
                id: '6',
                code: 'DSW106',
                name: 'Ingeniería de Software'
            },
            {
                id: '7',
                code: 'DSW107',
                name: 'Desarrollo Móvil'
            }
        ];
    }
    onSelectionChange(selected: any[]) {
        this.selectedItems.set(selected);
        console.log(this.form$().enrollmentDetails);
        console.log(this.enrollmentApplicationStore.application().enrollmentDetails);
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister('application');
    }

}
