exports.getErrorMessage = function (errors) {
    // let errorNames = Object.keys(error.message);
    // if (errorNames > 0) {
    //     return error.errors[errorNames[0]];
    // } else {
    //     return error.message;
    // }
    return Object.keys(errors.errors).map(x => errors.errors[x].message);
}