/**
 * La marca del proyecto: un patito de goma. Es el mismo dibujo del favicon;
 * aquí el contorno va en el color del texto para que se lea en los dos modos.
 */
export default function Mark({ size = 26 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            aria-hidden="true"
            focusable="false"
        >
            <g stroke="currentColor" strokeWidth="18" strokeLinejoin="round">
                <path
                    d="M 60 300 C 60 260 120 245 180 262 C 250 282 300 280 340 252 C 380 224 420 190 452 180 C 470 240 470 330 420 384 C 380 428 320 444 250 444 C 140 444 60 400 60 300 Z"
                    fill="#ffd23f"
                />
                <circle cx="200" cy="178" r="108" fill="#ffd23f" />
                <path d="M 104 186 C 70 172 30 182 22 204 C 40 232 90 238 120 222 Z" fill="#f4801f" />
                <path
                    d="M 210 330 C 260 312 330 318 370 300 C 360 360 300 392 240 380 C 210 372 196 344 210 330 Z"
                    fill="#f2b800"
                />
            </g>
            <circle cx="176" cy="150" r="20" fill="#1b1e1f" />
            <circle cx="183" cy="143" r="7" fill="#ffffff" />
        </svg>
    )
}
