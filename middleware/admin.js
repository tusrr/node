
module.exports = function(req,res,next){

    //403 -- Forbidden , 401 - Unauthorised
    if(!req.user.isAdmin) return res.status(403).send('Access denied !')


    next();
}