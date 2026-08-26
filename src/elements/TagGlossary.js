import { Fragment } from 'react'
import { tagKind, tagMeaning } from '../tags.js'

/**
 * Las insignias con lo que quieren decir, en dos columnas.
 *
 * Con onFiltrar cada insignia es un botón que filtra el catálogo. Aquí se
 * puede porque la leyenda no cuelga de ningún enlace; en la tarjeta, que entera
 * es un enlace a la ficha, un botón dentro no valdría.
 */
export default function TagGlossary({ tags, activo, onFiltrar }) {
    return (
        <dl className='tagGlossary'>
            {tags.map(tag => (
                <Fragment key={tag}>
                    <dt className='tagGlossary-term'>
                        {onFiltrar ? (
                            <button
                                type='button'
                                className='tag'
                                data-kind={tagKind(tag)}
                                aria-pressed={activo === tag}
                                onClick={() => onFiltrar(tag)}
                            >
                                {tag}
                            </button>
                        ) : (
                            <span className='tag' data-kind={tagKind(tag)}>{tag}</span>
                        )}
                    </dt>
                    <dd className='tagGlossary-meaning'>{tagMeaning(tag)}</dd>
                </Fragment>
            ))}
        </dl>
    )
}
