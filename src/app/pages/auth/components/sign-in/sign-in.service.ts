import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {concatMap, map, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '@modules/auth/auth.service';
import {SignInResponseInterface} from '@modules/auth/interfaces';
import {CatalogueHttpService, CatalogueService, DpaHttpService} from '@utils/services';
import {DpaService} from "@utils/services/dpa.service";
import {SignInData, SignInState} from "@modules/auth/components/sign-in/sign-in.state";

@Injectable(
    {providedIn: 'root'}
)
export class SignInService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = environment.API_URL;

    private readonly authService = inject(AuthService);
    private readonly catalogueHttpService = inject(CatalogueHttpService);
    private readonly dpaHttpService = inject(DpaHttpService);
    private readonly catalogueService = inject(CatalogueService);
    private readonly dpaService = inject(DpaService);

    signIn(payload: SignInState) {
        const url = `${this.apiUrl}/auth/sign-in`;

        return this.catalogueHttpService.findCache().pipe(
            // 1. Guardar catálogos principales
            concatMap((catalogues) => {
                this.catalogueService.setCatalogues(catalogues);
                return catalogues;
            }),

            // 2. Obtener y guardar Model Catalogues (Agrupado)
            switchMap(() => this.catalogueHttpService.findCacheModelCatalogues().pipe(
                concatMap((response) => {
                    this.catalogueService.setModelCatalogues(response);
                    return response;
                }))),

            // 3. Obtener y guardar DPA (Agrupado)
            switchMap(() => this.dpaHttpService.findCache().pipe(
                concatMap((dpa) => {
                    this.dpaService.setDpa(dpa);
                    return dpa;
                }))),

            // 4. Petición HTTP final del Login
            switchMap(() => this.httpClient.post<SignInResponseInterface>(url, payload.signInData)),

            // 5. Asignación de variables de sesión
            tap((response: SignInResponseInterface) => {
                const {data} = response;

                this.authService.accessToken = data.accessToken;
                this.authService.refreshToken = data.refreshToken;
                this.authService.auth = data.auth;
                this.authService.roles = data.roles;

                if (data.roles.length === 1) {
                    this.authService.role = data.roles[0];
                }
            }),

            // 6. Retorno de la data final
            map((response: SignInResponseInterface) => response.data)
        );
    }

}
