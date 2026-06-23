import {
    required,
    minLength,
    pattern,
} from '@angular/forms/signals';

export function validateOriginPlace(schema: any, values: any): void {

    // País
    required(schema.country, {
        message: 'El país es requerido'
    });

    minLength(schema.country, 2, {
        message: 'El país debe tener al menos 2 caracteres'
    });

    // Provincia
    required(schema.province, {
        message: 'La provincia es requerida'
    });

    minLength(schema.province, 2, {
        message: 'La provincia debe tener al menos 2 caracteres'
    });

    // Cantón
    required(schema.canton, {
        message: 'El cantón es requerido'
    });

    minLength(schema.canton, 2, {
        message: 'El cantón debe tener al menos 2 caracteres'
    });

    // Parroquia
    required(schema.parish, {
        message: 'La parroquia es requerida'
    });

    minLength(schema.parish, 2, {
        message: 'La parroquia debe tener al menos 2 caracteres'
    });

    // Calle principal
    required(schema.mainStreet, {
        message: 'La calle principal es requerida'
    });

    minLength(schema.mainStreet, 3, {
        message: 'La calle principal debe tener al menos 3 caracteres'
    });

    // Número
    required(schema.number, {
        message: 'El número es requerido'
    });

    pattern(schema.number, /^[0-9]+$/, {
        message: 'El número solo puede contener dígitos'
    });

    // Calle secundaria (opcional pero si escriben validar mínimo)
    minLength(schema.secondaryStreet, 3, {
        message: 'La calle secundaria debe tener al menos 3 caracteres'
    });

    // Referencia (opcional)
    minLength(schema.reference, 3, {
        message: 'La referencia debe tener al menos 3 caracteres'
    });
}