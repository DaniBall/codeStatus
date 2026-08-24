/**
 * La marca del proyecto: el interrogante cuyo punto es la cabeza de un pato.
 * Es el mismo dibujo del favicon y de la previsualización, aquí en el color
 * del texto para que sirva en los dos modos.
 */
export default function Mark({ size = 22 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="M 152 164 a 104 104 0 1 1 104 104 v 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="80"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="256" cy="424" r="68" fill="currentColor" />
            <path d="M 316 400 L 428 424 L 316 448 Z" fill="#f4801f" />
        </svg>
    )
}
