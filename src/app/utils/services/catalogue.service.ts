import { inject, Injectable } from '@angular/core';
import { CatalogueInterface, HttpResponseInterface, ModelCatalogueInterface } from '@utils/interfaces';
import { CoreEnum } from '@utils/enums';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/common/catalogues`;

    private async getCataloguesTest(): Promise<CatalogueInterface[]> {
        const cached = sessionStorage.getItem(CoreEnum.catalogues);

        if (cached) {
            // Si ya está en caché, lo usamos
            return JSON.parse(cached) as CatalogueInterface[];
        }

        // Si no está en caché, lo traemos del backend
        try {
            const response = await firstValueFrom(this.httpClient.get<any>(`${this.apiUrl}/cache`));
            const catalogues = response.data as CatalogueInterface[];

            // Lo guardamos en caché para que los demás formularios no repitan la petición
            sessionStorage.setItem(CoreEnum.catalogues, JSON.stringify(catalogues));

            return catalogues;
        } catch (error) {
            console.error('Error cargando catálogos', error);
            return [];
        }
    }

    // Ahora los métodos de búsqueda son asíncronos para garantizar que la caché exista
    async findByTypeTest(type: string): Promise<CatalogueInterface[]> {
        const catalogues = await this.getCataloguesTest();

        return catalogues.filter((c) => c.type === type);
    }
    private getCatalogues(): CatalogueInterface[] {
        const catalogues = sessionStorage.getItem(CoreEnum.catalogues);

        return catalogues ? JSON.parse(catalogues) as CatalogueInterface[] : [];
    }

    private getModelCatalogues(): ModelCatalogueInterface[] {
        const modelCatalogues = sessionStorage.getItem(CoreEnum.modelCatalogues);

        return modelCatalogues ? JSON.parse(modelCatalogues) as ModelCatalogueInterface[] : [];
    }

    findByType(type: string): CatalogueInterface[] {
        const catalogues = this.getCatalogues();

        return catalogues
            .filter((c) => c.type === type)
            .map((c) => ({
                id: c.id,
                code: c.code,
                name: c.name,
                enabled: c.enabled
            }));
    }

    async findByModel(modelId: string): Promise<CatalogueInterface[]> {
        const catalogues = await this.getModelCatalogues();

        return catalogues
            .filter((c) => c.modelId === modelId)
            .map((mc) => ({
                id: mc.catalogue.id,
                code: mc.catalogue.code,
                name: mc.catalogue.name,
                enabled: mc.catalogue.enabled
            }));
    }

    async findByCode(code: string, type: string): Promise<CatalogueInterface | undefined> {
        const catalogues = await this.getCatalogues();

        return catalogues.find((c) => c.code === code && c.type === type);
    }
}
