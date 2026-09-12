const wrapasyncfn = function wrapasync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}

module.exports = wrapasyncfn;
