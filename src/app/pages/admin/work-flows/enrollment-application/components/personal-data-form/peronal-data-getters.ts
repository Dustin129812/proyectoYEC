
import { FieldTree } from '@angular/forms/signals';
import { PersonalData } from '../../work-flow/enrollment-application.state';

export abstract class PersonalDataGetters {

    protected abstract formData: FieldTree<PersonalData>;

    get career() {
        return this.formData.career;
    }

    get semester() {
        return this.formData.semester;
    }

    get contactEmergencyKinship() {
        return this.formData.contactEmergencyKinship;
    }

    get contactEmergencyName() {
        return this.formData.contactEmergencyName;
    }

    get contactEmergencyPhone() {
        return this.formData.contactEmergencyPhone;
    }

    get isDisability() {
        return this.formData.isDisability;
    }

    get disabilityPercentage() {
        return this.formData.disabilityPercentage;
    }

    get disabilityType() {
        return this.formData.disabilityType;
    }

    get isCatastrophicIllness() {
        return this.formData.isCatastrophicIllness;
    }

    get catastrophicIllness() {
        return this.formData.catastrophicIllness;
    }

    get isAncestralLanguage(){
        return this.formData.isAncestralLanguage;
    }

    get ancestralLanguageName(){
        return this.formData.ancestralLanguageName;
    }

    get isForeignLanguage(){
        return this.formData.isForeignLanguage;
    }

    get foreignLanguageName(){
        return this.formData.foreignLanguageName;
    }

    get isHouseHead() {
        return this.formData.isHouseHead;
    }

    get isHasChildren() {
        return this.formData.isHasChildren;
    }

    get childrenTotal() {
        return this.formData.childrenTotal;
    }

    get isWork() {
        return this.formData.isWork;
    }

    get monthlySalary() {
        return this.formData.monthlySalary;
    }

    get workAddress() {
        return this.formData.workAddress;
    }

    get workPosition() {
        return this.formData.workPosition;
    }

    get workingHours() {
        return this.formData.workingHours;
    }

    get town() {
        return this.formData.town;
    }

    get isSocialSecurity() {
        return this.formData.isSocialSecurity;
    }

    get isPrivateSecurity() {
        return this.formData.isPrivateSecurity;
    }

    get indigenousNationality() {
        return this.formData.indigenousNationality;
    }
}
