const handelError = function (err, req, res, next) {
    console.error("server error: ", err);
    if(err.code === '23505'){
        let message = "This data already exists";

        if(err.detail){
            const matches = err.detail.match(/\((.*?)\)=\((.*?)\)/);
            if(matches && matches[2]){
                message = `The ISBN or unique value (${matches[2]}) already exists in our database`;
            }
        }
        return res.status(409).json({
            status: "fail",
            data:{
                message: message,
                constraint: err.constraint
            }
        })
    }
    return res.status(500).json({
        status: "fail",
        data: {
            message: "Internal server error"
        }
    })

}
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

module.exports = { handelError, asyncHandler }