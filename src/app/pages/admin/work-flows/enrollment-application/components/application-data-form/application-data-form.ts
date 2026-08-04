import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ApplicationData, AvailableSubjectResponse, AvailableSubjectsResponse, SchoolPeriodInterface } from '../../enrollment-application.state';
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
import { EnrollmentsService } from '../../services/enrollments.service';
import { CareerService } from '@modules/admin/work-flows/career/career.service';
import { AuthService } from '@modules/auth/auth.service';
import { CareerInterface } from '@modules/admin/work-flows/career/career.state';
import { SchoolPeriodsService } from '../../services/school-period.service';

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
    protected readonly careerService = inject(CareerService);
    private readonly enrollmentService = inject(EnrollmentsService);
    private readonly schoolPeriodsService = inject(SchoolPeriodsService)
    private readonly authService = inject(AuthService)


    protected readonly CustomIcons = CustomIcons;
    protected loading = signal(false)

    //todas las variables protected o private

    protected academicPeriods: WritableSignal<CatalogueInterface[]> = signal([]);
    protected schoolPeriods: WritableSignal<SchoolPeriodInterface[]> = signal([]);
    protected workdays: WritableSignal<CatalogueInterface[]> = signal([]);
    protected parallels: WritableSignal<CatalogueInterface[]> = signal([]);

    // TODO: institutionId - Determinar de dónde se debe obtener para inyectarlo en la consulta de carreras (si el backend lo requiere)
    protected careers: WritableSignal<CareerInterface[]> = signal([]);

    protected items: WritableSignal<AvailableSubjectResponse[]> = signal([]);
    protected selectedItems = signal<any[] | null>(null);


    protected form$: WritableSignal<ApplicationData> = signal(this.enrollmentApplicationStore.application());
    protected formData: FieldTree<ApplicationData> = this.buildForm();

    constructor() {
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        });
        effect(() => {
            this.form$.update(form => ({
                ...form,
                enrollmentDetails: this.selectedItems()?.length ? this.selectedItems() : null
            }));

        });
        //Reseteo en cascada si cambia algo arriba
        effect(() => {
            const academicPeriod = this.formData.academicPeriod().value();
            if (!academicPeriod) return;
            this.formData.workday().reset(null);
            this.formData.parallel().reset(null);
            this.selectedItems.set([])
        });

        //Buscar materias cuando los 5 filtros tengan valor
        effect(() => {
            const career = this.formData.career().value();
            const schoolPeriod = this.formData.schoolPeriod().value();
            const academicPeriod = this.formData.academicPeriod().value();
            const workday = this.formData.workday().value();
            const parallel = this.formData.parallel().value();
            console.log('student: ', this.formData.student().value())

            if (career && schoolPeriod?.id && academicPeriod?.id && workday?.id && parallel?.id) {
                this.loadSubjectsForEnrollment(
                    career.id,
                    schoolPeriod.id,
                    academicPeriod.id,
                    workday.id,
                    parallel.id
                );//scool period traaer de la tabla school period
                // this.loadSubjectsForEnrollment(
                //     career.id,
                //     '68f67684-71b1-4df6-ad61-d2214dacc05e',
                //     academicPeriod.id,
                //     workday.id,
                //     parallel.id
                // );
            } else {
                this.items.set([]);
            }
        });
    }
    private buildForm(): FieldTree<ApplicationData> {
        return form(this.form$, (schema) => validateApplicationData(schema));
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Solicitud de Matricula',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
        this.formData.student().reset(this.enrollmentApplicationStore.student);
        //student por defecto logueado
        //cargar los datos reales desde los servicios
        const data = this.enrollmentApplicationStore.application();
        this.selectedItems.set(data.enrollmentDetails?.length ? [...data.enrollmentDetails] : null);

        this.loadAllCatalogues();
        this.fetchSchoolPeriods();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister('application');
    }

    onSelectionChange(selected: any[]) {
        this.selectedItems.set(selected);
    }

    previous() {
        this.enrollmentApplicationStore.setStep(1);
    }

    private loadAllCatalogues() {
        this.loading.set(true)
        try {
            this.academicPeriods.set(this.catalogueService.findByType(CatalogueTypeEnum.users_academic_period));
            this.workdays.set(this.catalogueService.findByType(CatalogueTypeEnum.users_workdays));
            this.parallels.set(this.catalogueService.findByType(CatalogueTypeEnum.users_parallel));

            // TODO: institutionId - Cuando se conecte al servicio real, inyectar el institutionId si es necesario.
            this.careerService.findCareers(1, '').subscribe({
                next: (response) => {
                    console.log('career: ', response)
                    this.careers.set(response.data);
                }
            });

        } catch (error) {
        } finally {
            this.loading.set(false)
        }

    }

    private async fetchSchoolPeriods() {
        this.schoolPeriodsService.findOpen().subscribe((response => {
            this.schoolPeriods.set([response.data]);
            console.log('response.data', JSON.stringify(response.data, null, 2));
            console.log('name', response.data.name);
            console.log('id', response.data.id);
            console.log('signal school', this.schoolPeriods());
            console.log('fetch school', response)
        }))
    }

    private async loadSubjectsForEnrollment(careerId: string, schoolPeriodId: string, academicPeriodId: string, workdayId: string, parallelId: string): Promise<void> {
        // TODO: institutionId - Revisar si el backend requerirá el institutionId aquí también para mayor seguridad

        const payload = {
            careerId,
            schoolPeriodId,
            academicPeriodId,
            workdayId,
            parallelId
        };

        this.enrollmentService.getAvailableSubjects(payload).subscribe({
            next: ({ data }) => { this.items.set(data); console.log('respuesta: ', data); },
            error: (error) => {
                console.error(error);
                this.items.set([]);
            },
        });

        // Mock temporal para que no se rompa la vista mientras se armama el backend
        // this.items.set([
        //     { code: 'DS-101', name: 'Programación Orientada a Objetos', id: '1' },
        //     { code: 'DS-102', name: 'Bases de Datos', id: '2' }
        // ]);
    }

}
