import { AfterViewInit, Component, signal ,inject,untracked} from '@angular/core';
import { EnrollmentAplicationStore } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.store";
import * as L from 'leaflet';
import { validateOriginPlace } from '../validators/validate-origin-place';
import { FieldTree, form, FormField } from "@angular/forms/signals";
import { InputText } from "primeng/inputtext";
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { LocationData } from '@/pages/admin/work-flows/enrollment-application/enrollment-application.state'; // Asegúrate de que esta ruta sea la correcta
import { FormRegistryService } from '@/pages/admin/services/form-registry.service';

@Component({
  selector: "app-origin-place",
  // 🔥 2. DECLARAMOS LOS IMPORTS EN EL COMPONENTE PARA QUITAR LOS ERRORES DEL HTML
  imports: [FormField, InputText, FloatLabelModule, MessageModule],
  templateUrl: "./origin-place.html",
  styleUrl: "./origin-place.scss",
})
export class OriginPlace implements AfterViewInit {
public enrollmentApplicationStore = inject(EnrollmentAplicationStore);
private readonly formRegistryService = inject(FormRegistryService);



  private map!: L.Map;
  private marker!: L.Marker;

  // 🔥 2. Ahora sí, 'this.store' ya existe cuando se crea esta señal
  protected form$ = signal<LocationData>(
    structuredClone(this.enrollmentApplicationStore.originPlace())
  );

  protected form: FieldTree<LocationData> = this.buildForm;

    get buildForm() {
      return form(this.form$, (schema) => {
        //Usamos untracked para obtener los valores reales sin crear el bucle infinito que causaba al enviar el signal , toca probar ahora que estan sin las condicionales en las validaciones
        const deconstrucedValues = untracked(() => this.form$());
        validateOriginPlace(schema, deconstrucedValues);
      });
    }


  onSubmit() {
    if (this.form().valid()) {
      // 1. Nos aseguramos de actualizar el Store por última vez
      this.enrollmentApplicationStore.updateOriginPlace(this.form$());

      // 2. Ordenamos al Store avanzar al paso 2
      this.enrollmentApplicationStore.setStep(2);
    } else {
      // Si usas el FormRegistryService para manejar errores globales:
      console.log('El formulario tiene errores:', this.form().errors());
    }
  }

  // Toda tu lógica del mapa está intacta
  ngAfterViewInit() {
    const mapEl = document.getElementById('map') as HTMLElement;

    this.map = L.map(mapEl, {
      center: [-0.18, -78.47],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OSM'
    }).addTo(this.map);

    this.map.invalidateSize();

    this.map.on('click', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  setMarker(lat: number, lng: number) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.enrollmentApplicationStore.updateOriginPlace({
      latitude: String(lat),
      longitude: String(lng)
    });
  }
}