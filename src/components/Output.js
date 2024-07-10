import styles from '../index.module.css';
const Output = ({ output }) => {
    return (<div>
        <br />Here are the results of your report. We don't promise accuracy, but this is what an LLM has inferred based off of your activity in the simulation.
        <div className={styles.details}>
            <pre>{output}</pre>
        </div>
    </div>
    )
}
export default Output;