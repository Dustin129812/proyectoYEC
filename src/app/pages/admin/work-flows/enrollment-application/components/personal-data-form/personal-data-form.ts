import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { Career, PersonalData, Semester } from '../../work-flow/enrollment-application.state';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { EnrollmentAplicationStore } from '../../work-flow/enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { validatePersonalData } from '../../validators/validate-personal-data-form';
import { Button } from "primeng/button";
import { Checkbox } from "primeng/checkbox";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { LabelDirective } from "@utils/directives/label.directive";
import { PersonalDataGetters } from './peronal-data-getters';
import { ErrorMessageDirective } from "@utils/directives/error-message.directive";
import { Select } from "primeng/select";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const FORM_STATE_KEY = "personalData"

@Component({
    selector: 'app-personal-data-form',
    imports: [FormField, Checkbox, InputText, FloatLabelModule, MessageModule, AccordionModule, LabelDirective, ErrorMessageDirective, Select, FormsModule, ReactiveFormsModule],
    templateUrl: './personal-data-form.html',
    styleUrl: './personal-data-form.scss'
})
export class PersonalDataForm extends PersonalDataGetters {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);


    protected readonly form$: WritableSignal<PersonalData> = signal(this.enrollmentApplicationStore.personalData())

    protected readonly formData: FieldTree<PersonalData> = this.buildForm;

    careers: Career[] = [];
    semesters: Semester[] = [];

    constructor() {
        super();
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Personales',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
        this.careers = [
            { name: 'Desarrollo de Software', id: '1' },
            { name: 'Redes y Telecomunicaciones', id: '2' },
            { name: 'Diseño Gráfico', id: '3' },
            { name: 'Marketing Digital', id: '4' }
        ];
        this.semesters = [
            { name: '2025-A', id: '1' },
            { name: '2025-B', id: '2' },
            { name: '2026-A', id: '3' }
        ];

    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }
    get buildForm() {
        return form(this.form$, (schema) => {
            validatePersonalData(schema);
        });
    }


}
