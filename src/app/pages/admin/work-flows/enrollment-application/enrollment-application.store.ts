//signals

import { computed, effect, Injectable, signal } from "@angular/core";
import { ApplicationData, EnrollmentApplicationState, INITIAL_ENROLLMENT_APPLICATION_STATE, LocationData, PersonalData } from "./enrollment-application.state";

const CATALOGUE_STATES = {
    REGISTERED: 'registered',
    REQUEST_SENT: 'request_sent',
    APPROVED: 'approved'
};
const FORM_STATE_KEY = 'formState';
const CURRENT_STEP_KEY = 'currentStep';

@Injectable({ providedIn: 'root' })
export class EnrollmentAplicationStore {
    readonly formState = signal<EnrollmentApplicationState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly personalData = computed(() => this.formState().personalData);
    readonly userData = computed(() => this.formState().userData);
    readonly originPlace = computed(() => this.formState().originPlace);
    readonly residencePlace = computed(() => this.formState().residencePlace);
    readonly application = computed(() => this.formState().application);

    readonly isReadOnly = signal<boolean>(false);
    readonly pasoActual = signal<number>(Number(sessionStorage.getItem(CURRENT_STEP_KEY)) || 1);

    constructor() {
        effect(() => {
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(this.formState()));
        });
        effect(() => {
            sessionStorage.setItem(CURRENT_STEP_KEY, this.pasoActual().toString());
        });
    }
    updateSection<K extends keyof EnrollmentApplicationState>(
        section: K,
        data: Partial<EnrollmentApplicationState[K]>
    ) {
        this.formState.update(state => ({
            ...state,
            [section]: {
                ...state[section],
                ...data
            }
        }));
    }
    private loadFromStorage(): EnrollmentApplicationState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_ENROLLMENT_APPLICATION_STATE;
    }
    readonly paso1Completo = computed(() => {
        const pd = this.personalData();
        return !!(pd && pd.contactEmergencyPhone && pd.contactEmergencyName && pd.town);
    });

    readonly paso2Completo = computed(() => {
        if (!this.paso1Completo()) return false;
        const application = this.application();
        return !!(application && application.career && application.parallel);
    });
    setStep(step: number) {
        if (step === 2 && !this.paso1Completo()) return;
        if (step === 3 && !this.paso2Completo()) return;
        this.pasoActual.set(step);
    }
    hydrateFromServer(serverData: any) {
        if (!serverData) return;

        // 1. Mapear datos personales al estado (Paso 1)
        if (serverData.studentInfo) {
            this.updateSection('personalData', {
                career: serverData.studentInfo.informationStudent?.carrer,
                semester: serverData.studentInfo.informationStudent?.academicPeriod,
                contactEmergencyKinship: serverData.studentInfo.informationStudent?.contactEmergencyKinship,
                contactEmergencyName: serverData.studentInfo.informationStudent?.contactEmergencyName,
                contactEmergencyPhone: serverData.studentInfo.informationStudent?.contactEmergencyPhone,
                isDisability: serverData.studentInfo.informationStudent?.isDisability,
                disabilityPercentage: serverData.studentInfo.informationStudent?.disabilityPercentage,
                disabilityType: serverData.studentInfo.informationStudent?.disabilityType,
                isAncestralLanguage: serverData.studentInfo.informationStudent?.isAncestralLanguage,
                ancestralLanguageName: serverData.studentInfo.informationStudent?.ancestralLanguageName,
                isCatastrophicIllness: serverData.studentInfo.informationStudent?.isCatastrophicIllness,
                catastrophicIllness: serverData.studentInfo.informationStudent?.catastrophicIllness,
                isForeignLanguage: serverData.studentInfo.informationStudent?.isForeignLanguage,
                foreignLanguageName: serverData.studentInfo.informationStudent?.foreignLanguageName,
                isHasChildren: serverData.studentInfo.informationStudent?.isHasChildren,
                childrenTotal: serverData.studentInfo.informationStudent?.childrenTotal,
                isHouseHead: serverData.studentInfo.informationStudent?.isHouseHead,
                isPrivateSecurity: serverData.studentInfo.informationStudent?.isPrivateSecurity,
                isSocialSecurity: serverData.studentInfo.informationStudent?.isSocialSecurity,
                isWork: serverData.studentInfo.informationStudent?.isWork,
                monthlySalary: serverData.studentInfo.informationStudent?.monthlySalary,
                workAddress: serverData.studentInfo.informationStudent?.workAddress,
                workingHours: serverData.studentInfo.informationStudent?.workingHours,
                workPosition: serverData.studentInfo.informationStudent?.workPosition,
                town: serverData.studentInfo.informationStudent?.town,
                indigenousNationality: serverData.studentInfo.informationStudent?.indigenousNationality,
                // ... mapea el resto de datos
            });
        }
        if (serverData.studentInfo) {
            this.updateSection('userData', {
                birthdate: serverData.studentInfo?.birthdate,
                cellPhone: serverData.studentInfo?.cellPhone,
                email: serverData.studentInfo?.email,
                ethnicOrigin: serverData.studentInfo?.ethnicOrigin,
                gender: serverData.studentInfo?.gender,
                identification: serverData.studentInfo?.identification,
                identificationType: serverData.studentInfo?.identificationType,
                lastname: serverData.studentInfo?.lastname,
                maritalStatus: serverData.studentInfo?.maritalStatus,
                name: serverData.studentInfo?.name,
                nationality: serverData.studentInfo?.nationality,
                personalEmail: serverData.studentInfo?.personalEmail,
                phone: serverData.studentInfo?.phone,
                sex: serverData.studentInfo?.sex,
            });
        }
        if (serverData.location) {
            if (serverData.location.origin) {
                this.updateSection('originPlace', serverData.location.origin);
            }
            if (serverData.location.residence) {
                this.updateSection('residencePlace', serverData.location.residence);
            }
        }
        // 2. Mapear datos de matrícula (Paso 2) y determinar el estado
        if (serverData.enrollment) {
            this.updateSection('application', {
                student: serverData.enrollment.studentId,
                academicPeriod: serverData.enrollment.academicPeriodId,
                career: serverData.enrollment.careerId,
                enrollmentDetails: serverData.enrollment.enrollmentDetails,
                parallel: serverData.enrollment.parallelId,
                schoolPeriod: serverData.enrollment.schoolPeriodId,
                workday: serverData.enrollment.workdayId,
                // ...
            });

            // 3. Controlar el flujo según el estado del Backend
            const currentStateCode = serverData.enrollment.enrollmentStates?.[0]?.state?.code;

            if (currentStateCode === CATALOGUE_STATES.REQUEST_SENT || currentStateCode === CATALOGUE_STATES.APPROVED) {
                // Ya se envió. Bloqueamos el form y lo mandamos al paso final (ej. un resumen)
                this.isReadOnly.set(true);
                this.pasoActual.set(4); // Asumiendo que el 4 es la vista de resumen/éxito
            } else if (currentStateCode === CATALOGUE_STATES.REGISTERED) {
                // Es un borrador (ya eligió materias pero no ha enviado).
                this.isReadOnly.set(false);
                // Si tiene detalles de materias, probablemente ya puede ir al paso 3
                const hasSubjects = serverData.enrollment.enrollmentDetails?.length > 0;
                this.pasoActual.set(hasSubjects ? 3 : 2);
            }
        } else {
            // No tiene matrícula creada, pero sí datos de estudiante. Lo dejamos en el paso 1.
            this.pasoActual.set(1);
        }
    }
}
