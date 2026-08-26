import codeStatus from './status_codes.json';
import en from './data/textos.en.json';
import es from './data/textos.es.json';
import codigosEs from './data/codigos.es.json';
import { catalogoEn, idiomaDelNavegador, rellenar, DISPONIBLES } from './i18n';

const allCodes = codeStatus.flatMap(category => category.codes);

describe('idioma del navegador', () => {
    test('reconoce el español venga como venga', () => {
        ['es', 'es-ES', 'es_MX', 'ES-es'].forEach(etiqueta => {
            expect(idiomaDelNavegador({ languages: [etiqueta] })).toBe('es');
        });
    });

    test('un idioma que no tenemos cae en inglés', () => {
        expect(idiomaDelNavegador({ languages: ['fr-FR', 'de'] })).toBe('en');
        expect(idiomaDelNavegador({})).toBe('en');
    });

    test('respeta el orden de preferencia del navegador', () => {
        // Si pide francés primero y español después, el que tenemos es español.
        expect(idiomaDelNavegador({ languages: ['fr', 'es-AR'] })).toBe('es');
        expect(idiomaDelNavegador({ languages: ['en-GB', 'es'] })).toBe('en');
    });

    test('vale con navigator.language si no hay lista', () => {
        expect(idiomaDelNavegador({ language: 'es-ES' })).toBe('es');
    });
});

describe('plantillas', () => {
    test('rellena los huecos y deja en paz lo que no se pasa', () => {
        expect(rellenar('{n} de {total}', { n: 3, total: 85 })).toBe('3 de 85');
        expect(rellenar('{n} códigos', {})).toBe('{n} códigos');
    });
});

describe('traducciones completas', () => {
    test('los dos idiomas tienen exactamente las mismas claves', () => {
        // Una clave de menos en un idioma es un texto en inglés colado en medio
        // de la web en español, y de esos no avisa nadie.
        const claves = objeto => Object.keys(objeto).sort();
        expect(claves(es.ui)).toEqual(claves(en.ui));
        expect(claves(es.categorias)).toEqual(claves(en.categorias));
        expect(claves(es.insignias)).toEqual(claves(en.insignias));
    });

    test('ninguna cadena se ha quedado vacía', () => {
        [en, es].forEach(idioma => {
            Object.entries(idioma.ui).forEach(([clave, valor]) => {
                expect(typeof valor).toBe('string');
                expect(valor.trim()).not.toBe('');
            });
        });
    });

    test('los huecos de las plantillas coinciden entre idiomas', () => {
        // Traducir "{n} of {total}" y dejarse el {total} deja un número fuera.
        const huecos = cadena => (String(cadena).match(/\{\w+\}/g) || []).sort();
        Object.keys(en.ui).forEach(clave => {
            expect(huecos(es.ui[clave])).toEqual(huecos(en.ui[clave]));
        });
    });

    test('los 85 códigos están traducidos', () => {
        allCodes.forEach(item => {
            const suyo = codigosEs[String(item.code)];
            expect(suyo?.description).toBeTruthy();
        });
    });

    test('las notas están traducidas, y no sobra ninguna', () => {
        const conNota = allCodes.filter(item => item.note).map(item => String(item.code));
        conNota.forEach(code => expect(codigosEs[code].note).toBeTruthy());

        const notasEs = Object.keys(codigosEs).filter(code => codigosEs[code].note);
        expect(notasEs.sort()).toEqual(conNota.sort());
    });

    test('no sobra ningún código en el fichero español', () => {
        const reales = new Set(allCodes.map(item => String(item.code)));
        Object.keys(codigosEs).forEach(code => expect(reales.has(code)).toBe(true));
    });

    test('el español no se ha quedado copiado del inglés', () => {
        // Un descuido fácil: copiar el fichero y traducir sólo la mitad.
        const iguales = allCodes.filter(
            item => codigosEs[String(item.code)].description === item.description
        );
        expect(iguales).toEqual([]);
    });
});

describe('catálogo traducido', () => {
    test('en inglés devuelve el catálogo tal cual', () => {
        expect(catalogoEn('en')).toBe(codeStatus);
    });

    test('en español cambia el texto pero no la estructura', () => {
        const español = catalogoEn('es');
        expect(español.map(c => c.family)).toEqual(codeStatus.map(c => c.family));

        const original = codeStatus.flatMap(c => c.codes);
        const traducido = español.flatMap(c => c.codes);
        expect(traducido.map(i => i.code)).toEqual(original.map(i => i.code));

        // El nombre del código no se traduce: es lo que devuelve el protocolo.
        expect(traducido.map(i => i.name)).toEqual(original.map(i => i.name));
        // Lo demás que define al código tampoco se toca.
        expect(traducido.map(i => i.spec)).toEqual(original.map(i => i.spec));
        expect(traducido.map(i => JSON.stringify(i.tags))).toEqual(
            original.map(i => JSON.stringify(i.tags))
        );
    });

    test('en español la descripción viene del fichero español', () => {
        const porCodigo = new Map(catalogoEn('es').flatMap(c => c.codes).map(i => [i.code, i]));
        expect(porCodigo.get(404).description).toBe(codigosEs['404'].description);
        expect(porCodigo.get(404).description).toMatch(/recurso/i);
    });

    test('las familias también se traducen', () => {
        const español = catalogoEn('es');
        expect(español.find(c => c.family === 'wild').category).toBe('En la práctica');
        expect(español[0].categoryDescription).toBe(es.categorias['1'].descripcion);
    });

    test('los idiomas disponibles son los que hay', () => {
        expect(DISPONIBLES).toEqual(['en', 'es']);
    });
});
