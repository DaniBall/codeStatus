import { Fragment } from 'react'
import { tagKind } from '../tags.js'
import { useLang } from '../i18n.js'

/** Las insignias con lo que quieren decir, en dos columnas. */
export default function TagGlossary({ tags }) {
    const { textos } = useLang()
    return (
        <dl className='tagGlossary'>
            {tags.map(tag => (
                <Fragment key={tag}>
                    <dt className='tagGlossary-term'>
                        <span className='tag' data-kind={tagKind(tag)}>
                            {textos.insignias[tag].etiqueta}
                        </span>
                    </dt>
                    <dd className='tagGlossary-meaning'>{textos.insignias[tag].significado}</dd>
                </Fragment>
            ))}
        </dl>
    )
}
