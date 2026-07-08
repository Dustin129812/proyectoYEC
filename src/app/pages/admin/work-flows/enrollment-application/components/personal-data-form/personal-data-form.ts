import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { Career, CatalogInterface, PersonalData, Semester } from '../../enrollment-application.state';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
const FORM_STATE_KEY = "personalData"

@Component({
    selector: 'app-personal-data-form',
    imports: [FormField, Checkbox, DatePickerModule, InputText, FloatLabelModule, MessageModule, AccordionModule, LabelDirective, ErrorMessageDirective, Select, FormsModule, ReactiveFormsModule],
    templateUrl: './personal-data-form.html',
})
export class PersonalDataForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);


    protected readonly form$: WritableSignal<PersonalData> = signal(this.enrollmentApplicationStore.personalData())

    protected readonly formData: FieldTree<PersonalData> = this.buildForm();
    //tambien signals todas las opciones
    protected workingHourstype: WritableSignal<CatalogInterface[]> = signal([]);
    protected monthlySalarys: WritableSignal<CatalogInterface[]> = signal([]);
    protected foreignLanguageNames: WritableSignal<CatalogInterface[]> = signal([]);
    protected ancestralLanguageNames: WritableSignal<CatalogInterface[]> = signal([]);
    protected indigenousNationalitys: WritableSignal<CatalogInterface[]> = signal([]);
    protected towns: WritableSignal<CatalogInterface[]> = signal([]);
    protected disabilityTypes: WritableSignal<CatalogInterface[]> = signal([]);
    protected contactEmergencyKinships: WritableSignal<CatalogInterface[]> = signal([]);
    protected careers: WritableSignal<Career[]> = signal([]);
    protected semesters: WritableSignal<Semester[]> = signal([])

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

        this.workingHourstype.set([
            { id: '1', parentId: '', code: 'WH_TC', name: 'Tiempo Completo', required: true, sort: 1, type: 'HORARIO', isVisible: true },
            { id: '2', parentId: '', code: 'WH_MT', name: 'Medio Tiempo', required: true, sort: 2, type: 'HORARIO', isVisible: true },
            { id: '3', parentId: '', code: 'WH_PH', name: 'Por Horas', required: true, sort: 3, type: 'HORARIO', isVisible: true },
            { id: '4', parentId: '', code: 'WH_PAS', name: 'Pasantía / Prácticas', required: true, sort: 4, type: 'HORARIO', isVisible: true }
        ]);

        this.monthlySalarys.set([
            { id: '1', parentId: '', code: 'MS_B1', name: 'Menos de $460', required: true, sort: 1, type: 'SALARIO', isVisible: true },
            { id: '2', parentId: '', code: 'MS_B2', name: '$460 a $600', required: true, sort: 2, type: 'SALARIO', isVisible: true },
            { id: '3', parentId: '', code: 'MS_B3', name: '$601 a $1000', required: true, sort: 3, type: 'SALARIO', isVisible: true },
            { id: '4', parentId: '', code: 'MS_B4', name: 'Más de $1000', required: true, sort: 4, type: 'SALARIO', isVisible: true }
        ]);

        this.foreignLanguageNames.set([
            { id: '1', parentId: '', code: 'FL_EN', name: 'Inglés', required: true, sort: 1, type: 'IDIOMA_EXT', isVisible: true },
            { id: '2', parentId: '', code: 'FL_FR', name: 'Francés', required: true, sort: 2, type: 'IDIOMA_EXT', isVisible: true },
            { id: '3', parentId: '', code: 'FL_DE', name: 'Alemán', required: true, sort: 3, type: 'IDIOMA_EXT', isVisible: true },
            { id: '4', parentId: '', code: 'FL_PT', name: 'Portugués', required: true, sort: 4, type: 'IDIOMA_EXT', isVisible: true }
        ]);

        this.ancestralLanguageNames.set([
            { id: '1', parentId: '', code: 'AL_KI', name: 'Kichwa', required: true, sort: 1, type: 'LENGUA_ANC', isVisible: true },
            { id: '2', parentId: '', code: 'AL_SH', name: 'Shuar', required: true, sort: 2, type: 'LENGUA_ANC', isVisible: true },
            { id: '3', parentId: '', code: 'AL_AW', name: 'Awapit', required: true, sort: 3, type: 'LENGUA_ANC', isVisible: true },
            { id: '4', parentId: '', code: 'AL_TS', name: 'Tsafiki', required: true, sort: 4, type: 'LENGUA_ANC', isVisible: true }
        ]);

        this.indigenousNationalitys.set([
            { id: '1', parentId: '', code: 'IN_KI', name: 'Kichwa', required: true, sort: 1, type: 'NAC_IND', isVisible: true },
            { id: '2', parentId: '', code: 'IN_SH', name: 'Shuar', required: true, sort: 2, type: 'NAC_IND', isVisible: true },
            { id: '3', parentId: '', code: 'IN_AC', name: 'Achuar', required: true, sort: 3, type: 'NAC_IND', isVisible: true },
            { id: '4', parentId: '', code: 'IN_WA', name: 'Waorani', required: true, sort: 4, type: 'NAC_IND', isVisible: true },
            { id: '5', parentId: '', code: 'IN_NA', name: 'No Aplica', required: true, sort: 5, type: 'NAC_IND', isVisible: true }
        ]);

        this.towns.set([
            { id: '1', parentId: '', code: 'TW_OT', name: 'Otavalo', required: true, sort: 1, type: 'PUEBLO', isVisible: true },
            { id: '2', parentId: '', code: 'TW_PA', name: 'Palta', required: true, sort: 2, type: 'PUEBLO', isVisible: true },
            { id: '3', parentId: '', code: 'TW_PU', name: 'Puruhá', required: true, sort: 3, type: 'PUEBLO', isVisible: true },
            { id: '4', parentId: '', code: 'TW_MO', name: 'Montubio', required: true, sort: 4, type: 'PUEBLO', isVisible: true },
            { id: '5', parentId: '', code: 'TW_AF', name: 'Afroecuatoriano', required: true, sort: 5, type: 'PUEBLO', isVisible: true }
        ]);

        this.disabilityTypes.set([
            { id: '1', parentId: '', code: 'DT_FI', name: 'Física', required: true, sort: 1, type: 'DISCAPACIDAD', isVisible: true },
            { id: '2', parentId: '', code: 'DT_IN', name: 'Intelectual', required: true, sort: 2, type: 'DISCAPACIDAD', isVisible: true },
            { id: '3', parentId: '', code: 'DT_AU', name: 'Auditiva', required: true, sort: 3, type: 'DISCAPACIDAD', isVisible: true },
            { id: '4', parentId: '', code: 'DT_VI', name: 'Visual', required: true, sort: 4, type: 'DISCAPACIDAD', isVisible: true },
            { id: '5', parentId: '', code: 'DT_NE', name: 'Ninguna', required: true, sort: 5, type: 'DISCAPACIDAD', isVisible: true }
        ]);

        this.contactEmergencyKinships.set([
            { id: '1', parentId: '', code: 'EK_PM', name: 'Padre / Madre', required: true, sort: 1, type: 'PARENTESCO', isVisible: true },
            { id: '2', parentId: '', code: 'EK_CC', name: 'Cónyuge / Conviviente', required: true, sort: 2, type: 'PARENTESCO', isVisible: true },
            { id: '3', parentId: '', code: 'EK_HI', name: 'Hijo(a)', required: true, sort: 3, type: 'PARENTESCO', isVisible: true },
            { id: '4', parentId: '', code: 'EK_HE', name: 'Hermano(a)', required: true, sort: 4, type: 'PARENTESCO', isVisible: true },
            { id: '5', parentId: '', code: 'EK_OT', name: 'Otro Familiar', required: true, sort: 5, type: 'PARENTESCO', isVisible: true }
        ]);
        this.careers.set([
            { name: 'Desarrollo de Software', id: '1' },
            { name: 'Redes y Telecomunicaciones', id: '2' },
            { name: 'Diseño Gráfico', id: '3' },
            { name: 'Marketing Digital', id: '4' }
        ])
        this.semesters.set([
            { name: '2025-A', id: '1' },
            { name: '2025-B', id: '2' },
            { name: '2026-A', id: '3' }
        ])

    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private buildForm(): FieldTree<PersonalData> {
        return form(this.form$, (schema) => {
            validatePersonalData(schema);
        });
    }


}
