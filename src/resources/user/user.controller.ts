import  { Router ,  Request , Response , NextFunction }  from 'express' ;
import Controller from '@/utils/interfaces/controller.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation' ; 
import User from '@/resources/user/user.model' ; 
import HttpException from '@/utils/exceptions/http.exception';
import token from '@/utils/token' ; 
import authenticatedMiddleware from '@/middleware/authenticated.middleware' ; 
export default class userController implements Controller {
     public path = '/users' ; 
     public router = Router() ; 
     constructor () {
         this.initialiseRoutes() ; 
     }


     private initialiseRoutes() 
     {
         this.router.post(`${this.path}/register`, validationMiddleware(validate.REGISTER) , this.register ) ;  
         this.router.post(`${this.path}/login`, validationMiddleware(validate.LOGIN) , this.login ) ; 
         this.router.get(`${this.path}`, authenticatedMiddleware , this.getUser) ; 
     }

     private async register( req: Request , res: Response , next: NextFunction):Promise<Response | void> {
         
        try {
             let existUser = await User.findOne({ email: req.body.email}) ;
             if ( existUser ) 
              throw new Error("User Already Exist"); 
             let user = await User.create({
                name: req.body.name, 
                email: req.body.email,
                role: req.body.role,
                password: req.body.password
             })
             res.status(201).json({ status: "success" , user: user}) ; 

        }catch(err: any) 
        {
             next(new HttpException(400 , err.message)) ; 
        }
         
     }
     private async login( req: Request, res: Response, next: NextFunction): Promise<Response | void> {
         try {
            let user = await User.findOne({ email: req.body.email}) ; 
            if ( !user ) 
             throw new Error("Unable to find the user by email"); 
    
            if (! await user.isValidPassword(req.body.password))  
            {
             throw new Error("Wrong Password");              
            }
            const accessToken = token.createToken(user) ; 
           res.status(200).json({ status: "Success" , accessToken: accessToken } ) ;   
             
         }catch(err: any) 
         {
             next(new HttpException(400 , err.message))
         }
     }
     private getUser(
        req: Request, 
        res:Response, 
        next: NextFunction
     ): void {
        try{ 
        if ( !req.user) 
          throw new HttpException(401, "Unauthorized")
        res.status(200).send({ user: req.user })
        } 
        catch(err) 
        {
                next(err) ; 
        }       
    }

}