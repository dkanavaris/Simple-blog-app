function dependencyInjection(dependency, name){
    
    return function(req , res, next){
        res.locals[name] = dependency;
        next();
    }
}

module.exports = dependencyInjection;