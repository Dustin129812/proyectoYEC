import { AfterViewInit, Component, signal, inject, untracked, ViewChild, ElementRef } from '@angular/core'; // 🔥 Añadido ViewChild y ElementRef
import { EnrollmentAplicationStore } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.store";
import * as L from 'leaflet';
import { validateOriginPlace } from '../validators/validate-origin-place';
import { FieldTree, form, FormField } from "@angular/forms/signals";
import { InputText } from "primeng/inputtext";
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { LocationData } from '@/pages/admin/work-flows/enrollment-application/enrollment-application.state';
import { FormRegistryService } from '@/pages/admin/services/form-registry.service';

@Component({
  selector: "app-origin-place",
  imports: [FormField, InputText, FloatLabelModule, MessageModule],
  templateUrl: "./origin-place.html",
  styleUrl: "./origin-place.scss",
})
export class OriginPlace implements AfterViewInit {
  public enrollmentApplicationStore = inject(EnrollmentAplicationStore);
  private readonly formRegistryService = inject(FormRegistryService);

  // 🔥 1. ATRAPAMOS EL CONTENEDOR DEL MAPA DIRECTO DEL HTML
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: L.Map;
  private marker!: L.Marker;

  protected form$ = signal<LocationData>(
    structuredClone(this.enrollmentApplicationStore.originPlace())
  );

  public form: FieldTree<LocationData> = this.buildForm;

  get buildForm() {
    return form(this.form$, (schema) => {
      const deconstrucedValues = untracked(() => this.form$());
      validateOriginPlace(schema, deconstrucedValues);
    });
  }

  ngAfterViewInit() {
    // Le damos 300ms para asegurar que el padre terminó de dibujar la tarjeta
    setTimeout(() => {
      // 🔥 2. Usamos nativeElement en lugar de getElementById
      if (!this.mapContainer || !this.mapContainer.nativeElement) {
        console.error("El contenedor del mapa no está listo aún");
        return;
      }

      // 🔥 3. Le pasamos el contenedor nativo directamente a Leaflet
      this.map = L.map(this.mapContainer.nativeElement, {
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
    }, 300);
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