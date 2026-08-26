import { Fragment } from 'react'
import { tagMeaning } from '../tags.js'

/** Las insignias con lo que quieren decir, en dos columnas. */
export default function TagGlossary({ tags }) {
    return (
        <dl className='tagGlossary'>
            {tags.map(tag => (
                <Fragment key={tag}>
                    <dt className='tag' data-tag={tag}>{tag}</dt>
                    <dd className='tagGlossary-meaning'>{tagMeaning(tag)}</dd>
                </Fragment>
            ))}
        </dl>
    )
}
