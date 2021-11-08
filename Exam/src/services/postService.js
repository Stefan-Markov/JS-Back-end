const User = require("../models/User");
const Post = require("../models/Post");

exports.create = (postData) => Post.create(postData);

exports.findAll = () => Post.find().lean();

exports.getOneById = (id) => Post.findById(id).populate('author').lean();

exports.getPostById = (id) => Post.findById(id);

exports.findByIdAndUpdate = (id, postData) => Post.findByIdAndUpdate(id, postData, {runValidators: true});

exports.findByIdAndDelete = (id) => Post.findByIdAndDelete(id);

exports.findAllByuserId = (id) => Post.find({author: id}).populate('votes').lean();

exports.voteUp = (postId, userId) => Post.findOneAndUpdate({_id: postId}, {
    $push: {votes: userId},
    $inc: {rating: +1}
});

exports.voteDown = (postId, userId) => Post.findOneAndUpdate({_id: postId}, {
    $push: {votes: userId},
    $inc: {rating: -1}
});

exports.findByIdUsersVoted = (id) => Post.findById(id).populate('votes');
