import { Component, inject } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { Application } from "./components/application/application";
import { EnrollmentAttachment } from './components/enrollment-attachment/enrollment-attachment';
import { PersonalInformation } from './components/personal-information/personal-information';
import { EnrollmentAplicationStore } from './work-flow/enrollment-application.store';


@Component({
    selector: 'app-enrollment-application',
    imports: [Application, EnrollmentAttachment, StepperModule, PersonalInformation],
    templateUrl: './enrollment-application.html',
    styleUrl: './enrollment-application.scss'
})
export class EnrollmentApplication {
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    Page1 = this.enrollmentApplicationStore.paso1Completo
    Page2 = this.enrollmentApplicationStore.paso2Completo
    stepPlane = (page: number) => this.enrollmentApplicationStore.setStep(page)
    pageActual = () => this.enrollmentApplicationStore.pasoActual()

}
