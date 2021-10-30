const User = require("../models/User");
const Post = require("../models/Post");


exports.create = (postData) => Post.create(postData);

exports.findAll = () => Post.find().lean();

exports.getOneById = (id) => Post.findById(id).lean();

exports.findByIdAndUpdate = (id, postData) => Post.findByIdAndUpdate(id, postData);

exports.findByIdAndDelete = (id) => Post.findByIdAndDelete(id);

exports.findAllByuserId = (id) => Post.find({author: id}).lean();

