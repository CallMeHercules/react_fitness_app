const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const liftSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    kinesiology_id: {
        type: Number,
        required: true,
    }
}, {
    collection: 'Olympic_Lift' // Explicitly set the collection name
});


module.exports = mongoose.model("Olympic_Lift", liftSchema);