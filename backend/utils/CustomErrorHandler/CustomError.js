
// Handlling the global error In custmize way 
class CustomError extends Error{
    constructor(message,statusCode){
        super(message) ;
        this.statusCode = statusCode;
        this.status = statusCode>=400 && statusCode< 500 ? 'failed': 'error';

        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}
 
export { CustomError };

// const error = new CustomError() 5 server clint 4