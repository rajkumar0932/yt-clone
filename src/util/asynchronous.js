// const asyncHandler = (fn) =>
//   async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };

// export default asyncHandler;

const asyncHandler=(fn)=>
{
    return async(req,res,next)=>{
        try{
        await fn(req,res,next);
        }
        catch(error){
            next(error);
        }


    }

}
export default asyncHandler;
// const asyncHandler2 =(fn)=>{
//     Promise.resolve(fn(req,res,next)).catch(next)

// }