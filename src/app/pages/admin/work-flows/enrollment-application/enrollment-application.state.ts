//Interfaces
export interface EnrollmentApplicationState {
    userData: UserData,
    personalData: PersonalData,
    originPlace: LocationData,
    residencePlace: LocationData,
    application: ApplicationData
}
export interface PersonalInformationDto {
    userData: UserDataDto,
    personalData: PersonalDataDto,
}
export interface UserDataDto {
    birthdate: string;
    cellPhone: string;
    email: string;
    ethnicOriginId: CatalogInterface;
    genderId: CatalogInterface;
    identification: string;
    identificationTypeId: CatalogInterface;
    lastname: string;
    maritalStatusId: CatalogInterface;
    name: string;
    nationalityId: CatalogInterface;
    personalEmail: string;
    phone: string;
    sexId: CatalogInterface;
}
export interface PersonalDataDto {
    career: Career,
    semesterId: CatalogInterface,
    contactEmergencyKinshipId: CatalogInterface,
    contactEmergencyName: string,
    contactEmergencyPhone: string,
    isDisability: boolean,
    disabilityPercentage: string,
    disabilityTypeId: CatalogInterface,
    isAncestralLanguage: boolean,
    ancestralLanguageNameId: CatalogInterface,
    isCatastrophicIllness: boolean,
    catastrophicIllness: string,
    isForeignLanguage: boolean,
    foreignLanguageNameId: CatalogInterface,
    isHasChildren: boolean,
    childrenTotal: string,
    isHouseHead: boolean,
    isPrivateSecurity: boolean,
    isSocialSecurity: boolean,
    isWork: boolean,
    monthlySalaryId: CatalogInterface,
    workAddress: string,
    workingHoursId: CatalogInterface,
    workPosition: string,
    town: CatalogInterface,
    indigenousNationalityId: CatalogInterface,
}
export interface LocationDto {
    locationData: LocationData,
}

export interface PersonalData {
    career: Career | null,
    semester: Semester | null,
    contactEmergencyKinship: CatalogInterface | null,
    contactEmergencyName: string,
    contactEmergencyPhone: string,
    isDisability: boolean,
    disabilityPercentage: string,
    disabilityType: CatalogInterface | null,
    isAncestralLanguage: boolean,
    ancestralLanguageName: CatalogInterface | null,
    isCatastrophicIllness: boolean,
    catastrophicIllness: string,
    isForeignLanguage: boolean,
    foreignLanguageName: CatalogInterface | null,
    isHasChildren: boolean,
    childrenTotal: string,
    isHouseHead: boolean,
    isPrivateSecurity: boolean,
    isSocialSecurity: boolean,
    isWork: boolean,
    monthlySalary: CatalogInterface | null,
    workAddress: string,
    workingHours: CatalogInterface | null,
    workPosition: string,
    town: CatalogInterface | null,
    indigenousNationality: CatalogInterface | null,
}

export interface LocationInterface {
    id?: string;
    parent?: LocationInterface | null;
    parentId?: string;
    alpha2Code?: string;
    alpha3Code?: string;
    callingCode?: string;
    code?: string;
    flag?: string;
    latitude?: number;
    longitude?: number;
    level?: number;
    name?: string;
    zone?: string;
}

export interface LocationData {
    country: LocationInterface | null,
    province: LocationInterface | null,
    canton: LocationInterface | null,
    parish: LocationInterface | null,
    latitude: string,
    longitude: string,
    mainStreet: string,
    number: string,
    reference: string,
    secondaryStreet: string
}

export interface ApplicationData {
    student: Student | null,
    academicPeriod: AcademicPeriod | null,
    career: Career | null,
    enrollmentDetails: EnrollmentDetail[] | null,
    parallel: Parallel | null,
    schoolPeriod: SchoolPeriod | null,
    workday: Workday | null,
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
export interface UserData {
    birthdate: string;
    cellPhone: string;
    email: string;
    ethnicOrigin: CatalogInterface | null;
    gender: CatalogInterface | null;
    identification: string;
    identificationType: CatalogInterface | null;
    lastname: string;
    maritalStatus: CatalogInterface | null;
    name: string;
    nationality: CatalogInterface | null;
    personalEmail: string;
    phone: string;
    sex: CatalogInterface | null;
}
export interface CatalogInterface {
    id: string;
    parentId: string;
    code: string;
    name: string;
    required: boolean;
    sort: number;
    type: string;
    isVisible: boolean;
}

export interface StudentInterface {
    id: string;
    createAt: string;
    updateAt: string;
    deleteAt: string;
    isVisible: boolean;
    informationStudent: PersonalData | null;
    user: UserData | null;

}



const initialStudent: StudentInterface = {
    id: '',
    createAt: '',
    updateAt: '',
    deleteAt: '',
    isVisible: false,
    informationStudent: null,
    user: null

}

const initialCatalogue: CatalogInterface = {
    id: '',
    parentId: '',
    code: '',
    name: '',
    required: false,
    sort: 0,
    type: '',
    isVisible: false,
};

const initialLocation: LocationInterface = {
    id: '',
    parent: null,
    parentId: '',
    alpha2Code: '',
    alpha3Code: '',
    callingCode: '',
    code: '',
    flag: '',
    latitude: 0,
    longitude: 0,
    level: 0,
    name: '',
    zone: ''
};
const objectBase = { id: "", name: "" }
export const INITIAL_ENROLLMENT_APPLICATION_STATE: EnrollmentApplicationState = {
    userData: {
        birthdate: '',
        cellPhone: '',
        email: '',
        ethnicOrigin: null,
        gender: null,
        identification: '',
        identificationType: null,
        lastname: '',
        maritalStatus: null,
        name: '',
        nationality: null,
        personalEmail: '',
        phone: '',
        sex: null
    },
    personalData: {
        career: null,
        semester: null,
        contactEmergencyKinship: null,
        contactEmergencyName: '',
        contactEmergencyPhone: '',
        isDisability: false,
        disabilityPercentage: '',
        disabilityType: null,
        isAncestralLanguage: false,
        ancestralLanguageName: null,
        isCatastrophicIllness: false,
        catastrophicIllness: '',
        isForeignLanguage: false,
        foreignLanguageName: null,
        isHasChildren: false,
        childrenTotal: '',
        isHouseHead: false,
        isPrivateSecurity: false,
        isSocialSecurity: false,
        isWork: false,
        monthlySalary: null,
        workAddress: '',
        workingHours: null,
        workPosition: '',
        town: null,
        indigenousNationality: null,
    },
    originPlace: {
        country: null,
        province: null,
        canton: null,
        parish: null,
        latitude: '',
        longitude: '',
        mainStreet: '',
        number: '',
        reference: '',
        secondaryStreet: ''
    },
    residencePlace: {
        country: null,
        province: null,
        canton: null,
        parish: null,
        latitude: '',
        longitude: '',
        mainStreet: '',
        number: '',
        reference: '',
        secondaryStreet: ''
    },
    application: {
        student: null,
        academicPeriod: null,
        career: null,
        enrollmentDetails: null,
        parallel: null,
        schoolPeriod: null,
        workday: null,
    }
}
