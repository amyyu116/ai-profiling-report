import styles from '../index.module.css';

const Input = ({ input }) => {
    return (<div>
        Here are the actions that we have recorded through your time on the Neighborhood simulation! This also makes up the prompt that we fed to the LLM to retrieve your report.
        <div className={styles.details}>
            <pre>{input}</pre>
        </div>
    </div>
    )
}
export default Input;