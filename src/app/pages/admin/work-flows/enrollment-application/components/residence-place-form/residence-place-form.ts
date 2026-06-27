import { Component, effect, inject, signal } from '@angular/core';
import { Canton, Country, LocationData, Parish, Province } from '../../work-flow/enrollment-application.state';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../work-flow/enrollment-application.store';
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
    styleUrl: './residence-place-form.scss'
})
export class ResidencePlaceForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);

    protected readonly form$ = signal(this.enrollmentApplicationStore.residencePlace());
    protected readonly formData: FieldTree<LocationData> = this.buildForm;

    countries: Country[] = [];
    provinces: Province[] = [];
    cantons: Canton[] = [];
    parishes: Parish[] = [];
    constructor() {
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        })
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Lugar de Recidencia',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        )
        this.countries = [
            { name: 'Ecuador', id: '1' },
            { name: 'Colombia', id: '2' }
        ];
        this.provinces =[
            { name: 'Pichincha', id: '1'},
            { name: 'Guayas', id: '2'},
        ]
        this.cantons = [
            { name: 'Quito', id: '1'},
            { name: 'Guayaquil', id: '2'},
        ]
        this.parishes = [
            { name: 'Centro Historico', id: '1'},
            { name: 'La Mariscal', id: '2'},
        ]
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
    // Para select de pais
    get countryField() {
        return this.formData.country;
    }

    onCountryChange(selected: Country) {
        this.form$.update(state => ({ ...state, country: selected.id }));
    }
    getSelectedCountry(): Country | undefined {
        return this.countries.find(c => c.id === this.form$().country);
    }

    // Para select de provincia
        get provinceField() {
        return this.formData.province;
    }

    onProvinceChange(selected: Province) {
        this.form$.update(state => ({ ...state, province: selected.id }));
    }
    getSelectedProvince(): Province | undefined {
        return this.provinces.find(p => p.id === this.form$().province);
    }

    // Para select de cantón
    get cantonField() {
        return this.formData.canton;
    }

    onCantonChange(selected: Canton) {
        this.form$.update(state => ({ ...state, canton: selected.id }));
    }
    getSelectedCanton(): Canton | undefined {
        return this.cantons.find(c => c.id === this.form$().canton);
    }

    // Para select de parroquia
        get parishField() {
        return this.formData.parish;
    }

    onParishChange(selected: Parish) {
        this.form$.update(state => ({ ...state, parish: selected.id }));
    }
    getSelectedParish(): Parish | undefined {
        return this.parishes.find(p => p.id === this.form$().parish);
    }

    // Para calle principal
    get mainStreetField() {
        return this.formData.mainStreet;
    }
    // Para calle secundaria
    get secondaryStreetField() {
        return this.formData.secondaryStreet;
    }
    // Para número
    get numberField() {
        return this.formData.number;
    }
    // Para referencia
    get referenceField() {
        return this.formData.reference;
    }

}
