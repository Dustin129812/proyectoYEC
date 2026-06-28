
import { FieldTree } from '@angular/forms/signals';
import { PersonalData } from '../../enrollment-application.state';

export abstract class PersonalDataGetters {

    protected abstract formData: FieldTree<PersonalData>;

    get careerField() {
        return this.formData.career;
    }

    get semesterField() {
        return this.formData.semester;
    }

    get contactEmergencyKinshipField() {
        return this.formData.contactEmergencyKinship;
    }

    get contactEmergencyNameField() {
        return this.formData.contactEmergencyName;
    }

    get contactEmergencyPhoneField() {
        return this.formData.contactEmergencyPhone;
    }

    get isDisabilityField() {
        return this.formData.isDisability;
    }

    get disabilityPercentageField() {
        return this.formData.disabilityPercentage;
    }

    get disabilityTypeField() {
        return this.formData.disabilityType;
    }

    get isCatastrophicIllnessField() {
        return this.formData.isCatastrophicIllness;
    }

    get catastrophicIllnessField() {
        return this.formData.catastrophicIllness;
    }

    get isAncestralLanguageField(){
        return this.formData.isAncestralLanguage;
    }

    get ancestralLanguageNameField(){
        return this.formData.ancestralLanguageName;
    }

    get isForeignLanguageField(){
        return this.formData.isForeignLanguage;
    }

    get foreignLanguageNameField(){
        return this.formData.foreignLanguageName;
    }

    get isHouseHeadField() {
        return this.formData.isHouseHead;
    }

    get isHasChildrenField() {
        return this.formData.isHasChildren;
    }

    get childrenTotalField() {
        return this.formData.childrenTotal;
    }

    get isWorkField() {
        return this.formData.isWork;
    }

    get monthlySalaryField() {
        return this.formData.monthlySalary;
    }

    get workAddressField() {
        return this.formData.workAddress;
    }

    get workPositionField() {
        return this.formData.workPosition;
    }

    get workingHoursField() {
        return this.formData.workingHours;
    }

    get townField() {
        return this.formData.town;
    }

    get isSocialSecurityField() {
        return this.formData.isSocialSecurity;
    }

    get isPrivateSecurityField() {
        return this.formData.isPrivateSecurity;
    }

    get indigenousNationalityField() {
        return this.formData.indigenousNationality;
    }
}
