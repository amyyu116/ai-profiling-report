import styles from '../index.module.css';


const Input = ({ input }) => {
    return (<div>
        <h2>Here is the prompt that we fed to the LLM to retrieve your report. This also represents the actions that we have recorded through your time in the Neighborhood simulation!</h2>
        <div className={styles.details}>
            <pre>{input}</pre>
        </div>
    </div>
    )
}
export default Input;