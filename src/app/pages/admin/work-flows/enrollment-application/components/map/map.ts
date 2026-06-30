import { Component, Output, EventEmitter, OnDestroy, AfterViewInit, ElementRef, ViewChild, output } from '@angular/core';
import * as L from 'leaflet';

export interface MapCoords {
    latitude: string;
    longitude: string;
}

@Component({
    selector: 'app-map',
    imports: [],
    templateUrl: './map.html',
    styleUrl: './map.scss'
})
export class MapComponent implements AfterViewInit, OnDestroy {
    public coordsChange = output<MapCoords>();

    @ViewChild('mapContainer') mapContainer!: ElementRef;

    private map!: L.Map;
    private marker?: L.Marker;

    // ← AfterViewInit garantiza que #mapContainer ya está en el DOM
ngAfterViewInit(): void {
    // Un pequeño retraso (ej. 150ms-200ms) permite que las animaciones 
    // de CSS y los contenedores dinámicos tomen su tamaño real.
    setTimeout(() => {
        this.initMap();
        
        // Opcional pero altamente recomendado: obliga a Leaflet a reajustarse
        this.map?.invalidateSize();
    }, 200); 
}

    ngOnDestroy(): void {
        this.map?.remove();
    }

    private initMap(): void {
        const iconDefault = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;

        // ← referencia directa al elemento, no por ID string
        this.map = L.map(this.mapContainer.nativeElement).setView([-0.1807, -78.4678], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;

            if (this.marker) {
                this.marker.setLatLng([lat, lng]);
            } else {
                this.marker = L.marker([lat, lng]).addTo(this.map);
            }

            this.coordsChange.emit({
                latitude: lat.toString(),
                longitude: lng.toString()
            });
        });
    }
}