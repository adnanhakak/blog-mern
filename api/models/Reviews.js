const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ReviewsSchema = new Schema({
    review: {
        type: String, required: true
    },
    rating: {
        type: Number, required: true
    },
    author: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    postId:{
        type:Schema.Types.ObjectId,ref:"Post"
    }
}, { timestamps: true });

const ReviewModel = model('Review', ReviewsSchema);

module.exports = ReviewModel;