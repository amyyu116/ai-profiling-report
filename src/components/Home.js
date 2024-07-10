import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [prolificID, setProlificID] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/report/${prolificID}`);
    };

    return (
        <div>
            <h1>AI Profiling Report</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Prolific ID:
                    <input
                        type="text"
                        value={prolificID}
                        onChange={(e) => setProlificID(e.target.value)}
                    />
                </label>
                <button type="submit">Generate Report</button>
            </form>
        </div>
    );
};

export default Home;