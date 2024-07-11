import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';

import styles from '../index.module.css';
import Input from './Input';
import Output from './Output';
import axios from 'axios';
import { Tabs, ConfigProvider } from 'antd';

const Report = (props) => {
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchReport = async () => {
            try {
                setReport(null);
                console.log('Fetching report...');
                const response = await axiosInstance.post(`/report/${props.prolificID}`, {
                    prolificID: props.prolificID,
                    model: props.model
                });
                setReport(response.data);
                setError(null);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || 'An error occurred while fetching the report.');
            }
        };

        fetchReport();
    }, [props.prolificID, props.model]);

    return (<ConfigProvider
        theme={{
            token: {
                colorPrimary: '#556b2f',
                colorBorder: '#556b2f',
                colorBgContainer: '#f6ffed',
            },
        }}
    >
        <div className={styles.section}>
            {!error && !report && <p>Please wait while we fetch/generate your report...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {report && (
                <>
                    <Tabs
                        defaultActiveKey="1"
                        centered
                        size="large"
                        items={[
                            {
                                label: `Report`,
                                key: 'Report',
                                children: <div>
                                    <h2>Here are the results of your report. We don't promise accuracy, but this is what an LLM has inferred based off of your activity in the simulation.</h2>
                                    <p>You currently have selected the model {props.model === 'gpt-4o' ? 'GPT-4o' : 'Llama3'}.</p>
                                    <Output output={report.report} />
                                </div>,
                            },
                            {
                                label: `Prompt`,
                                key: 'Input',
                                children:
                                    <div>
                                        <Input input={report.input} />
                                    </div>,
                            },
                        ]}
                    />

                </>)}
        </div>
    </ConfigProvider >)
}

export default Report;