import React, { useEffect, useState } from 'react';
import styles from '../index.module.css';
import Input from './Input';
import Output from './Output';
import axios from 'axios';
import { Tabs } from 'antd';

const Report = (props) => {
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchReport = async () => {
            try {
                setReport(null);
                console.log('Fetching report...');
                const response = await axios.post('http://localhost:5000/', {
                    prolificID: props.prolificID,
                    model: props.model
                });
                setReport(response.data);
                setError(null);
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred while fetching the report.');
            }
        };

        fetchReport();
    }, [props.prolificID, props.model]);

    return (<div className={styles.section}>
        {!error && !report && <p>Please wait while we fetch/generate your report...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {report && (
            <>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    items={[
                        {
                            label: `Report`,
                            key: 'Report',
                            children: <div>
                                <Output output={report.report} />
                            </div>,
                        },
                        {
                            label: `Input`,
                            key: 'Input',
                            children:
                                <div>
                                    <Input input={report.input} />
                                </div>,
                        },
                    ]}
                />
            </>)}
    </div>)
}

export default Report;