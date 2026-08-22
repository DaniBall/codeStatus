import fs from 'fs';
import path from 'path';
import codeStatus from './status_codes.json';
import duckData from './data/duckScenes.json';
import { buildDuckFallback, duckImagePath, getDuckScene, resolveDuckImage } from './duckImage';

const allCodes = codeStatus.flatMap(category => category.codes);

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

    test('las escenas son cortas: un prompt largo se entiende peor', () => {
        Object.entries(duckData.scenes).forEach(([code, scene]) => {
            expect(scene.split(/\s+/).length).toBeLessThanOrEqual(20);
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
