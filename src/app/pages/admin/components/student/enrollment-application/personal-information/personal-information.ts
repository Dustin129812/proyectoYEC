import { Component, inject } from "@angular/core";
import { Accordion, AccordionHeader, AccordionPanel, AccordionContent } from "primeng/accordion";
import { PersonalDataForm } from "../personal-data-form/personal-data-form";
import { OriginPlace } from "../origin-place/origin-place";
import { ResidencePlace } from "../residence-place/residence-place";
import { Button } from "primeng/button";
import { EnrollmentAplicationStore } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.store";

@Component({
  selector: "app-personal-information",
  imports: [Accordion, AccordionHeader, AccordionPanel, AccordionContent, PersonalDataForm, OriginPlace, ResidencePlace, Button],
  templateUrl: "./personal-information.html",
  styleUrl: "./personal-information.scss",
})
export class PersonalInformation {
  private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
  activePanel = 'personal-data';

  nextPanel() {
    console.log('Abriendo origin-place');
    this.activePanel = 'origin-place';
  }

  nextResidence() {
    this.activePanel = 'residence-place';
  }
  onSubmit() {
    this.enrollmentApplicationStore.setStep(2);
    console.log(this.enrollmentApplicationStore.formState())
  }
}
