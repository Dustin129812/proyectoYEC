import { FieldTree } from '@angular/forms/signals';
import { UserData } from '../../enrollment-application.state'; // Ajusta la ruta si es necesario

export abstract class UserDataGetters {

    protected abstract formData: FieldTree<UserData>;

    get birthdateField() {
        return this.formData.birthdate;
    }

    get cellPhoneField() {
        return this.formData.cellPhone;
    }

    get emailField() {
        return this.formData.email;
    }

    get ethnicOriginField() {
        return this.formData.ethnicOrigin;
    }

    get genderField() {
        return this.formData.gender;
    }

    get identificationField() {
        return this.formData.identification;
    }

    get identificationTypeField() {
        return this.formData.identificationType;
    }

    get lastnameField() {
        return this.formData.lastname;
    }

    get maritalStatusField() {
        return this.formData.maritalStatus;
    }

    get nameField() {
        return this.formData.name;
    }

    get nationalityField() {
        return this.formData.nationality;
    }

    get personalEmailField() {
        return this.formData.personalEmail;
    }

    get phoneField() {
        return this.formData.phone;
    }

    get sexField() {
        return this.formData.sex;
    }
}
