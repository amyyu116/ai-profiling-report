const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new mongoose.Schema({
    user: { type: Schema.ObjectId, ref: 'User' }, // reference to user
    prolificID: String,
    model: String, // identifies model used for report
    temperature: Number, // specifies temperature
    input: String, // stores the prompt we gave the model
    report: String, // stores the result of the report in full text format
    results: [ // stores the results/stats of the report
        new Schema({
            metric: String, // attribute
            guess: String, // the model's guess
            accuracy: { type: String, default: '' }, // correctness
        }, { versionKey: false })
    ]
}, { versionKey: false });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;