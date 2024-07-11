import React, { useState } from 'react';
import styles from '../index.module.css';

import { useNavigate } from 'react-router-dom';
import { Input, ConfigProvider } from 'antd';


const Home = () => {
    const [prolificID, setProlificID] = useState('');
    const navigate = useNavigate();
    const { Search } = Input;

    const handleSearch = (value) => {
        setProlificID(value);
        if (value) {
            navigate(`/report/${value}`);
        }
    };

    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        // Primary color for components
                        colorPrimary: '#556b2f',
                    },
                }}
            >
                <div className={styles.header}>
                    <h1>AI Profiling Report</h1>
                    <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                        Welcome! Search your Prolific ID to be redirected to a personalized AI-generated profiling report. <br />
                        <Search
                            placeholder="Enter Prolific ID here"
                            allowClear
                            enterButton="Generate Report"
                            size="large"
                            style={{
                                width: 500,
                                "padding-top": "16px",
                            }}
                            onSearch={handleSearch}
                        />
                    </form>

                </div>
            </ConfigProvider>
        </div>
    );
};

export default Home;