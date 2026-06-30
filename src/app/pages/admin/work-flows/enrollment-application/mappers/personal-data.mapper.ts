import { ApplicationData, EnrollmentApplicationState, PersonalData, UserData } from "../enrollment-application.state";

export class EnrollmentApplicationMapper {

    static toStudentDto(state: EnrollmentApplicationState) {
        return {
            userId: this.mapUser(state.userData),

            informationStudent: this.mapPersonalData(state.personalData),

            //No creo que es array pero pero en el back es array, no hay seleccion multiple
            // a menos que sean las asignaturas del enrollmendetail , toca averiguar
            //careers: this.mapCareers(state.application),

            // si el backend lo requiere
            // enrollment: this.mapEnrollment(state.application)
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

            identificationTypeId: user.identificationType.id,
            genderId: user.gender.id,
            ethnicOriginId: user.ethnicOrigin.id,
            maritalStatusId: user.maritalStatus.id,
            nationalityId: user.nationality.id,
            sexId: user.sex.id,
            // bloodTypeId: user.bloodType?.id ?? null no existe actualmente un componente para eso ni en el sistema antiguo
        };
    }
    private static mapPersonalData(pd: PersonalData) {
        return {
            contactEmergencyName: pd.contactEmergencyName,
            contactEmergencyPhone: pd.contactEmergencyPhone,
            contactEmergencyKinshipId: pd.contactEmergencyKinship.id,

            disabilityPercentage: pd.disabilityPercentage ? Number(pd.disabilityPercentage) : null,
            isDisabilityId: pd.isDisability?.id ?? null,
            disabilityTypeId: pd.disabilityType?.id ?? null,

            isAncestralLanguageId: pd.isAncestralLanguage?.id ?? null,
            ancestralLanguageNameId: pd.ancestralLanguageName?.id ?? null,

            isCatastrophicIllnessId: pd.isCatastrophicIllness?.id ?? null,
            catastrophicIllness: pd.catastrophicIllness,

            isForeignLanguageId: pd.isForeignLanguage?.id ?? null,
            foreignLanguageNameId: pd.foreignLanguageName?.id ?? null,

            isHasChildrenId: pd.isHasChildren?.id ?? null,
            childrenTotal: pd.childrenTotal ? Number(pd.childrenTotal) : null,

            isHouseHeadId: pd.isHouseHead?.id ?? null,
            isPrivateSecurityId: pd.isPrivateSecurity?.id ?? null,
            isSocialSecurityId: pd.isSocialSecurity?.id ?? null,

            isWorkId: pd.isWork?.id ?? null,
            monthlySalaryId: pd.monthlySalary?.id ?? null,
            workingHoursId: pd.workingHours?.id ?? null,

            workAddress: pd.workAddress,
            workPosition: pd.workPosition,

            townId: pd.town?.id ?? null,
            indigenousNationalityId: pd.indigenousNationality?.id ?? null
        };
    }
    private static mapApplication(app: ApplicationData) {
        return {
            studentId: app.student.id,
            academicPeriodId: app.academicPeriod.id,
            careerId: app.career.id,
            parallelId: app.parallel.id,
            schoolPeriodId: app.schoolPeriod.id,
            workdayId: app.workday.id,

            enrollmentDetails: app.enrollmentDetails.map(d => ({
                id: d.id,
                code: d.code,
                name: d.name
            }))
        };
    }
    private static mapCareers(app: ApplicationData) {
        return app.career ? [app.career.id] : [];
    }
}
