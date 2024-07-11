import React, { useState } from 'react';
import styles from '../index.module.css';
import { useParams } from 'react-router-dom';
import Report from './Report';
import { Button } from 'antd';



const AIProfiler = () => {
    const { prolificID } = useParams();
    const [model, setModel] = useState("gpt-4o");

    return (
        <>

            <div className={styles.header}>
                <h1>Report for Prolific ID: {prolificID}</h1>
            </div>
            <div className={styles.report}>

                <div className={styles.menu}>
                    Select an LLM here.<br />
                    <strong>Models</strong>
                    <div>
                        <Button
                            type="text"
                            className={`${styles.Button} ${model === "gpt-4o" ? styles.selected : styles.deselected}`}
                            size="large"
                            onClick={() => setModel("gpt-4o")}>GPT-4o</Button>
                    </div>

                    <div>
                        <Button
                            type="text"
                            className={`${styles.Button} ${model === "llama3-70b-8192" ? styles.selected : styles.deselected}`}
                            size="large"
                            onClick={() => setModel("llama3-70b-8192")}>Llama 3</Button>
                    </div>

                </div>
                <Report prolificID={prolificID} model={model} />
            </div>
        </>);
};

export default AIProfiler;