import codeStatus from './status_codes.json';
import { countCodes, filterCatalogue, matchesQuery } from './search';

const TOTAL = countCodes(codeStatus);

test('sin texto no filtra nada', () => {
    expect(filterCatalogue(codeStatus, '')).toBe(codeStatus);
    expect(countCodes(filterCatalogue(codeStatus, '   '))).toBe(TOTAL);
});

test('busca por número', () => {
    const encontrado = filterCatalogue(codeStatus, '404');
    expect(countCodes(encontrado)).toBe(1);
    expect(encontrado[0].codes[0].name).toBe('Not Found');
});

test('un número parcial trae toda la familia', () => {
    const encontrado = filterCatalogue(codeStatus, '41');
    const codigos = encontrado.flatMap(c => c.codes).map(c => c.code);
    expect(codigos).toEqual(expect.arrayContaining([410, 411, 412, 413, 414, 415, 416, 417, 418, 419]));
});

test('busca por nombre, sin distinguir mayúsculas', () => {
    const codigos = filterCatalogue(codeStatus, 'TIMEOUT').flatMap(c => c.codes).map(c => c.code);
    expect(codigos).toEqual(expect.arrayContaining([408, 504, 524, 598, 599]));
});

test('la puntuación no estorba', () => {
    // 440 es "Login Time-out": con guion, "timeout" no lo encontraría.
    expect(filterCatalogue(codeStatus, 'timeout').flatMap(c => c.codes).map(c => c.code)).toContain(440);
    // 418 es "I'm a teapot"
    expect(filterCatalogue(codeStatus, 'im a teapot').flatMap(c => c.codes).map(c => c.code)).toEqual([418]);
    // Y al revés: escribirlo con puntuación tampoco rompe
    expect(filterCatalogue(codeStatus, "I'm a teapot").flatMap(c => c.codes).map(c => c.code)).toEqual([418]);
});

test('busca por procedencia', () => {
    const encontrado = filterCatalogue(codeStatus, 'nginx');
    expect(countCodes(encontrado)).toBe(6);
    expect(encontrado).toHaveLength(1);
    expect(encontrado[0].family).toBe('wild');
});

test('busca también dentro de la descripción', () => {
    const codigos = filterCatalogue(codeStatus, 'csrf').flatMap(c => c.codes).map(c => c.code);
    expect(codigos).toEqual([419]);
});

test('con varias palabras tienen que aparecer todas', () => {
    const una = countCodes(filterCatalogue(codeStatus, 'server'));
    const dos = countCodes(filterCatalogue(codeStatus, 'server down'));
    expect(dos).toBeLessThan(una);
    expect(filterCatalogue(codeStatus, 'server down').flatMap(c => c.codes).map(c => c.code)).toEqual([521]);
});

test('quita las secciones que se quedan vacías', () => {
    const encontrado = filterCatalogue(codeStatus, 'cloudflare');
    expect(encontrado).toHaveLength(1);
    encontrado.forEach(category => expect(category.codes.length).toBeGreaterThan(0));
});

test('algo que no existe no devuelve nada', () => {
    expect(filterCatalogue(codeStatus, 'zzzznope')).toEqual([]);
    expect(countCodes(filterCatalogue(codeStatus, 'zzzznope'))).toBe(0);
});

test('no toca el catálogo original', () => {
    const antes = JSON.stringify(codeStatus);
    filterCatalogue(codeStatus, 'nginx');
    expect(JSON.stringify(codeStatus)).toBe(antes);
});

test('matchesQuery aguanta un código sin procedencia', () => {
    expect(matchesQuery({ code: 200, name: 'OK', description: 'The request succeeded.' }, 'ok')).toBe(true);
});
