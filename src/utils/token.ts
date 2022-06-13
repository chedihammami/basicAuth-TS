import jwt from 'jsonwebtoken' ; 
import Token  from './interfaces/token.interface';
import User from '@/resources/user/user.interface';

/**
 * createToken function , we use to create token when the user log in , called from login controller in the User resources 
 */
export const createToken = ( user: User) : string => {
    return jwt.sign({ id: user._id} ,  process.env.JWT_SECRET as jwt.Secret, {
         expiresIn: '1d'
    }) ; 
}

/**
 *  jwt is a class contain types , one of them is Secret , we assign our secret to jwt.Secret to indicate that's a secret from jwt class
 */

export const verifyToken = async (
     token: string
): Promise<jwt.VerifyErrors | Token> => {
     return new Promise(( resolve, reject) => {
         jwt.verify(token, process.env.JWT_SECRET as jwt.Secret , ( err, payload ) => {
             if ( err ) return reject(err) ; 
             resolve(payload as Token ) ; 
         })
     })
}

export default { createToken , verifyToken } ; 