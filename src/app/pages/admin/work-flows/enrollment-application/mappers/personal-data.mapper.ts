import { EnrollmentApplicationState, PersonalData, UserData, LocationData, ApplicationData } from "../enrollment-application.state";

export class EnrollmentApplicationMapper {

    static toPersonalInformationDto(state: EnrollmentApplicationState) {
        return {
            user: this.mapUser(state.userData),
            informationStudent: this.mapPersonalData(state.personalData),
        };
    }

    static toOriginPlaceDto(state: EnrollmentApplicationState) {
        return {
            user: { originAddress: this.mapLocation(state.originPlace) },
        };
    }

    static toResidencePlaceDto(state: EnrollmentApplicationState) {
        return {
            user: { residenceAddress: this.mapLocation(state.residencePlace) },
        };
    }
        static toApplicationDto(state: EnrollmentApplicationState) {
        return {
            application: this.mapApplication(state.application)
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

            identificationType: user.identificationType,
            gender: user.gender,
            ethnicOrigin: user.ethnicOrigin,
            maritalStatus: user.maritalStatus,
            nationality: user.nationality,
            sex: user.sex,
        };
    }

    private static mapPersonalData(pd: PersonalData) {
        return {
            contactEmergencyName: pd.contactEmergencyName,
            contactEmergencyPhone: pd.contactEmergencyPhone,
            contactEmergencyKinship: pd.contactEmergencyKinship,

            isDisability: pd.isDisability,
            disabilityType: pd.disabilityType,
            disabilityPercentage: pd.disabilityPercentage ? Number(pd.disabilityPercentage) : null,

            isAncestralLanguage: pd.isAncestralLanguage,
            ancestralLanguageName: pd.ancestralLanguageName,

            isCatastrophicIllness: pd.isCatastrophicIllness,
            catastrophicIllness: pd.catastrophicIllness,

            isForeignLanguage: pd.isForeignLanguage,
            foreignLanguageName: pd.foreignLanguageName,

            isHasChildren: pd.isHasChildren,
            childrenTotal: pd.childrenTotal ? Number(pd.childrenTotal) : null,

            isHouseHead: pd.isHouseHead,
            isPrivateSecurity: pd.isPrivateSecurity,
            isSocialSecurity: pd.isSocialSecurity,

            isWork: pd.isWork,
            monthlySalary: pd.monthlySalary,
            workingHours: pd.workingHours,
            workAddress: pd.workAddress,
            workPosition: pd.workPosition,

            town: pd.town,
            indigenousNationality: pd.indigenousNationality,
        };
    }

    private static mapLocation(loc: LocationData) {
        return {
            country: loc.country,
            province: loc.province,
            canton: loc.canton,
            parish: loc.parish,
            latitude: loc.latitude ? Number(loc.latitude) : null,
            longitude: loc.longitude ? Number(loc.longitude) : null,
            mainStreet: loc.mainStreet,
            number: loc.number,
            secondaryStreet: loc.secondaryStreet,
            reference: loc.reference,
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
