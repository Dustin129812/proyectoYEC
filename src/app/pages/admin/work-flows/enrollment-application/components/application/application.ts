import { Component, inject } from '@angular/core';
import { ApplicationDataForm } from "../application-data-form/application-data-form";
import { Button } from "primeng/button";
import { CustomMessageService } from '@utils/services';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { CustomIcons } from '@utils/icons/custom-icons';
import { EnrollmentApplicationMapper } from '../../mappers/personal-data.mapper';

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
    protected readonly CustomIcons = CustomIcons;

    previous() {
        this.enrollmentApplicationStore.setStep(1);
    }

    onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            console.log('application-information', this.enrollmentApplicationStore.formState());
            return;
        }
        if (!this.enrollmentApplicationStore.application()) return;
        const payload = EnrollmentApplicationMapper.toApplicationDto(this.enrollmentApplicationStore.formState())

        console.log('personal-information : ', payload);
        this.enrollmentApplicationStore.setStep(3);
    }
}
