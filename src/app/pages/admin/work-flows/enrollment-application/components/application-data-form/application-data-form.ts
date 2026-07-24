import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ApplicationData, Career } from '../../enrollment-application.state';
import { validateApplicationData } from '../../validators/application-data-form.validation';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { TableModule } from "primeng/table";
import { Select } from "primeng/select";
import { LabelDirective } from "@utils/directives/label.directive";
import { CustomIcons } from '@utils/icons/custom-icons';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';

const FORM_STATE_KEY = "application"

@Component({
    selector: 'app-application-data-form',
    imports: [TableModule, Select, LabelDirective, FormField],
    templateUrl: './application-data-form.html',
})
export class ApplicationDataForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    protected readonly catalogueService = inject(CatalogueService);

    protected readonly CustomIcons = CustomIcons;


    protected academicPeriods: WritableSignal<CatalogueInterface[]> = signal([]);
    protected careers: WritableSignal<Career[]> = signal([]);
    protected schoolPeriods: WritableSignal<CatalogueInterface[]> = signal([]);
    protected items: WritableSignal<CatalogueInterface[]> = signal([]);
    protected selectedItems = signal<any[] | null>(null);
    protected careerParallels: {
        academicPeriodId: string;
        workday: { id: string, name: string };
        parallel: { id: string, name: string };
    }[] = [];
    //todas las variables protected o private

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
        this.loadAllCatalogues()
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
    private loadAllCatalogues(): void {
        this.academicPeriods.set(
            this.catalogueService.findByType(CatalogueTypeEnum.users_academic_period)
        );
        this.careers.set([
            { name: 'Desarrollo de Software', id: '1' },
            { name: 'Redes y Telecomunicaciones', id: '2' },
            { name: 'Diseño Gráfico', id: '3' },
            { name: 'Marketing Digital', id: '4' }
        ])
        this.schoolPeriods.set(
            this.catalogueService.findByType(CatalogueTypeEnum.users_school_period)
        );
        this.items.set(
            this.catalogueService.findByType(CatalogueTypeEnum.users_subject)
        );
    }

}
