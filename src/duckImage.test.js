import fs from 'fs';
import path from 'path';
import codeStatus from './status_codes.json';
import duckData from './data/duckScenes.json';
import { buildDuckFallback, duckImagePath, getDuckScene, resolveDuckImage } from './duckImage';
import { specUrl } from './spec';
import { TAGS } from './tags';
import en from './data/textos.en.json';
import es from './data/textos.es.json';
import codigosEs from './data/codigos.es.json';

const allCodes = codeStatus.flatMap(category => category.codes);

describe('catálogo de códigos', () => {
    test('las familias oficiales están completas según el registro de IANA', () => {
        const oficiales = {
            '1xx': [100, 101, 102, 103],
            '2xx': [200, 201, 202, 203, 204, 205, 206, 207, 208, 226],
            '3xx': [300, 301, 302, 303, 304, 305, 306, 307, 308],
            '4xx': [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412,
                413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451],
            '5xx': [500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511],
        };
        Object.entries(oficiales).forEach(([nombre, esperados]) => {
            const familia = codeStatus.find(cat => cat.category === nombre);
            expect(familia.codes.map(item => item.code)).toEqual(esperados);
        });
    });

    test('cada familia declara la suya, sin repetirse', () => {
        const familias = codeStatus.map(cat => cat.family);
        expect(familias).toEqual(['1', '2', '3', '4', '5', 'wild']);
    });

    test('no hay códigos repetidos entre secciones', () => {
        const codigos = allCodes.map(item => item.code);
        expect(new Set(codigos).size).toBe(codigos.length);
    });
});

describe('códigos no oficiales', () => {
    const wild = codeStatus.find(cat => cat.family === 'wild').codes;

    test('todos dicen de dónde salen y adónde ir a leer más', () => {
        expect(wild.length).toBeGreaterThan(0);
        wild.forEach(item => {
            expect(item.source).toBeTruthy();
            expect(item.docsLabel).toBeTruthy();
            expect(() => new URL(item.docs)).not.toThrow();
            expect(new URL(item.docs).protocol).toBe('https:');
        });
    });

    test('ninguno apunta a MDN, que no los documenta', () => {
        wild.forEach(item => {
            expect(item.docs).not.toMatch(/developer\.mozilla\.org/);
        });
    });

    test('los oficiales no llevan procedencia: la suya es el estándar', () => {
        codeStatus
            .filter(cat => cat.family !== 'wild')
            .flatMap(cat => cat.codes)
            .forEach(item => {
                expect(item.source).toBeUndefined();
                expect(item.docs).toBeUndefined();
            });
    });
});

describe('estado y especificación de cada código', () => {
    const oficiales = codeStatus
        .filter(cat => cat.family !== 'wild')
        .flatMap(cat => cat.codes);

    test('todos los oficiales dicen qué RFC los define', () => {
        oficiales.forEach(item => {
            expect(item.spec).toMatch(/^RFC \d+$/);
            expect(specUrl(item.spec)).toBe(
                `https://www.rfc-editor.org/rfc/rfc${item.spec.slice(4)}`
            );
        });
    });

    test('los no oficiales no inventan un RFC: no lo tienen', () => {
        codeStatus
            .find(cat => cat.family === 'wild')
            .codes.forEach(item => expect(item.spec).toBeUndefined());
    });

    test('las insignias salen de una lista corta y conocida', () => {
        // Abierta a mano: una etiqueta suelta y mal escrita se quedaría sin
        // estilo y sin significar nada.
        const validas = TAGS;
        allCodes.forEach(item => {
            if (!item.tags) return;
            expect(Array.isArray(item.tags)).toBe(true);
            expect(new Set(item.tags).size).toBe(item.tags.length);
            item.tags.forEach(tag => expect(validas).toContain(tag));
        });
    });

    test('toda insignia explica qué quiere decir, en los dos idiomas', () => {
        // Sin esto se puede colar una etiqueta nueva que en la ficha saldría
        // muda, que es justo lo que se venía a arreglar.
        const usadas = new Set(allCodes.flatMap(item => item.tags || []));
        expect(usadas.size).toBeGreaterThan(0);
        usadas.forEach(tag => {
            [en, es].forEach(idioma => {
                const insignia = idioma.insignias[tag];
                expect(insignia?.etiqueta).toBeTruthy();
                expect(insignia?.significado).toBeTruthy();
                expect(insignia.significado.split(/\s+/).length).toBeLessThanOrEqual(16);
            });
        });
    });

    test('no sobra ningún significado sin insignia que lo use', () => {
        const usadas = new Set(allCodes.flatMap(item => item.tags || []));
        [en, es].forEach(idioma => {
            Object.keys(idioma.insignias).forEach(tag => expect(usadas.has(tag)).toBe(true));
        });
    });

    test('los códigos retirados están marcados', () => {
        const porCodigo = new Map(allCodes.map(item => [item.code, item]));
        expect(porCodigo.get(102).tags).toContain('Deprecated');
        expect(porCodigo.get(305).tags).toContain('Deprecated');
        expect(porCodigo.get(510).tags).toContain('Deprecated');
        expect(porCodigo.get(306).tags).toContain('Reserved');
        expect(porCodigo.get(418).tags).toContain('Joke');
        expect(porCodigo.get(425).tags).toContain('Experimental');
    });

    test('las respuestas sin cuerpo son exactamente esas', () => {
        const sinCuerpo = allCodes
            .filter(item => item.tags?.includes('No body'))
            .map(item => item.code);
        expect(sinCuerpo).toEqual([100, 101, 102, 103, 204, 205, 304]);
    });

    test('toda insignia de aviso viene explicada', () => {
        // La insignia dice que pasa algo; sin la nota, el lector no sabe qué.
        const avisos = ['Deprecated', 'Experimental', 'Reserved', 'Joke'];
        allCodes
            .filter(item => item.tags?.some(tag => avisos.includes(tag)))
            .forEach(item => expect(item.note).toBeTruthy());
    });

    test('usa los nombres de RFC 9110, no los antiguos', () => {
        const porCodigo = new Map(allCodes.map(item => [item.code, item]));
        expect(porCodigo.get(413).name).toBe('Content Too Large');
        expect(porCodigo.get(422).name).toBe('Unprocessable Content');
        // Y se avisa del nombre viejo, que es el que sigue saliendo por ahí.
        expect(porCodigo.get(413).note).toMatch(/Payload Too Large/);
        expect(porCodigo.get(422).note).toMatch(/Unprocessable Entity/);
    });
});

describe('escenas de patos', () => {
    test('todos los códigos tienen escena, sin sobrantes ni repetidas', () => {
        const codigos = allCodes.map(item => String(item.code));
        expect(Object.keys(duckData.scenes).sort()).toEqual([...codigos].sort());

        const escenas = Object.values(duckData.scenes);
        expect(new Set(escenas).size).toBe(escenas.length);
    });

    test('cada escena habla de patos', () => {
        allCodes.forEach(item => {
            expect(getDuckScene(item.code)).toMatch(/duck/i);
        });
    });

    test('las escenas son detalladas pero acotadas', () => {
        // Detalle concreto (escenario, luz, qué se ve) sí; adjetivos apilados
        // no. Pasado cierto largo el modelo empieza a ignorar la mitad, que es
        // lo que hacía que no se entendiera de qué código hablaban.
        Object.entries(duckData.scenes).forEach(([code, scene]) => {
            const palabras = scene.split(/\s+/).length;
            expect(palabras).toBeGreaterThanOrEqual(12);
            expect(palabras).toBeLessThanOrEqual(35);
        });
    });

    test('ninguna escena pide que el pato manipule algo', () => {
        // Un pato tiene alas, no manos: pedirle que sujete o pulse algo es de
        // donde salen los picos torcidos y las patas de más.
        const manos = /\b(holding|holds|carrying|handing|dialling|pressing|shining|inspecting)\b/i;
        Object.entries(duckData.scenes).forEach(([code, scene]) => {
            expect(scene).not.toMatch(manos);
        });
    });
});

describe('rutas de las fotos pregeneradas', () => {
    test('cada código apunta a su fichero en public/ducks', () => {
        expect(duckImagePath(404)).toBe('/ducks/404.jpg');

        const rutas = allCodes.map(item => duckImagePath(item.code));
        expect(new Set(rutas).size).toBe(rutas.length);
    });

    test('los códigos con escena se resuelven a la foto pregenerada', () => {
        allCodes.forEach(item => {
            expect(resolveDuckImage(item)).toEqual({
                src: `/ducks/${item.code}.jpg`,
                pregenerada: true,
            });
        });
    });

    test('un código sin escena cae en el pato dibujado', () => {
        const { src, pregenerada } = resolveDuckImage({ code: 999, name: 'Nope' });
        expect(pregenerada).toBe(false);
        expect(src).toMatch(/^data:image\/svg\+xml/);
    });
});

describe('pato de respaldo', () => {
    test('es un svg válido y sin red para todos los códigos', () => {
        allCodes.forEach(item => {
            const uri = buildDuckFallback(item.code, item.name);
            expect(uri.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);

            const svg = decodeURIComponent(uri.split(',')[1]);
            const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
            expect(doc.querySelector('parsererror')).toBeNull();
            expect(doc.documentElement.tagName).toBe('svg');
            expect(svg).not.toMatch(/https?:\/\/(?!www\.w3\.org)/);
        });
    });

    test('los colores del SVG son los mismos que los del CSS, en ambos modos', () => {
        const css = fs.readFileSync(path.join(__dirname, 'App.css'), 'utf8');
        // El bloque claro es el primero; el oscuro, el de [data-theme="dark"].
        const bloques = {
            light: css.slice(css.indexOf(':root{'), css.indexOf('@media (prefers-color-scheme: dark)')),
            dark: css.slice(css.indexOf(':root[data-theme="dark"]{')),
        };
        const familias = { '1': 'f1', '2': 'f2', '3': 'f3', '4': 'f4', '5': 'f5', wild: 'fw' };

        Object.entries(bloques).forEach(([modo, bloque]) => {
            Object.entries(familias).forEach(([familia, token]) => {
                const acento = new RegExp(`--${token}: (#[0-9a-f]{6}); --${token}-soft: (#[0-9a-f]{6});`).exec(bloque);
                expect(acento).not.toBeNull();

                const svg = decodeURIComponent(
                    buildDuckFallback(404, 'Not Found', familia, modo).split(',')[1]
                );
                expect(svg).toContain(acento[1]);
                expect(svg).toContain(acento[2]);
            });
        });
    });

    test('cada modo pinta distinto', () => {
        const claro = buildDuckFallback(404, 'Not Found', '4', 'light');
        const oscuro = buildDuckFallback(404, 'Not Found', '4', 'dark');
        expect(claro).not.toEqual(oscuro);
    });

    test('usa el color de la familia, no el del primer dígito', () => {
        // El 521 es un número 5xx, pero vive en "In the wild" y va en su color.
        const wild = decodeURIComponent(buildDuckFallback(521, 'Web Server Is Down', 'wild').split(',')[1]);
        const quinientos = decodeURIComponent(buildDuckFallback(521, 'Web Server Is Down', '5').split(',')[1]);
        expect(wild).toContain('#0a5f77');
        expect(wild).not.toEqual(quinientos);
    });

    test('escapa los nombres con caracteres especiales', () => {
        const svg = decodeURIComponent(buildDuckFallback(418, "I'm a <teapot> & proud").split(',')[1]);
        expect(svg).toContain('&apos;');
        expect(svg).toContain('&lt;teapot&gt;');
        expect(new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('parsererror')).toBeNull();
    });
});

describe('fotos ya generadas en public/ducks', () => {
    const dir = path.join(__dirname, '..', 'public', 'ducks');
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.jpg')) : [];

    test('las que haya corresponden a códigos reales y son JPEG válidos', () => {
        const codigos = new Set(allCodes.map(item => String(item.code)));

        files.forEach(file => {
            expect(codigos.has(path.basename(file, '.jpg'))).toBe(true);

            const bytes = fs.readFileSync(path.join(dir, file));
            expect(bytes.length).toBeGreaterThan(2048);
            expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
        });
    });
});
