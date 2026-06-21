import {
    minLength,
    pattern,
    required,
} from '@angular/forms/signals';

export function validatePersonalData(schema: any, values: any): void {
    const siTieneDiscapacidad = ({ valueOf }: any) => !!valueOf(schema.isDisability);
    const siTieneEnfermedad = ({ valueOf }: any) => !!valueOf(schema.isCatastrophicIllness);
    const siTieneIdiomaAncestral = ({ valueOf }: any) => !!valueOf(schema.isAncestralLanguage);
    const siTieneIdiomaExtranjero = ({ valueOf }: any) => !!valueOf(schema.isForeignLanguage);
    const siTieneHijos = ({ valueOf }: any) => !!valueOf(schema.isHasChildren);
    const siTieneTrabajo = ({ valueOf }: any) => !!valueOf(schema.isWork);

    // Contacto de emergencia
    required(schema.contactEmergencyKinship, {
        message: 'El parentesco es requerido'
    });
    required(schema.contactEmergencyName, {
        message: 'El nombre del contacto es requerido'
    });
    minLength(schema.contactEmergencyName, 3, {
        message: 'Debe tener al menos 3 caracteres'
    });
    required(schema.contactEmergencyPhone, {
        message: 'El teléfono es requerido'
    });
    pattern(schema.contactEmergencyPhone, /^[0-9]{10}$/, {
        message: 'Debe contener 10 dígitos'
    });

    // Ciudad
    required(schema.town, {
        message: 'La ciudad es requerida'
    });

    // Discapacidad: Evaluamos el valor real extraído del Signal
    required(schema.disabilityType, {
        message: 'El tipo de discapacidad es requerido',
        when: siTieneDiscapacidad
    });
    required(schema.disabilityPercentage, {
        message: 'El porcentaje de discapacidad es requerido',
        when: siTieneDiscapacidad
    });
    pattern(schema.disabilityPercentage, /^(100|[1-9]?[0-9])|^$/, {
        message: 'Ingrese un porcentaje válido entre 0 y 100',
    });

    // Idioma ancestral
    required(schema.ancestralLanguageName, {
        message: 'El idioma ancestral es requerido',
        when: siTieneIdiomaAncestral
    });
    minLength(schema.ancestralLanguageName, 2, {
        message: 'Debe tener al menos 2 caracteres'
    });

    // Enfermedad catastrófica
    required(schema.catastrophicIllness, {
        message: 'La enfermedad catastrófica es requerida',
        when: siTieneEnfermedad
    });
    minLength(schema.catastrophicIllness, 3, {
        message: 'Debe tener al menos 3 caracteres',
    });

    // Idioma extranjero
    required(schema.foreignLanguageName, {
        message: 'El idioma extranjero es requerido',
        when: siTieneIdiomaExtranjero
    });
    minLength(schema.foreignLanguageName, 2, {
        message: 'Debe tener al menos 2 caracteres'
    });

    // Hijos
    required(schema.childrenTotal, {
        message: 'Ingrese el número de hijos',
        when: siTieneHijos
    });
    pattern(schema.childrenTotal, /^[0-9]+$/, {
        message: 'Solo se permiten números'
    });

    // Trabajo
    required(schema.workPosition, {
        message: 'El cargo es requerido',
        when: siTieneTrabajo
    });
    required(schema.workAddress, {
        message: 'La dirección de trabajo es requerida',
        when: siTieneTrabajo
    });
    required(schema.workingHours, {
        message: 'Las horas de trabajo son requeridas',
        when: siTieneTrabajo
    });
    required(schema.monthlySalary, {
        message: 'El salario mensual es requerido',
        when: siTieneTrabajo
    });
    pattern(schema.monthlySalary, /^[0-9]+(\.[0-9]{1,2})?$/, {
        message: 'Ingrese un salario válido'
    });

    // Nacionalidad indígena
    minLength(schema.indigenousNationality, 2, {
        message: 'Debe tener al menos 2 caracteres'
    });

}