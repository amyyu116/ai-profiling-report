const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const Report = require('./models/Report.js');
const cors = require('cors');
const OpenAI = require("openai");
const path = require('path');


dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
    process.exit(1);
});


async function userToPrompt(user) {
    let prompt = `The user you are profiling is someone with the username ${user.username}.\n\n`;
    prompt += `${user.profile.name ? `Their display name on their profile is ${user.profile.name}. ` : ''}`;
    prompt += `${user.profile.location ? `Their location on their profile is ${user.profile.location}. ` : ''}`;
    prompt += `${user.profile.bio ? `Their bio on their profile is "${user.profile.bio}". ` : ''}`;
    if (user.profile.topics.length > 0) {
        const interests = user.profile.topics.join(', ');
        prompt += `${interests ? `They have listed on their profile that they are interested in seeing posts about ${interests}` : 'They have left the "interests" field on their profile blank.'}.\n\n`;
    }
    const userInteractions = ['blocked', 'reported', 'followed'];
    for (const interaction of userInteractions) {
        if (user[interaction].length > 0) {
            const users = user[interaction].join(', ');
            prompt += `\nOver their time on the social media simulation, they have ${interaction} the following users: ${users}.\n`;
        }
    }
    prompt += `During their time spent on the social media simulation, they have made ${user.numPosts + 1} post(s) on the platform.\n`;
    let postNumber = 1;
    user.posts.reverse().forEach(post => {
        prompt += `Post ${postNumber}: "${post.body}"\n`;
        if (post.comments && post.comments.length > 0) {
            let userComments = post.comments.filter((comment) => (!comment.actor));
            if (userComments.length > 0) {
                prompt += "On this post, they made the following comments: \n"
                userComments.forEach(comment => {
                    prompt += `  - ${comment.body}\n`;
                });
            }
        }
        ++postNumber;
        prompt += `\n`;
    });
    const actions = {
        posts: { flagged: [], liked: [] },
        comments: { flagged: [], liked: [] }
    };
    const comments = [];

    for (const post of user.feedAction) {
        if (post.liked) {
            const likedPost = await db.collection('scripts').findOne({ _id: post.post });
            const actor = await db.collection('actors').findOne({ _id: likedPost.actor });
            actions.posts.liked.push({ body: likedPost.body, actor: actor.username });
        }
        if (post.flagged) {
            const flaggedPost = await db.collection('scripts').findOne({ _id: post.post });
            const actor = await db.collection('actors').findOne({ _id: flaggedPost.actor });
            actions.posts.flagged.push({ body: flaggedPost.body, actor: actor.username });
        }
        if (post.comments.length > 0) {
            for (const comment of post.comments) {
                const commentedPost = await db.collection('scripts').findOne({ _id: post.post });
                const actor = await db.collection('actors').findOne({ _id: commentedPost.actor });
                comments.push({ body: commentedPost.body, actor: actor.username, response: comment.body });
            }
        }
    }

    for (const item in actions) {
        for (const action in actions[item]) {
            if (actions[item][action].length === 0) {
                prompt += `During their time spent on the social media simulation, they ${action} zero ${item}.\n`;
            } else {
                prompt += `During their time spent on the social media simulation, they ${action} the following ${item}:\n`;
                actions[item][action].forEach(post => {
                    prompt += `- "${post.body.replace(/\n/g, "")}" (written by ${post.actor})\n`;
                });
                prompt += `\n`;
            }
        }
    }

    if (comments.length > 0) {
        prompt += 'They have also written comments in response to the posts of other social media users:\n';
        comments.forEach(comment => {
            prompt += `In response to a social media post saying "${comment.body}" (written by ${comment.actor}):\n`
            prompt += `user wrote: "${comment.response}" \n\n`;
        });
    }

    return prompt;
}

async function profile(prompt, model = "llama3-70b-8192") {
    if (model == "llama3-70b-8192") {
        const chatCompletion = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: ("You are an expert investigator familiar with social media behaviors. Your job is to " +
                        "provide as many details of the user as you can given details of their behavior in a day of scrolling. " +
                        "In particular, provide a guess for their gender, age, and a general idea of what region of the US they may be from." +
                        "Additionally, provide a paragraph of any other miscellaneous traits you may think of the user given their online behavior." +
                        "Each of these attributes should be separated by a new-line and each section labeled (ex., '**Age:** '). Please explain your reasoning in order to arrive at the most logical and holistic conclusion.")
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "llama3-70b-8192",
            temperature: 0.25,
        });
        return chatCompletion.choices[0].message.content;
    } else if (model == 'gpt-4o') {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: ("You are an expert investigator familiar with social media behaviors. Your job is to " +
                        "provide as many details of the user as you can given details of their behavior in a day of scrolling. " +
                        "In particular, provide a guess for their gender, age, and a general idea of what region of the US they may be from." +
                        "Additionally, provide a paragraph of any other miscellaneous traits you may think of the user given their online behavior." +
                        "Each of these attributes should be separated by a new-line and each section labeled (ex., '**Age:** '). Please explain your reasoning in order to arrive at the most logical and holistic conclusion.")
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "gpt-4o",
            temperature: 0.25,
        });
        return completion.choices[0].message.content;
    }
}

async function generateReport(userDocument, id, model) {
    const prompt = await userToPrompt(userDocument);
    const modelOutput = await profile(prompt, model);
    const reportDetails = {
        user: userDocument,
        prolificID: id,
        model: model,
        input: prompt,
        report: modelOutput,
        results: [],
    };

    const report = new Report(reportDetails);
    await report.save();
    return reportDetails;
}


app.post(`/report/:prolificID`, async (req, res) => {
    const prolificId = req.body.prolificID;
    let model = null;
    if (req.body.model) {
        model = req.body.model;
    };

    try {

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        const reportsCollection = db.collection('reports');
        const userDocument = await usersCollection.findOne({ "mturkID": prolificId });

        if (!userDocument) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        let reportDocument = await reportsCollection.findOne({
            "prolificID": prolificId,
            "model": model
        });

        if (!reportDocument) {
            let newReport = await generateReport(userDocument, prolificId, model);
            reportDocument = newReport;
        }

        res.json(reportDocument);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'An error occurred while fetching the report.' });
    }
});

app.use(express.static(path.join(__dirname, 'build')));


// Serve the React application for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});