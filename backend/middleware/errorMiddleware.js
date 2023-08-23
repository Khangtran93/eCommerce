const notFound = (req, res, next) => {
    const error = new Error(`URL Not Found - ${req.orignalUrl}`);
    res.status(404);
    next(error)
}

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    // console.log("StatusCode is : ", statusCode)
    let message = err.message;
    // console.log("Error message is : ", message);

    //Check for Mongoose bad objecd id

    if (err.name === "CastError" && err.kind === "ObjectId" ) {
        message = "Resource not Found";
        statusCode = 404;
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? '🐇' : null
})
};

export {notFound, errorHandler};