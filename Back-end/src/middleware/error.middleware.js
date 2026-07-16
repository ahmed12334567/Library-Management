const handelError = function(err, req, res, next){
    if(err.code = "23505"){
        return res.status(400).json({
            status: "fail",
            data: {
                message: "ISBN is already exists"
            }
        })
    }
    console.error("server error: ", err);
    return res.status(500).json({
        status: "fail",
        data:{
            message: "Internal server error"
        }
    })
    
}
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

module.exports = {handelError, asyncHandler}