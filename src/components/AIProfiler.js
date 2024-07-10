import React, { useEffect, useState } from 'react';
import styles from '../index.module.css';
import { useParams } from 'react-router-dom';
import Report from './Report';
import { Slider } from 'antd';



const AIProfiler = () => {
    const marks = {
        0: {
            style: {
                color: 'blue',
            },
            label: <strong>0.0</strong>,
        },
        20: '0.2',
        40: '0.4',
        60: '0.6',
        80: '0.8',
        100: {
            style: {
                color: '#f50',
            },
            label: <strong>1.0</strong>,
        },
    };
    const { prolificID } = useParams();
    const [temperature, setTemperature] = useState(0);
    const [model, setModel] = useState("llama3-70b-8192");

    const handleSliderChange = (value) => {
        setTemperature(value / 100);
    };


    // replace gpt-4o in buttons properly once certain of methodology
    return (
        <>
            <h1>Report for Prolific ID: {prolificID}</h1>
            <div className={styles.report}>
                <div className={styles.menu}>
                    Your current model selected is {model === "gpt-4o" ? 'GPT-4o (OpenAI)' : 'Llama3 (Meta)'}.<br />
                    <strong>Models</strong>
                    <button onClick={() => setModel("llama3-70b-8192")}>Llama 3</button>
                    <button onClick={() => setModel("gpt-4o")}>GPT-4o</button>
                </div>
                <Report prolificID={prolificID} model={model} />
            </div>
        </>);
};

export default AIProfiler;