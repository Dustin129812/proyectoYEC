import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ApplicationData } from '../../enrollment-application.state';
import { validateApplicationData } from '../../validators/application-data-form.validation';
import { FieldTree, form } from '@angular/forms/signals';
import { PrimeIcons } from 'primeng/api';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { TableModule } from "primeng/table";
import { Select } from "primeng/select";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationDataGetters } from './application-getters';
import { LabelDirective } from "@utils/directives/label.directive";
import { InputText } from 'primeng/inputtext';

const FORM_STATE_KEY = "application"

@Component({
    selector: 'app-application-data-form',
    imports: [TableModule, Select, FormsModule, ReactiveFormsModule, LabelDirective, InputText],
    templateUrl: './application-data-form.html',
})
export class ApplicationDataForm extends ApplicationDataGetters {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);

    PrimeIcons = PrimeIcons;


    protected academicPeriods: any[] = [];
    protected careers: any[] = [];
    protected curriculums: any[] = [];
    protected subjects: any[] = [];
    protected selectedItems = signal<any[] | null>(null);
    protected careerParallels: {
        academicPeriodId: string;
        workday: { id: string, name: string };
        parallel: { id: string, name: string };
    }[] = [];
    //todas las variables protected o privade

    protected selectedCurriculum = signal<any>(null);

    protected form$: WritableSignal<ApplicationData> = signal(this.enrollmentApplicationStore.application());

    protected formData: FieldTree<ApplicationData> = this.buildForm;
    //los getter gregar sufijo Field para el nombre del metodo ej:careerField
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
        effect(() => {
            if (this.enrollmentDetailsField().value()?.length === 0) {
                this.form$.update(form => ({
                    ...form,
                    enrollmentDetails: null
                }));

            }
        })
        effect(() => {
            const academicPeriod = this.academicPeriodField().value();
            if (!academicPeriod) return;
            this.formData.workday().reset();
            this.formData.parallel().reset();
        });

        effect(() => {
            const workday = this.workdayField().value();
            if (!workday) return;
            this.formData.parallel().reset();
        });
    }
    get buildForm() {
        return form(this.form$, (schema) => validateApplicationData(schema));
    }

    protected workdays = computed(() => {
        const academicPeriod = this.academicPeriodField().value();
        if (!academicPeriod) return [];
        //puede cambiar de donde se obtiene
        //todos los id son string
        return this.careerParallels.filter(careerParallel => careerParallel.academicPeriodId === academicPeriod.id)
            .map(careerParallel => careerParallel.workday);
    });

    protected parallels = computed(() => {
        const academicPeriod = this.academicPeriodField().value();
        const workday = this.workdayField().value();
        if (!academicPeriod || !workday) return [];

        return this.careerParallels
            .filter(cp =>
                cp.academicPeriodId === academicPeriod.id &&
                cp.workday.id === workday.id
            )
            .map(cp => cp.parallel);
    });

    ngOnInit(): void {
        this.formRegistryService.register(
            'Solicitud de Matricula',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        //student por defecto logueado
        //cargar los datos reales desde los servicios
        const data = this.enrollmentApplicationStore.application();
        this.selectedItems.set(data.enrollmentDetails?.length ? [...data.enrollmentDetails] : null);

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
        this.academicPeriods = [
            { name: '2025-A', id: '1' },
            { name: '2025-B', id: '2' },
            { name: '2026-A', id: '3' }
        ];

        this.careers = [
            { name: 'Desarrollo de Software', id: '1' },
            { name: 'Redes y Telecomunicaciones', id: '2' },
            { name: 'Diseño Gráfico', id: '3' },
            { name: 'Marketing Digital', id: '4' }
        ];

        this.curriculums = [
            { name: 'Malla 2023', id: '1' },
            { name: 'Malla 2024', id: '2' },
            { name: 'Malla 2025', id: '3' }
        ];

        this.careerParallels = [
            {
                academicPeriodId: '1',
                workday: { id: 'MAT', name: 'Matutina' },
                parallel: { id: 'A', name: 'Paralelo A' }
            },
            {
                academicPeriodId: '1',
                workday: { id: 'MAT', name: 'Matutina' },
                parallel: { id: 'B', name: 'Paralelo B' }
            },
            {
                academicPeriodId: '1',
                workday: { id: 'NOC', name: 'Nocturna' },
                parallel: { id: 'A', name: 'Paralelo A' }
            },
            {
                academicPeriodId: '2',
                workday: { id: 'VES', name: 'Vespertina' },
                parallel: { id: 'A', name: 'Paralelo A' }
            },
            {
                academicPeriodId: '2',
                workday: { id: 'VES', name: 'Vespertina' },
                parallel: { id: 'B', name: 'Paralelo B' }
            }
        ];
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister('application');
    }


    onCurriculumChange(curriculum: any) {
        // se llamaria desde careers desaparece curriculum
        this.selectedCurriculum.set(curriculum);
        this.loadCareerParallels();
    }

    loadCareerParallels(): void {
        // peticion para traer las carrerpararllels dependiendo la carrer
        return;
    }

    onSelectionChange(selected: any[]) {
        this.selectedItems.set(selected);
    }

    previous() {
        this.enrollmentApplicationStore.setStep(1);
    }

}
