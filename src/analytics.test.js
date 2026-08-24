import { noQuiereRastreo, seDebeContar } from './analytics';

describe('cuándo se cuenta una visita', () => {
    const base = { endpoint: 'https://x.goatcounter.com/count', entorno: 'production', rechaza: false };

    test('sólo con endpoint configurado', () => {
        expect(seDebeContar(base)).toBe(true);
        expect(seDebeContar({ ...base, endpoint: '' })).toBe(false);
    });

    test('nunca en desarrollo ni en las pruebas', () => {
        expect(seDebeContar({ ...base, entorno: 'development' })).toBe(false);
        expect(seDebeContar({ ...base, entorno: 'test' })).toBe(false);
    });

    test('nunca si el navegador pide que no se le rastree', () => {
        expect(seDebeContar({ ...base, rechaza: true })).toBe(false);
    });

    test('por defecto, en las pruebas, está apagado', () => {
        expect(seDebeContar()).toBe(false);
    });
});

describe('señal de no rastrear', () => {
    test('reconoce las formas que usan los navegadores', () => {
        expect(noQuiereRastreo({ doNotTrack: '1' })).toBe(true);
        expect(noQuiereRastreo({ doNotTrack: 'yes' })).toBe(true);
        expect(noQuiereRastreo({ msDoNotTrack: '1' })).toBe(true);
    });

    test('sin señal, no la inventa', () => {
        expect(noQuiereRastreo({})).toBe(false);
        expect(noQuiereRastreo({ doNotTrack: '0' })).toBe(false);
        expect(noQuiereRastreo({ doNotTrack: 'unspecified' })).toBe(false);
    });
});
