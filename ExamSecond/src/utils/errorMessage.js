exports.getErrorMessage = function (errors) {

    return Object.keys(errors.errors).map(x => errors.errors[x].message);
}