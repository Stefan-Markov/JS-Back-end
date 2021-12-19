const User = require("../models/User");
const Publication = require("../models/Publication")

exports.findAll = () => Publication.find().lean();

exports.createPublication = (data) => Publication.create(data);

exports.getOneById = (id) => Publication.findById(id).populate('usersShared').lean();

exports.findOneAndUpdate = (id, data) => Publication.findOneAndUpdate(id, data, {runValidators: true});

exports.findByIdAndDelete = (id) => Publication.findOneAndDelete(id);

exports.sharedPub = (publicationId, userId) => Publication.findByIdAndUpdate({_id: publicationId}, {
    $push: {usersShared: userId},
})

exports.findAllByUserId = (id) => Publication.find({author :id}).populate('usersShared');

exports.findAllShared = (id) => Publication.find({usersShared: id}).lean()