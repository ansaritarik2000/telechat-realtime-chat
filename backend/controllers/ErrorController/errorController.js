// this use for set the message in global error handler 
export const  globalerrorHandler =   (error, req, res, next)=>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error'
   if(process.env.NODE_ENV==='development'){
    res.status(error.statusCode).json({
        success: error.status,
        status: error.statusCode,
        message:error.message,
        error:error,
        stackTrace:error.stack

      })
   }
   else if(process.env.NODE_ENV==='production'){
      if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message:error.message
          })
      }
      else{
        res.status(500).json({
            status: "error.statusCode",
            message:"Somthing went wrong try it letter!"
          })
      }
   }
   else{
    res.status(error.statusCode).json({
        success: error.status,
        status: error.statusCode,
        message:error.message
      })
   }
}