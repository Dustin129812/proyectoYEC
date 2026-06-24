import { Component, inject } from "@angular/core";
import { Application } from "./application/application";
import { EnrollmentAttachment } from "./enrollment-attachment/enrollment-attachment";
import { StepperModule } from 'primeng/stepper';
import { EnrollmentAplicationStore } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.store";
import { PersonalInformation } from "./personal-information/personal-information";

@Component({
  selector: "app-enrollment-application",
  imports: [Application, EnrollmentAttachment, StepperModule, PersonalInformation],
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
