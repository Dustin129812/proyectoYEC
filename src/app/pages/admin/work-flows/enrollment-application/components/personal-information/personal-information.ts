import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from "primeng/accordion";
import { PersonalDataForm } from "../personal-data-form/personal-data-form";
import { ResidencePlaceForm } from "../residence-place-form/residence-place-form";
import { OriginPlaceForm } from "../origin-place-form/origin-place-form";
import { CustomMessageService } from '@utils/services';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { UserDataForm } from "../user-data-form/user-data-form";
const FORM_PERSONAL_KEY = "personalData"
const FORM_USER_KEY = 'userData'
@Component({
    selector: 'app-personal-information',
    imports: [Button, Accordion, AccordionPanel, AccordionHeader, AccordionContent, PersonalDataForm, ResidencePlaceForm, OriginPlaceForm, UserDataForm],
    templateUrl: './personal-information.html',
})
export class PersonalInformation {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    activePanel = 'user-data';

    nextPanel() {
        this.activePanel = 'origin-place';
    }

    nextResidence() {
        this.activePanel = 'residence-place';
    }
    nextPersonal() {
        this.activePanel = 'personal-data';
    }

    onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            console.log('personal-information', this.enrollmentApplicationStore.formState());
            return;
        }
        if (
            !this.enrollmentApplicationStore.personalData() ||
            !this.enrollmentApplicationStore.userData() ||
            !this.enrollmentApplicationStore.residencePlace() ||
            !this.enrollmentApplicationStore.originPlace()
        ) {
            return;
        }

        console.log('personal-information', this.enrollmentApplicationStore.formState());
        this.enrollmentApplicationStore.setStep(2);
    }
}
