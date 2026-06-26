import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ApplicationData } from '../../work-flow/enrollment-application.state';
import { validateApplicationData } from '../../validators/validate-application-data';
import { FieldTree, form } from '@angular/forms/signals';
import { PrimeIcons } from 'primeng/api';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../work-flow/enrollment-application.store';
import { TableModule } from "primeng/table";
import { Select } from "primeng/select";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationDataGetters } from '../application/application-getters';
import { LabelDirective } from "@utils/directives/label.directive";

const FORM_STATE_KEY = "application"

@Component({
    selector: 'app-application-selec-form',
    imports: [TableModule, Select, FormsModule, ReactiveFormsModule, LabelDirective],
    templateUrl: './application-selec-form.html',
    styleUrl: './application-selec-form.scss'
})
export class ApplicationSelecForm extends ApplicationDataGetters {
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    private readonly formRegistryService = inject(FormRegistryService);

    PrimeIcons = PrimeIcons;


    academicPeriods: any[] = [];
    careers: any[] = [];
    curriculums: any[] = [];

    careerParallels: {
        academicPeriodId: number;
        workday: { id: string, name: string };
        parallel: { id: string, name: string };
    }[] = [];


    selectedCurriculum = signal<any>(null);

    protected form$: WritableSignal<ApplicationData> = signal(this.enrollmentApplicationStore.application());

    protected formData: FieldTree<ApplicationData> = this.buildForm;

    constructor() {
        super();
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        });
        effect(() => {
            const academicPeriod = this.academicPeriod().value();
            if (!academicPeriod) return;
            this.formData.workday().reset();
            this.formData.parallel().reset();
        });

        effect(() => {
            const workday = this.workday().value();
            if (!workday) return;
            this.formData.parallel().reset();
        });
    }
    get buildForm() {
        return form(this.form$, (schema) => {
            validateApplicationData(schema);
        });
    }

    protected workdays = computed(() => {
        const academicPeriod = this.academicPeriod().value();
        if (!academicPeriod) return [];

        const unique = new Map<string, { name: string; id: string }>();

        this.careerParallels.forEach(cp => {
            if (cp.academicPeriodId === Number(academicPeriod.id)) {
                unique.set(cp.workday.id, {
                    name: cp.workday.name,
                    id: cp.workday.id
                });
            }
        });

        return Array.from(unique.values());
    });

    protected parallels = computed(() => {
        const academicPeriod = this.academicPeriod().value();
        const workday = this.workday().value();
        console.log('school: ', this.formData.schoolPeriod().value())
        if (!academicPeriod || !workday) return [];

        return this.careerParallels
            .filter(cp =>
                cp.academicPeriodId === Number(academicPeriod.id) &&
                cp.workday.id === workday.id
            )
            .map(cp => ({
                name: cp.parallel.name,
                id: cp.parallel.id
            }));
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
                academicPeriodId: 1,
                workday: { id: 'MAT', name: 'Matutina' },
                parallel: { id: 'A', name: 'Paralelo A' }
            },
            {
                academicPeriodId: 1,
                workday: { id: 'MAT', name: 'Matutina' },
                parallel: { id: 'B', name: 'Paralelo B' }
            },
            {
                academicPeriodId: 1,
                workday: { id: 'NOC', name: 'Nocturna' },
                parallel: { id: 'A', name: 'Paralelo A' }
            },
            {
                academicPeriodId: 2,
                workday: { id: 'VES', name: 'Vespertina' },
                parallel: { id: 'A', name: 'Paralelo A' }
            },
            {
                academicPeriodId: 2,
                workday: { id: 'VES', name: 'Vespertina' },
                parallel: { id: 'B', name: 'Paralelo B' }
            }
        ];
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister('application');
    }


    onCurriculumChange(curriculum: any) {
        this.selectedCurriculum.set(curriculum);
        this.loadCareerParallels();
    }

    loadCareerParallels(): void {
        // peticion para traer las carrerpararllels dependiendo la malla
        return;
    }


    previous() {
        this.enrollmentApplicationStore.setStep(1);
    }

    onSubmit() {
        if (!this.formData().valid()) {
            this.enrollmentApplicationStore.setStep(3)
        } else {
            console.log(this.formData().errors());
        }
    }
}
