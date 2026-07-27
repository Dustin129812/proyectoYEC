import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { Career, PersonalData } from '../../enrollment-application.state';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { validatePersonalData } from '../../validators/personal-data-form.validation';
import { Checkbox } from "primeng/checkbox";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { LabelDirective } from "@utils/directives/label.directive";
import { ErrorMessageDirective } from "@utils/directives/error-message.directive";
import { Select } from "primeng/select";
import { DatePickerModule } from 'primeng/datepicker';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';
import { CareerService } from '@modules/admin/work-flows/career/career.service';
const FORM_STATE_KEY = "personalData"

@Component({
    selector: 'app-personal-data-form',
    imports: [FormField, Checkbox, DatePickerModule, InputText, FloatLabelModule, MessageModule, AccordionModule, LabelDirective, ErrorMessageDirective, Select],
    templateUrl: './personal-data-form.html',
})
export class PersonalDataForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    protected readonly catalogueService = inject(CatalogueService);
    protected readonly careerService = inject(CareerService);


    protected readonly form$: WritableSignal<PersonalData> = signal(this.enrollmentApplicationStore.personalData())

    protected readonly formData: FieldTree<PersonalData> = this.buildForm();
    //tambien signals todas las opciones
    protected workingHourstype: WritableSignal<CatalogueInterface[]> = signal([]);
    protected monthlySalarys: WritableSignal<CatalogueInterface[]> = signal([]);
    protected foreignLanguageNames: WritableSignal<CatalogueInterface[]> = signal([]);
    protected ancestralLanguageNames: WritableSignal<CatalogueInterface[]> = signal([]);
    protected indigenousNationalitys: WritableSignal<CatalogueInterface[]> = signal([]);
    protected towns: WritableSignal<CatalogueInterface[]> = signal([]);
    protected disabilityTypes: WritableSignal<CatalogueInterface[]> = signal([]);
    protected contactEmergencyKinships: WritableSignal<CatalogueInterface[]> = signal([]);
    protected careers: WritableSignal<Career[]> = signal([]);
    protected semesters: WritableSignal<CatalogueInterface[]> = signal([])

    constructor() {
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        });
        effect(() => {
            if (!this.formData.isDisability().value()) {
                this.formData.disabilityType().reset(null);
                this.formData.disabilityPercentage().reset("");
            }
        });
        effect(() => {
            if (!this.formData.isAncestralLanguage().value()) {
                this.formData.ancestralLanguageName().reset(null);
            }
        });
        effect(() => {
            if (!this.formData.isCatastrophicIllness().value()) {
                this.formData.catastrophicIllness().reset("");
            }
        })
        effect(() => {
            if (!this.formData.isForeignLanguage().value()) {
                this.formData.foreignLanguageName().reset(null);
            }
        });
        effect(() => {
            if (!this.formData.isHasChildren().value()) {
                this.formData.childrenTotal().reset("");
            }
        });
        effect(() => {
            if (!this.formData.isWork().value()) {
                this.formData.monthlySalary().reset(null);
                this.formData.workAddress().reset("");
                this.formData.workingHours().reset(null);
                this.formData.workPosition().reset("");
            }
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Personales',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.loadAllCatalogues()
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private buildForm(): FieldTree<PersonalData> {
        return form(this.form$, (schema) => {
            validatePersonalData(schema);
        });
    }

    private async loadAllCatalogues(): Promise<void> {
        this.workingHourstype.set(
            await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_working_hours_type)
        );
        this.monthlySalarys.set(
            await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_monthly_salary)
        );
        this.foreignLanguageNames.set(
            await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_foreign_language_name)
        );
        this.ancestralLanguageNames.set(
            await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_ancestral_language_name)
        );
        this.indigenousNationalitys.set(
            await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_indigenous_nationality)
        );
        this.towns.set(
            await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_town)
        );
        this.disabilityTypes.set(
            await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_disability_type)
        );
        this.contactEmergencyKinships.set(
            await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_contact_emergency_kinship)
        );
        this.semesters.set(
            this.catalogueService.findByType(CatalogueTypeEnum.users_academic_period)
        );
        //la carrera viene de catalogo
        this.careers.set([
            { name: 'Desarrollo de Software', id: '1' },
            { name: 'Redes y Telecomunicaciones', id: '2' },
            { name: 'Diseño Gráfico', id: '3' },
            { name: 'Marketing Digital', id: '4' }
        ])
    }

}
