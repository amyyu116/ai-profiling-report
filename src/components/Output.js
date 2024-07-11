import styles from '../index.module.css';
import ReactMarkdown from 'react-markdown';

const Output = ({ output }) => {
    const sections = output.split(/\n(?=\*\*)/).map(section => section.trim());

    // isolate gender, age, region guesses
    const genderIndex = sections.findIndex(section => section.startsWith('**Gender:**') || section.startsWith('Gender:'));
    const ageIndex = sections.findIndex(section => section.startsWith('**Age:**') || section.startsWith('Age:'));
    const regionIndex = sections.findIndex(section => section.startsWith('**Region:**' || section.startsWith('Region:')));
    const miscTraitsIndex = sections.findIndex(section => section.startsWith('**Miscellaneous Traits:**' || section.startsWith('Miscellaneous Traits:')));

    // look for explanation
    const gender = sections.slice(genderIndex, ageIndex).join('\n\n').trim();
    const age = sections.slice(ageIndex, regionIndex).join('\n\n').trim();
    const region = sections.slice(regionIndex, miscTraitsIndex).join('\n\n').trim();
    const miscTraits = sections.slice(miscTraitsIndex).join('\n');

    return (
        <div>
            <div className={styles.details}>
                <div>
                    <ReactMarkdown>{gender}</ReactMarkdown>
                </div>
                <div>
                    <ReactMarkdown>{age}</ReactMarkdown>
                </div>
                <div>
                    <ReactMarkdown>{region}</ReactMarkdown>
                </div>
                <div>
                    <ReactMarkdown>{miscTraits}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
export default Output;