import { Component, inject } from '@angular/core';
import { ApplicationSelecForm } from "../application-selec-form/application-selec-form";
import { ApplicationCheckTable } from "../application-check-table/application-check-table";
import { Button } from "primeng/button";
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services';
import { EnrollmentAplicationStore } from '../../work-flow/enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';

@Component({
    selector: 'app-application',
    imports: [ApplicationSelecForm, ApplicationCheckTable, Button],
    templateUrl: './application.html',
    styleUrl: './application.scss'
})
export class Application {
    private readonly customMessageService = inject(CustomMessageService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    private readonly formRegistryService = inject(FormRegistryService);

    PrimeIcons = PrimeIcons;

    previous() {
        this.enrollmentApplicationStore.setStep(1);
    }

    onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }
        this.enrollmentApplicationStore.setStep(2);

    }
}
