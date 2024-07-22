AI Profiling Website
=======================
This website was built for the profiling portion of the "Spreading Awareness of AI in User Profiling" project conducted at the UnCoRe Cyber-AI REU Summer 2024. This app was built with React, Express, and MongoDB. This website will draw data stored from the project's social media simulation, with a given Prolific ID corresponding to the user/participant, and then prompt a given LLM to profile the user using the data recorded within the simulation.

To run this project, you will need your own MongoDB instance with its own User objects with the correct fields, and access to the Groq & OpenAI APIs. Then, run ``npm run build`` in your root directory, followed by ``node app.js``.