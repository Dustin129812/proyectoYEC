import { ApplicationData, EnrollmentApplicationState, PersonalData, UserData } from "../enrollment-application.state";

export class EnrollmentApplicationMapper {

    static toStudentDto(state: EnrollmentApplicationState) {
        return {
            user: this.mapUser(state.userData),
            informationStudent: this.mapPersonalData(state.personalData),
        };
    }
    private static mapUser(user: UserData) {
        return {
            identification: user.identification,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            personalEmail: user.personalEmail,
            phone: user.phone,
            cellPhone: user.cellPhone,
            birthdate: user.birthdate,

            identificationTypeId: user.identificationType?.id,
            genderId: user.gender?.id,
            ethnicOriginId: user.ethnicOrigin?.id,
            maritalStatusId: user.maritalStatus?.id,
            nationalityId: user.nationality?.id,
            sexId: user.sex?.id,
        };
    }
    private static mapPersonalData(pd: PersonalData) {
        return {
            contactEmergencyName: pd.contactEmergencyName,
            contactEmergencyPhone: pd.contactEmergencyPhone,
            contactEmergencyKinshipId: pd.contactEmergencyKinship?.id,

            disabilityPercentage: pd.disabilityPercentage ? Number(pd.disabilityPercentage) : null,
            isDisabilityId: pd.isDisability,
            disabilityTypeId: pd.disabilityType?.id ?? null,

            isAncestralLanguageId: pd.isAncestralLanguage,
            ancestralLanguageNameId: pd.ancestralLanguageName?.id ?? null,

            isCatastrophicIllnessId: pd.isCatastrophicIllness,
            catastrophicIllness: pd.catastrophicIllness?? null,

            isForeignLanguageId: pd.isForeignLanguage,
            foreignLanguageNameId: pd.foreignLanguageName?.id ?? null,

            isHasChildrenId: pd.isHasChildren,
            childrenTotal: pd.childrenTotal ? Number(pd.childrenTotal) : null,

            isHouseHeadId: pd.isHouseHead,
            isPrivateSecurityId: pd.isPrivateSecurity,
            isSocialSecurityId: pd.isSocialSecurity,

            isWorkId: pd.isWork,
            monthlySalaryId: pd.monthlySalary?.id ?? null,
            workingHoursId: pd.workingHours?.id ?? null,

            workAddress: pd.workAddress ?? null,
            workPosition: pd.workPosition ?? null,

            townId: pd.town?.id ?? null,
            indigenousNationalityId: pd.indigenousNationality?.id ?? null
        };
    }
    private static mapApplication(app: ApplicationData) {
        return {
            studentId: app.student?.id,
            academicPeriodId: app.academicPeriod?.id,
            careerId: app.career?.id,
            parallelId: app.parallel?.id,
            schoolPeriodId: app.schoolPeriod?.id,
            workdayId: app.workday?.id,

            enrollmentDetails: app.enrollmentDetails?.map(d => ({
                id: d.id,
                code: d.code,
                name: d.name
            }))
        };
    }
}
