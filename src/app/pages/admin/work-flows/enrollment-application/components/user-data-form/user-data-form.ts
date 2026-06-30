import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { CatalogInterface, UserData } from '../../enrollment-application.state';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { InputText } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Select } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { validateUserData } from '../../validators/user-data-form.validation';
const FORM_STATE_KEY = 'userData'
@Component({
    selector: 'app-user-data-form',
    imports: [FormField, InputText, FloatLabelModule, MessageModule, AccordionModule, LabelDirective, ErrorMessageDirective, Select, FormsModule, ReactiveFormsModule],
    templateUrl: './user-data-form.html',
})
export class UserDataForm {

    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);


    protected readonly form$: WritableSignal<UserData> = signal(this.enrollmentApplicationStore.userData())

    protected readonly formData: FieldTree<UserData> = this.buildForm;

    identificationTypes: WritableSignal<CatalogInterface[]> =signal([])
    maritalStatuses: WritableSignal<CatalogInterface[]> =signal([])
    genders: WritableSignal<CatalogInterface[]> =signal([])
    sexes: WritableSignal<CatalogInterface[]> =signal([])
    ethnicOrigins: WritableSignal<CatalogInterface[]> =signal([])
    nationalities: WritableSignal<CatalogInterface[]> =signal([])
    constructor() {
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Estudiante',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
        this.identificationTypes.set([
            { id: '1', parentId: '', code: 'ID_CED', name: 'Cédula de Identidad', required: true, sort: 1, type: 'IDENTIFICACION', isVisible: true },
            { id: '2', parentId: '', code: 'ID_PAS', name: 'Pasaporte', required: true, sort: 2, type: 'IDENTIFICACION', isVisible: true },
            { id: '3', parentId: '', code: 'ID_RUC', name: 'RUC', required: true, sort: 3, type: 'IDENTIFICACION', isVisible: true },
            { id: '4', parentId: '', code: 'ID_REF', name: 'Carnet de Refugiado', required: true, sort: 4, type: 'IDENTIFICACION', isVisible: true }
        ]);

        this.maritalStatuses.set([
            { id: '1', parentId: '', code: 'MS_SO', name: 'Soltero(a)', required: true, sort: 1, type: 'ESTADO_CIVIL', isVisible: true },
            { id: '2', parentId: '', code: 'MS_CA', name: 'Casado(a)', required: true, sort: 2, type: 'ESTADO_CIVIL', isVisible: true },
            { id: '3', parentId: '', code: 'MS_DI', name: 'Divorciado(a)', required: true, sort: 3, type: 'ESTADO_CIVIL', isVisible: true },
            { id: '4', parentId: '', code: 'MS_VI', name: 'Viudo(a)', required: true, sort: 4, type: 'ESTADO_CIVIL', isVisible: true },
            { id: '5', parentId: '', code: 'MS_UH', name: 'Unión de Hecho', required: true, sort: 5, type: 'ESTADO_CIVIL', isVisible: true }
        ]);

        this.genders.set([
            { id: '1', parentId: '', code: 'GD_MA', name: 'Masculino', required: true, sort: 1, type: 'GENERO', isVisible: true },
            { id: '2', parentId: '', code: 'GD_FE', name: 'Femenino', required: true, sort: 2, type: 'GENERO', isVisible: true },
            { id: '3', parentId: '', code: 'GD_NB', name: 'No Binario', required: true, sort: 3, type: 'GENERO', isVisible: true },
            { id: '4', parentId: '', code: 'GD_OT', name: 'Otro', required: true, sort: 4, type: 'GENERO', isVisible: true }
        ]);

        this.sexes.set([
            { id: '1', parentId: '', code: 'SX_HO', name: 'Hombre', required: true, sort: 1, type: 'SEXO', isVisible: true },
            { id: '2', parentId: '', code: 'SX_MU', name: 'Mujer', required: true, sort: 2, type: 'SEXO', isVisible: true },
            { id: '3', parentId: '', code: 'SX_IN', name: 'Intersexo', required: true, sort: 3, type: 'SEXO', isVisible: true }
        ]);

        this.ethnicOrigins.set([
            { id: '1', parentId: '', code: 'EO_ME', name: 'Mestizo', required: true, sort: 1, type: 'ETNIA', isVisible: true },
            { id: '2', parentId: '', code: 'EO_IN', name: 'Indígena', required: true, sort: 2, type: 'ETNIA', isVisible: true },
            { id: '3', parentId: '', code: 'EO_AF', name: 'Afrodescendiente / Afroecuatoriano', required: true, sort: 3, type: 'ETNIA', isVisible: true },
            { id: '4', parentId: '', code: 'EO_MO', name: 'Montubio', required: true, sort: 4, type: 'ETNIA', isVisible: true },
            { id: '5', parentId: '', code: 'EO_BL', name: 'Blanco', required: true, sort: 5, type: 'ETNIA', isVisible: true },
            { id: '6', parentId: '', code: 'EO_OT', name: 'Otro', required: true, sort: 6, type: 'ETNIA', isVisible: true }
        ]);

        this.nationalities.set([
            { id: '1', parentId: '', code: 'NT_EC', name: 'Ecuatoriana', required: true, sort: 1, type: 'NACIONALIDAD', isVisible: true },
            { id: '2', parentId: '', code: 'NT_CO', name: 'Colombiana', required: true, sort: 2, type: 'NACIONALIDAD', isVisible: true },
            { id: '3', parentId: '', code: 'NT_PE', name: 'Peruana', required: true, sort: 3, type: 'NACIONALIDAD', isVisible: true },
            { id: '4', parentId: '', code: 'NT_VE', name: 'Venezolana', required: true, sort: 4, type: 'NACIONALIDAD', isVisible: true },
            { id: '5', parentId: '', code: 'NT_EX', name: 'Otra Nacionalidad', required: true, sort: 5, type: 'NACIONALIDAD', isVisible: true }
        ]);
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }
    get buildForm() {
        return form(this.form$, (schema) => {
            validateUserData(schema);
        });
    }

}
