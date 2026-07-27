import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { LocationData, LocationInterface } from '../../enrollment-application.state';
import { validateOriginPlace } from '../../validators/validate-origin-place';
import { Select } from "primeng/select";
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { InputText } from 'primeng/inputtext';
import { MapCoords, MapComponent } from '../map/map';
import { LocationsService } from '../../services/locations.services';
import { firstValueFrom } from 'rxjs';


const FORM_STATE_KEY = "originPlace"

@Component({
    selector: 'app-origin-place-form',
    imports: [FormField, Select, ErrorMessageDirective, Select, LabelDirective, InputText, MapComponent],
    templateUrl: './origin-place-form.html',
})
export class OriginPlaceForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    private readonly locationService = inject(LocationsService)
    protected readonly form$: WritableSignal<LocationData> = signal(this.enrollmentApplicationStore.originPlace());
    protected readonly formData: FieldTree<LocationData> = this.buildForm;

    // Catálogo raíz (sin padre)
    //traer locaciones de dpa ya no de catalogue
    protected countries = this.locationService.countries;

    protected readonly provinces = computed(() => {
        const country = this.formData.country().value();

        if (!country || !country.id) return [];

        return this.locationService.provinces(country.id);
    });

    protected readonly cantons = computed(() => {
        const province = this.formData.province().value();

        if (!province || !province.id) return [];

        return this.locationService.cantons(province.id);
    });

    protected readonly parishes = computed(() => {
        const canton = this.formData.canton().value();

        if (!canton || !canton.id) return [];

        return this.locationService.parishes(canton.id);
    });

    constructor() {
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        })
    }

    async ngOnInit() {

        this.formRegistryService.register(
            'Lugar de Procedencia',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.locationService.loadCache();

        if (this.locationService.countries().length === 0) {
            await firstValueFrom(
                this.locationService.findCache()
            );
        }
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }
    protected readonly selectedCenter = computed<MapCoords | null>(() => {
        const locations = [
            this.formData.parish().value(),
            this.formData.canton().value(),
            this.formData.province().value(),
            this.formData.country().value(),
        ];

        const selected = locations.find(
            location =>
                location?.latitude != null &&
                location?.longitude != null
        );

        if (!selected || !selected.latitude || !selected.longitude) {
            return null;
        }

        return {
            latitude: selected.latitude.toString(),
            longitude: selected.longitude.toString(),
        };
    });

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
