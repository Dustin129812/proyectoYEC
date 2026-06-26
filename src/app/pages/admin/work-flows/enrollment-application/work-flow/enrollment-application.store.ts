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
        effect(() => {
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(this.formState()));
        });
        effect(() => {
            sessionStorage.setItem(CURRENT_STEP_KEY, this.pasoActual().toString());
        });
    }
    updateSection<K extends keyof EnrollmentAplicationState>(
            section: K,
            data: Partial<EnrollmentAplicationState[K]>
        ) {
            this.formState.update(state => ({
                ...state,
                [section]: {
                    ...state[section],
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
        return !(pd && pd.contactEmergencyPhone && pd.contactEmergencyName && pd.town);
    });

    readonly paso2Completo = computed(() => {
        if (!this.paso1Completo()) return false;
        const application = this.application();
        return !(application && application.career && application.parallel);
    });
    setStep(step: number) {
        if (step === 2 && !this.paso1Completo()) return;
        if (step === 3 && !this.paso2Completo()) return;
        this.pasoActual.set(step);
    }
}
