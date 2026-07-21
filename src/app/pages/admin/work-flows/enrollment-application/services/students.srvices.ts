import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//  import {
//     CreateStudentDto,
//     EnrollmentDetailModel,
//     EnrollmentModel,
//     FileModel, SchoolPeriodModel,
//     StudentModel,
//     UpdateStudentDto
// } from '@models/core';
//import { ServerResponse } from '@models/http-response';
//import { CareersService, CoreService,MessageService } from '@services/core';
import { format } from "date-fns";
import { HttpResponseInterface } from '@utils/interfaces';
import { LocationDto, PersonalInformationDto, StudentInterface } from '../enrollment-application.state';
import { EnrollmentApplicationMapper } from '../mappers/personal-data.mapper';


@Injectable({
    providedIn: 'root'
})
export class StudentsService {
    API_URL = `${environment.API_URL}/students`;
  //  protected readonly careersService = inject(CareersService);

    constructor(
        // private coreService: CoreService,
        private httpClient: HttpClient,
        //private messageService: MessageService,
    ) {
    }

    findAll(page: number = 0, search: string = ''): Observable<HttpResponseInterface> {
        const url = this.API_URL;

        const headers = new HttpHeaders().append('pagination', 'true');
        const params = new HttpParams()
            .append('page', page)
            .append('search', search);

        return this.httpClient.get<HttpResponseInterface>(url, { headers, params }).pipe(
            map((response) => {
                return response;
            })
        );
    }

    findOne(id: string): Observable<StudentInterface> {
        const url = `${this.API_URL}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map(response => {
                return response.data;
            })
        );
    }

/*
    reactivate(id: string): Observable<StudentModel> {
        const url = `${this.API_URL}/${id}/reactivate`;

        return this.httpClient.put<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                this.messageService.success(response).then();
                return response.data;
            })
        );
    }



    remove(id: string): Observable<StudentModel> {
        const url = `${this.API_URL}/${id}`;

        return this.httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => {
                this.messageService.success(response).then();
                return response.data;
            })
        );
    }

    removeAll(users: StudentModel[]): Observable<StudentModel[]> {
        const url = `${this.API_URL}/remove-all`;

        return this.httpClient.patch<HttpResponseInterface>(url, users).pipe(
            map((response) => {
                this.messageService.success(response).then();
                return response.data;
            })
        );
    }

    hide(id: string): Observable<StudentModel> {
        const url = `${this.API_URL}/${id}/hide`;

        return this.httpClient.patch<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                this.messageService.success(response).then();
                return response.data;
            })
        );
    }
*/

update(
  id: string,
  payload: PersonalInformationDto
): Observable<StudentInterface> {
  const url = `${this.API_URL}/${id}`;

  return this.httpClient.put<HttpResponseInterface>(url, payload).pipe(
    map(response => response.data)
  );
}
updatePersonalInformation(id: string, payload: any): Observable<StudentInterface> {
    const url = `${this.API_URL}/${id}/personal-information`;
    return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
        map((response) => response.data),
    );
}
updateOriginPlace(id: string, payload: any): Observable<StudentInterface> {
    const url = `${this.API_URL}/${id}/origin-place`;
    return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
        map((response) => response.data),
    );
}

updateResidencePlace(id: string, payload: any): Observable<StudentInterface> {
    const url = `${this.API_URL}/${id}/residence-place`;
    return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
        map((response) => response.data),
    );
}


  // Preguntar
 /* updateCroquis(id: string, payload: UpdateStudentDto): Observable<StudentModel> {
    const url = `${this.API_URL}/${id}/croquis`;

    this.coreService.isProcessing = true;
    return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
      map(response => {
        this.coreService.isProcessing = false;
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }*/


}
