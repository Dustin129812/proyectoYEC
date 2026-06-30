import { Component, inject } from '@angular/core';
import { ApplicationDataForm } from "../application-data-form/application-data-form";
import { Button } from "primeng/button";
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';

const FORM_STATE_KEY = "application"
@Component({
    selector: 'app-application',
    imports: [ApplicationDataForm, Button],
    templateUrl: './application.html',
})
export class Application {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    // no usar primeng icons  usar customicons
    PrimeIcons = PrimeIcons;

    previous() {
        this.enrollmentApplicationStore.setStep(1);
    }

    onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }
        if (!this.enrollmentApplicationStore.application()) return;
        console.log('application-information', this.enrollmentApplicationStore.formState());
        this.enrollmentApplicationStore.setStep(3);
    }
}
