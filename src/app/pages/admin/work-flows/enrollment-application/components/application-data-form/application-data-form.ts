import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ApplicationData, CatalogInterface } from '../../enrollment-application.state';
import { validateApplicationData } from '../../validators/application-data-form.validation';
import { FieldTree, form } from '@angular/forms/signals';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { TableModule } from "primeng/table";
import { Select } from "primeng/select";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelDirective } from "@utils/directives/label.directive";
import { CustomIcons } from '@utils/icons/custom-icons';

const FORM_STATE_KEY = "application"

@Component({
    selector: 'app-application-data-form',
    imports: [TableModule, Select, FormsModule, ReactiveFormsModule, LabelDirective],
    templateUrl: './application-data-form.html',
})
export class ApplicationDataForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);

    protected readonly CustomIcons = CustomIcons;


    protected academicPeriods: WritableSignal<CatalogInterface[]> = signal([]);
    protected careers: WritableSignal<CatalogInterface[]> = signal([]);
    protected curriculums: WritableSignal<CatalogInterface[]> = signal([]);
    protected items: WritableSignal<CatalogInterface[]> = signal([]);
    protected selectedItems = signal<any[] | null>(null);
    protected careerParallels: {
        academicPeriodId: string;
        workday: { id: string, name: string };
        parallel: { id: string, name: string };
    }[] = [];
    //todas las variables protected o privade

    protected selectedCurriculum = signal<any>(null);

    protected form$: WritableSignal<ApplicationData> = signal(this.enrollmentApplicationStore.application());

    protected formData: FieldTree<ApplicationData> = this.buildForm();
    //los getter gregar sufijo Field para el nombre del metodo ej:careerField
    constructor() {
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
            if (this.formData.enrollmentDetails().value()?.length === 0) {
                this.form$.update(form => ({
                    ...form,
                    enrollmentDetails: null
                }));

            }
        })
        effect(() => {
            const academicPeriod = this.formData.academicPeriod().value();
            if (!academicPeriod) return;
            this.formData.workday().reset();
            this.formData.parallel().reset();
        });

        effect(() => {
            const workday = this.formData.workday().value();
            if (!workday) return;
            this.formData.parallel().reset();
        });
    }
    private buildForm(): FieldTree<ApplicationData> {
        return form(this.form$, (schema) => validateApplicationData(schema));
    }

    protected workdays = computed(() => {
        const academicPeriod = this.formData.academicPeriod().value();
        if (!academicPeriod) return [];
        //puede cambiar de donde se obtiene
        //todos los id son string
        return this.careerParallels.filter(careerParallel => careerParallel.academicPeriodId === academicPeriod.id)
            .map(careerParallel => careerParallel.workday);
    });

    protected parallels = computed(() => {
        const academicPeriod = this.formData.academicPeriod().value();
        const workday = this.formData.workday().value();
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
        this.academicPeriods.set([
            { id: '1', parentId: '', code: 'PER-2026-1', name: 'Primer Periodo Académico 2026', required: true, sort: 1, type: 'ACADEMIC_PERIOD', isVisible: true },
            { id: '2', parentId: '', code: 'PER-2026-2', name: 'Segundo Periodo Académico 2026', required: true, sort: 2, type: 'ACADEMIC_PERIOD', isVisible: true }
        ]);

        this.careers.set([
            { id: 'c1', parentId: '', code: 'SFW', name: 'Ingeniería en Software', required: true, sort: 1, type: 'CAREER', isVisible: true },
            { id: 'c2', parentId: '', code: 'IND', name: 'Ingeniería Industrial', required: true, sort: 2, type: 'CAREER', isVisible: true },
            { id: 'c3', parentId: '', code: 'ADM', name: 'Administración de Empresas', required: true, sort: 3, type: 'CAREER', isVisible: true }
        ]);

        this.curriculums.set([
            { id: 'm1', parentId: 'c1', code: 'M-SFW-2022', name: 'Malla Rediseño Software 2022', required: true, sort: 1, type: 'CURRICULUM', isVisible: true },
            { id: 'm2', parentId: 'c2', code: 'M-IND-2020', name: 'Malla Ajuste Industrial 2020', required: true, sort: 2, type: 'CURRICULUM', isVisible: true }
        ]);

        this.items.set([
            { id: 's1', parentId: 'm1', code: 'PROG-I', name: 'Programación Orientada a Objetos', required: true, sort: 1, type: 'SUBJECT', isVisible: true },
            { id: 's2', parentId: 'm1', code: 'BD-I', name: 'Bases de Datos Relacionales', required: true, sort: 2, type: 'SUBJECT', isVisible: true },
            { id: 's3', parentId: 'm2', code: 'IND-PROC', name: 'Gestión de Procesos', required: true, sort: 3, type: 'SUBJECT', isVisible: true }
        ]);

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
