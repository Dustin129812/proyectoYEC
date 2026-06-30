import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { CatalogInterface, LocationData } from '../../enrollment-application.state';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { validateOriginPlace } from '../../validators/validate-origin-place';
import { MapComponent, MapCoords } from '../map/map';
import { Select } from 'primeng/select';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { InputText } from 'primeng/inputtext';


const FORM_STATE_KEY = "residencePlace"
@Component({
    selector: 'app-residence-place-form',
    imports: [FormField, Select, ErrorMessageDirective, FormsModule, ReactiveFormsModule, LabelDirective,InputText, MapComponent],
    templateUrl: './residence-place-form.html',
})
export class ResidencePlaceForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);


    protected readonly form$: WritableSignal<LocationData> = signal(this.enrollmentApplicationStore.residencePlace());
    protected readonly formData: FieldTree<LocationData> = this.buildForm;

    countries: WritableSignal<CatalogInterface[]> = signal([]);
    provinces: WritableSignal<CatalogInterface[]> = signal([]);
    cantons: WritableSignal<CatalogInterface[]> = signal([]);
    parishes: WritableSignal<CatalogInterface[]> = signal([]);

    constructor() {
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        })
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Lugar de Procedencia',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        )
        this.countries.set([
            { id: '1', parentId: '', code: 'WH_TC', name: 'Ecuador', required: true, sort: 1, type: 'HORARIO', isVisible: true },
            { id: '2', parentId: '', code: 'WH_TD', name: 'Colombia', required: true, sort: 2, type: 'HORARIO', isVisible: true }
        ]);
        this.provinces.set([
            { id: '1', parentId: '1', code: 'PR_PIC', name: 'Pichincha', required: true, sort: 1, type: 'PROVINCIA', isVisible: true },
            { id: '2', parentId: '1', code: 'PR_GUA', name: 'Guayas', required: true, sort: 2, type: 'PROVINCIA', isVisible: true }
        ]);

        this.cantons.set([
            { id: '1', parentId: '1', code: 'CA_QUI', name: 'Quito', required: true, sort: 1, type: 'CANTON', isVisible: true },
            { id: '2', parentId: '2', code: 'CA_GYE', name: 'Guayaquil', required: true, sort: 2, type: 'CANTON', isVisible: true }
        ]);

        this.parishes.set([
            { id: '1', parentId: '1', code: 'PA_CH', name: 'Centro Histórico', required: true, sort: 1, type: 'PARROQUIA', isVisible: true },
            { id: '2', parentId: '1', code: 'PA_LM', name: 'La Mariscal', required: true, sort: 2, type: 'PARROQUIA', isVisible: true }
        ]);
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }
    get buildForm() {
        return form(this.form$, (schema) => {
            validateOriginPlace(schema);
        });
    }

    // Para el Mapa
    onCoordsChange(coords: MapCoords): void {
        this.form$.update(state => ({
            ...state,
            latitude: coords.latitude,
            longitude: coords.longitude
        }));
    }
  
}
