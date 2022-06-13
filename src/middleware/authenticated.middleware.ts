import HttpException from '@/utils/exceptions/http.exception';
import { Request , Response , NextFunction } from 'express' ; 
import jwt from 'jsonwebtoken' ; 
import Token from '@/utils/interfaces/token.interface' ; 
import token from '@/utils/token' ; 
import User from '@/resources/user/user.model' ; 

export default async function authenticatedMiddleware(
    req: Request, 
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try{
        const bearer : any = req.headers.authorization ; 

        if( !bearer || ! bearer.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized"}) ;  
        
        const accessToken = bearer.split(' ')[1].trim() ; 
        
        const payload: jwt.JsonWebTokenError | Token = await token.verifyToken(accessToken) ; 

        if ( payload instanceof jwt.JsonWebTokenError)
        return res.status(401).json({ message: "Unauthorized"}) ; 
        let user = await User.findById(payload.id).select('-password').exec() ; 
        if ( user ) 
        req.user = user ; 
        next() ; 
    }catch(err: any) 
    {
       next(new HttpException( 400 , err.message)) ;      
    } 
}