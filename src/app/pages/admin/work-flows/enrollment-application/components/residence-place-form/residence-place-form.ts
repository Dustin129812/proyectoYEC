import { Component, computed, effect, inject, signal, untracked, WritableSignal } from '@angular/core';
import { CatalogInterface, LocationData, LocationInterface } from '../../enrollment-application.state';
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
    protected readonly form$: WritableSignal<LocationData> = signal(this.enrollmentApplicationStore.originPlace());
    protected readonly formData: FieldTree<LocationData> = this.buildForm;
    // Catálogo raíz (sin padre)
    countries: WritableSignal<LocationInterface[]> = signal([]);

    // Catálogos COMPLETOS, sin filtrar
    private allProvinces: WritableSignal<LocationInterface[]> = signal([]);
    private allCantons: WritableSignal<LocationInterface[]> = signal([]);
    private allParishes: WritableSignal<LocationInterface[]> = signal([]);

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



        this.countries.set([
            { id: '1', parentId: '', code: 'ECU', name: 'Ecuador', alpha3Code: 'ECU', level: 1, latitude: -0.1807, longitude: -78.4678 }
            
        ]);

        this.allProvinces.set([
            { id: '1', parentId: '1', code: 'PR_PIC', name: 'Pichincha', level: 2, latitude: -0.1807, longitude: -78.4678 },
            { id: '2', parentId: '1', code: 'PR_GUA', name: 'Guayas', level: 2, latitude: -2.1962, longitude: -79.8862 }
        ]);

        this.allCantons.set([
            { id: '1', parentId: '1', code: 'CA_QUI', name: 'Quito', level: 3, latitude: -0.1807, longitude: -78.4678 },
            { id: '2', parentId: '2', code: 'CA_GYE', name: 'Guayaquil', level: 3, latitude: -2.1962, longitude: -79.8862 }
        ]);

        this.allParishes.set([
            { id: '1', parentId: '1', code: 'PA_CH', name: 'Centro Histórico', level: 4, zone: 'Urbana', latitude: -0.2201, longitude: -78.5123 },
            { id: '2', parentId: '1', code: 'PA_LM', name: 'La Mariscal', level: 4, zone: 'Urbana', latitude: -0.1969, longitude: -78.4850 }
        ]);
    }


    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

   protected readonly selectedCenter = computed<MapCoords | null>(() => {
        const parish = this.formData.parish().value();
        if (parish?.latitude && parish?.longitude) {
            return { latitude: parish.latitude.toString(), longitude: parish.longitude.toString() };
        }

        const canton = this.formData.canton().value();
        if (canton?.latitude && canton?.longitude) {
            return { latitude: canton.latitude.toString(), longitude: canton.longitude.toString() };
        }

        const province = this.formData.province().value();
        if (province?.latitude && province?.longitude) {
            return { latitude: province.latitude.toString(), longitude: province.longitude.toString() };
        }

        const country = this.formData.country().value();
        if (country?.latitude && country?.longitude) {
            return { latitude: country.latitude.toString(), longitude: country.longitude.toString() };
        }

        return null;
    });

    // Catálogos FILTRADOS que consume el template, según selección del padre
    provinces = computed(() => {
        const country = this.formData.country().value();
        if (!country) return [];
        return this.allProvinces().filter(p => p.parentId === country.id);
    });


    cantons = computed(() => {
        const province = this.formData.province().value();
        if (!province) return [];
        return this.allCantons().filter(c => c.parentId === province.id);
    });


    parishes = computed(() => {
        const canton = this.formData.canton().value();
        if (!canton) return [];
        return this.allParishes().filter(p => p.parentId === canton.id);
    });


    // Flags para no resetear en la primera carga (cuando se restaura el estado guardado)
    private countryInitialized = false;
    private provinceInitialized = false;
    private cantonInitialized = false;




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
