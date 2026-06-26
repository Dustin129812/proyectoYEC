//Interfaces
export interface EnrollmentAplicationState {
    personalData: PersonalData,
    originPlace: LocationData,
    residencePlace: LocationData,
    application: ApplicationData
}

export interface PersonalData {
    career: Career,
    semester: Semester,
    contactEmergencyKinship: string,
    contactEmergencyName: string,
    contactEmergencyPhone: string,
    isDisability: boolean,
    disabilityPercentage: string,
    disabilityType: string,
    isAncestralLanguage: boolean,
    ancestralLanguageName: string,
    isCatastrophicIllness: boolean,
    catastrophicIllness: string,
    isForeignLanguage: boolean,
    foreignLanguageName: string,
    isHasChildren: boolean,
    childrenTotal: string,
    isHouseHead: boolean,
    isPrivateSecurity: boolean,
    isSocialSecurity: boolean,
    isWork: boolean,
    monthlySalary: string,
    workAddress: string,
    workingHours: string,
    workPosition: string,
    town: string,
    indigenousNationality: string,
}

export interface LocationData {
    country: string,
    province: string,
    canton: string,
    parish: string,
    latitude: string,
    longitude: string,
    mainStreet: string,
    number: string,
    reference: string,
    secondaryStreet: string
}

export interface ApplicationData {
    student: Student,
    academicPeriod: AcademicPeriod,
    career: Career,
    enrollmentDetails: EnrollmentDetail[],
    parallel: Parallel,
    schoolPeriod: SchoolPeriod,
    workday: Workday,
}
export interface Career {
    id: string,
    name: string,
}
export interface Semester {
    id: string,
    name: string,
}
export interface AcademicPeriod {
    id: string,
    name: string,
}
export interface Parallel {
    id: string,
    name: string,
}
export interface SchoolPeriod {
    id: string,
    name: string,
}
export interface Workday {
    id: string,
    name: string,
}
export interface Student {
    id: string,
    name: string,
}
export interface EnrollmentDetail {
    id: string,
    code: string,
    name: string
}


export const INITIAL_ENROLLMENT_APPLICATION_STATE: EnrollmentAplicationState = {
    personalData: {
        career: { name: "", id: "" },
        semester: { name: "", id: "" },
        contactEmergencyKinship: '',
        contactEmergencyName: '',
        contactEmergencyPhone: '',
        isDisability: false,
        disabilityPercentage: '',
        disabilityType: '',
        isAncestralLanguage: false,
        ancestralLanguageName: '',
        isCatastrophicIllness: false,
        catastrophicIllness: '',
        isForeignLanguage: false,
        foreignLanguageName: '',
        isHasChildren: false,
        childrenTotal: '',
        isHouseHead: false,
        isPrivateSecurity: false,
        isSocialSecurity: false,
        isWork: false,
        monthlySalary: '',
        workAddress: '',
        workingHours: '',
        workPosition: '',
        town: '',
        indigenousNationality: '',
    },
    originPlace: {
        country: '',
        province: '',
        canton: '',
        parish: '',
        latitude: '',
        longitude: '',
        mainStreet: '',
        number: '',
        reference: '',
        secondaryStreet: ''
    },
    residencePlace: {
        country: '',
        province: '',
        canton: '',
        parish: '',
        latitude: '',
        longitude: '',
        mainStreet: '',
        number: '',
        reference: '',
        secondaryStreet: ''
    },
    application: {
        student: { name: "", id: "" },
        academicPeriod: { name: "", id: "" },
        career: { name: "", id: "" },
        enrollmentDetails: [],
        parallel: { name: "", id: "" },
        schoolPeriod: { name: "", id: "" },
        workday: { name: "", id: "" },
    }
}
