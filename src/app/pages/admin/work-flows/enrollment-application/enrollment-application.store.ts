//signals    

import { computed, effect, Injectable, signal } from "@angular/core";
import { ApplicationData, EnrollmentAplicationState, INITIAL_ENROLLMENT_APPLICATION_STATE, LocationData, PersonalData } from "./enrollment-application.state";


const FORM_STATE_KEY = 'formState';
const CURRENT_STEP_KEY = 'currentStep';

@Injectable({ providedIn: 'root' })
export class EnrollmentAplicationStore {
    readonly formState = signal<EnrollmentAplicationState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly personalData = computed(() => this.formState().personalData);
    readonly originPlace = computed(() => this.formState().originPlace);
    readonly residencePlace = computed(() => this.formState().residencePlace);
    readonly application = computed(() => this.formState().application);

    readonly pasoActual = signal<number>(Number(sessionStorage.getItem(CURRENT_STEP_KEY)) || 1);

constructor() {
        // Efecto automático para guardar el estado completo en sessionStorage cuando cambie
        effect(() => {
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(this.formState()));
        });
        
        // Efecto para persistir el paso actual
        effect(() => {
            sessionStorage.setItem(CURRENT_STEP_KEY, this.pasoActual().toString());
        });
    }
    updatePersonalData(data: Partial<PersonalData>) {
        this.formState.update(state => ({
            ...state,
            personalData: {
                ...state.personalData,
                ...data
            }
        }));
    }
    updateOriginPlace(data: Partial<LocationData>) {
        this.formState.update(state => ({
            ...state,
            originPlace: {
                ...state.originPlace,
                ...data
            }
        }));
    }
    updateResidencePlace(data: Partial<LocationData>) {
        this.formState.update(state => ({
            ...state,
            residencePlace: {
                ...state.residencePlace,
                ...data
            }
        }));
    }
    updateApplication(data: Partial<ApplicationData>) {
        this.formState.update(state => ({
            ...state,
            application: {
                ...state.application,
                ...data
            }
        }));
    }
    private loadFromStorage(): EnrollmentAplicationState {
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
}