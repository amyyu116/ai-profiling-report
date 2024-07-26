AI Profiling Website
=======================
This website was built for the profiling portion of the "Spreading Awareness of AI in User Profiling" project conducted at the UnCoRe Cyber-AI REU Summer 2024. This app was built with React, Express, and MongoDB. This website will draw data stored from the project's social media simulation, with a given Prolific ID corresponding to the user/participant, and then prompt a given LLM to profile the user using the data recorded within the simulation.

To run this project, you will need your own MongoDB instance with its own User objects with the correct fields, and access to the Groq & OpenAI APIs. Then, run ``npm run build`` in your root directory, followed by ``node app.js``.

## Acknowledgments 
This work was supported by the NSF grant #CNS-2349663.  Any opinions, findings, and conclusions or recommendations expressed in this work are those of the author(s) and do not necessarily reflect the views of the NSF. Software development occurred under the supervision of Dr. Steven Wilson and Dr. Huirong Fu at Oakland University. Credits to Alexander Simon for the synthetic user profile content.