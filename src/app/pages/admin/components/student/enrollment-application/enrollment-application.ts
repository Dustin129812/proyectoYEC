import { Component, inject } from "@angular/core";
import { PersonalDataForm } from "./personal-data-form/personal-data-form";
import { Application } from "./application/application";
import { EnrollmentAttachment } from "./enrollment-attachment/enrollment-attachment";
import { StepperModule } from 'primeng/stepper';
import { EnrollmentAplicationStore } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.store";

@Component({
  selector: "app-enrollment-application",
  imports: [PersonalDataForm, Application, EnrollmentAttachment, StepperModule],
  templateUrl: "./enrollment-application.html",
  styleUrl: "./enrollment-application.scss",
})
export class EnrollmentApplication {
  private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore)
  Page1 = this.enrollmentApplicationStore.paso1Completo
  Page2 = this.enrollmentApplicationStore.paso2Completo
  stepPlane = (page: number) => this.enrollmentApplicationStore.setStep(page)
  pageActual = () => this.enrollmentApplicationStore.pasoActual()

}
