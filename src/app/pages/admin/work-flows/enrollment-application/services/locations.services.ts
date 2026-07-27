import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpResponseInterface } from '@utils/interfaces';
import { LocationInterface } from '../enrollment-application.state';
import { map, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocationsService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/core/student/locations`;

    private readonly locations = signal<LocationInterface[]>([]);

    readonly countries = computed(() =>
        this.locations().filter(location => location.level === 1)
    );

    loadCache(): void {
        const cache = sessionStorage.getItem('locations');

        if (!cache) return;

        this.locations.set(JSON.parse(cache));
    }

    findCache(): Observable<LocationInterface[]> {
        return this.httpClient
            .get<HttpResponseInterface>(`${this.apiUrl}/cache/get`)
            .pipe(
                map(response => response.data as LocationInterface[]),
                tap(locations => {
                    this.locations.set(locations);

                    sessionStorage.setItem(
                        'locations',
                        JSON.stringify(locations)
                    );
                })
            );
    }

    provinces(countryId: string): LocationInterface[] {
        return this.locations().filter(
            location =>
                location.level === 2 &&
                location.parentId === countryId
        );
    }

    cantons(provinceId: string): LocationInterface[] {
        return this.locations().filter(
            location =>
                location.level === 3 &&
                location.parentId === provinceId
        );
    }

    parishes(cantonId: string): LocationInterface[] {
        return this.locations().filter(
            location =>
                location.level === 4 &&
                location.parentId === cantonId
        );
    }
}
