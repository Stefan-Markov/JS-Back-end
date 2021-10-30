const Housing = require('../models/Housing');

exports.create = (housingData) => Housing.create(housingData);

exports.getAll = () => Housing.find().lean();

exports.getOne = (housingId) => Housing.findById(housingId).populate('tenants');

exports.getTop3 = () => Housing.find().sort({createdAt: -1}).limit(3).lean();

exports.addTenant = async (housingId, tenantId) => {
    return Housing.findOneAndUpdate({_id: housingId}, {
        $push: {tenants: tenantId},
        $inc: {availablePieces: -1}
    }, {runValidators: true});
};

exports.deleteById = (housingId) => Housing.findByIdAndDelete(housingId);

exports.updateOne = (id, body) => Housing.findByIdAndUpdate(id, body);

exports.getSearch = (text) => Housing.find({type: {$regex: text || '',$options: 'i'}}).lean();

// {$regex: text,$options: 'i'}}