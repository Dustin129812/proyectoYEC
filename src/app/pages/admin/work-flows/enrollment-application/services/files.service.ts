import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService as MessageServicePn } from 'primeng/api';
//import { EventModel, FileModel } from "@models/core";
//import {ServerResponse} from '@models/http-response';
//import {CoreService, MessageService} from '@services/core';
//import {CoreMessageEnum} from "@utils/enums";
import { HttpResponseInterface } from '@modules/auth/interfaces/http-response.interface';
import { FileData } from '../enrollment-application.state';

@Injectable({
    providedIn: 'root'
})
export class FilesHttpService {
    API_URL = `${environment.API_URL}/files`;

    constructor(private messageServicePn: MessageServicePn,
        //private coreService: CoreService,
        private httpClient: HttpClient,
        //private messageService: MessageService
    ) {
    }

    findByModel(modelId: string, page: number = 0, search: string = ''): Observable<HttpResponseInterface> {
        const url = `${this.API_URL}/models/${modelId}`;

        const headers = new HttpHeaders().append('pagination', 'true');

        const params = new HttpParams()
            .append('page', page.toString())
            .append('limit', '20')
            .append('search', search);

        return this.httpClient.get<HttpResponseInterface>(url, { headers, params }).pipe(
            map((response) => {
                return response;
            })
        );
    }

    findOne(id: string): Observable<FileData> {
        const url = `${this.API_URL}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    uploadFile(modelId: string, typeId: string, payload: FormData): Observable<FileData> {
        const url = `${this.API_URL}/${modelId}/upload`;
        const params = new HttpParams().append('typeId', typeId);

        return this.httpClient.post<HttpResponseInterface>(url, payload, { params }).pipe(
            map((response) => {
                return response.data;
            }))
            ;
    }


    uploadFiles(modelId: string, payload: FormData): Observable<FileData> {
        const url = `${this.API_URL}/${modelId}/uploads`;
        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
    /*
        reactivate(id: string): Observable<FileData> {
            const url = `${this.API_URL}/${id}/reactivate`;

            return this.httpClient.patch<HttpResponseInterface>(url, null).pipe(
                map((response) => {
                    return response.data;
                })
            );
        }

        remove(id: string): Observable<FileData> {
            const url = `${this.API_URL}/${id}`;


            return this.httpClient.delete<HttpResponseInterface>(url).pipe(
                map((response) => {

                    return response.data;
                })
            );
        }

        removeAll(payload: EventModel[]): Observable<EventModel[]> {
            const url = `${this.API_URL}/remove-all`;

            return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
                map((response) => {

                    return response.data;
                })
            );
        }

        hide(id: string): Observable<EventModel> {
            const url = `${this.API_URL}/${id}/hide`;

            return this.httpClient.patch<HttpResponseInterface>(url, null).pipe(
                map((response) => {

                    return response.data;
                })
            );
        }
    */
    downloadFile(file: FileData) {
        const url = `${this.API_URL}/${file.id}/download`;

        this.httpClient.get<BlobPart>(url, { responseType: 'blob' as 'json' })
            .subscribe(response => {
                // const filePath = URL.createObjectURL(new Blob(binaryData, {type: file.extension}));
                const filePath = URL.createObjectURL(new Blob([response]));
                const downloadLink = document.createElement('a');
                downloadLink.href = filePath;
                downloadLink.setAttribute('download', file.originalName!);
                document.body.appendChild(downloadLink);
                downloadLink.click();

            });
    }
}
