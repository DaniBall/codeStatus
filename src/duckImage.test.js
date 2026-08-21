import codeStatus from './status_codes.json';
import duckScenes from './data/duckScenes';
import {
    buildDuckFallback,
    buildDuckImageUrl,
    buildDuckPrompt,
    duckSeed,
    resolveDuckImage,
} from './duckImage';

const allCodes = codeStatus.flatMap(category => category.codes);

describe('escenas de patos', () => {
    test('todos los códigos de estado tienen su escena', () => {
        const sinEscena = allCodes.filter(item => !duckScenes[String(item.code)]);
        expect(sinEscena.map(item => item.code)).toEqual([]);
    });

    test('no hay escenas de más ni escenas repetidas', () => {
        const codigos = allCodes.map(item => String(item.code));
        expect(Object.keys(duckScenes).sort()).toEqual(codigos.sort());

        const escenas = Object.values(duckScenes);
        expect(new Set(escenas).size).toBe(escenas.length);
    });

    test('cada escena menciona patos y pide una foto ultrarrealista', () => {
        allCodes.forEach(item => {
            const prompt = buildDuckPrompt(item.code, item.name);
            expect(prompt).toMatch(/duck/i);
            expect(prompt).toMatch(/ultra realistic photograph/);
            expect(prompt).toContain(`HTTP ${item.code} ${item.name}`);
        });
    });
});

describe('urls generadas', () => {
    test('cada código produce una url https válida y única', () => {
        const urls = allCodes.map(item => buildDuckImageUrl(item.code, item.name));

        urls.forEach(url => {
            const parsed = new URL(url);
            expect(parsed.protocol).toBe('https:');
            expect(parsed.searchParams.get('width')).toBe('768');
            expect(parsed.searchParams.get('height')).toBe('768');
            expect(decodeURIComponent(parsed.pathname)).toMatch(/duck/i);
        });

        expect(new Set(urls).size).toBe(urls.length);
    });

    test('la semilla es estable por código y cambia al pedir otra variante', () => {
        expect(duckSeed(404)).toBe(duckSeed(404));
        expect(duckSeed(404, 1)).not.toBe(duckSeed(404, 0));
        expect(duckSeed(404)).not.toBe(duckSeed(500));
    });

    test('un código desconocido no genera url', () => {
        expect(buildDuckImageUrl(999, 'Nope')).toBeNull();
        expect(buildDuckPrompt(999, 'Nope')).toBeNull();
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

    test('escapa los nombres con caracteres especiales', () => {
        const svg = decodeURIComponent(buildDuckFallback(418, "I'm a <teapot> & proud").split(',')[1]);
        expect(svg).toContain('&apos;');
        expect(svg).toContain('&lt;teapot&gt;');
        expect(svg).not.toMatch(/<teapot>/);
        expect(new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('parsererror')).toBeNull();
    });
});

describe('imágenes fijadas a mano en el JSON', () => {
    const pinned = allCodes.filter(item => item.image);

    test('todas se decodifican y son imágenes reales', () => {
        expect(pinned.length).toBeGreaterThan(0);

        pinned.forEach(item => {
            const match = /^data:image\/(jpeg|jpg|png|webp|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)$/.exec(item.image);
            expect(match).not.toBeNull();

            const bytes = Buffer.from(match[2], 'base64');
            expect(bytes.length).toBeGreaterThan(1024);

            const magic = {
                jpeg: [0xff, 0xd8, 0xff],
                jpg: [0xff, 0xd8, 0xff],
                png: [0x89, 0x50, 0x4e, 0x47],
                gif: [0x47, 0x49, 0x46],
            }[match[1]];

            if (magic) {
                expect([...bytes.subarray(0, magic.length)]).toEqual(magic);
            }
        });
    });

    test('mandan sobre la imagen generada', () => {
        pinned.forEach(item => {
            expect(resolveDuckImage(item)).toEqual({ src: item.image, generated: false });
        });
    });

    test('el resto de códigos se resuelven con una imagen generada', () => {
        allCodes
            .filter(item => !item.image)
            .forEach(item => {
                const { src, generated } = resolveDuckImage(item);
                expect(generated).toBe(true);
                expect(src).toMatch(/^https:\/\//);
            });
    });
});
