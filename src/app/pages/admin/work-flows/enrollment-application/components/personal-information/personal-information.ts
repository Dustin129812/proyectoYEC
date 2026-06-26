import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { EnrollmentAplicationStore } from '../../work-flow/enrollment-application.store';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from "primeng/accordion";
import { PersonalDataForm } from "../personal-data-form/personal-data-form";
import { ResidencePlaceForm } from "../residence-place-form/residence-place-form";
import { OriginPlaceForm } from "../origin-place-form/origin-place-form";
import { CustomMessageService } from '@utils/services';
import { FormRegistryService } from '@utils/services/form-registry.service';

@Component({
    selector: 'app-personal-information',
    imports: [Button, Accordion, AccordionPanel, AccordionHeader, AccordionContent, PersonalDataForm, ResidencePlaceForm, OriginPlaceForm],
    templateUrl: './personal-information.html',
    styleUrl: './personal-information.scss'
})
export class PersonalInformation {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
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
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }
        if (!this.enrollmentApplicationStore.personalData() || !this.enrollmentApplicationStore.residencePlace()||!this.enrollmentApplicationStore.originPlace()) return;
        console.log('personal-information', this.enrollmentApplicationStore.formState())
        this.enrollmentApplicationStore.setStep(2);
    }
}
