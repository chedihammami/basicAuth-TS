import { Schema , model} from 'mongoose' ; 
import User from '@/resources/user/user.interface' ; 
import bcrypt from 'bcrypt' ; 


const userSchema = new Schema({
     
     email: {
         type: String , 
         required: [ true , "An email is required" ] , 
         unique: true , 
         trim: true , 
         match : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g 
     } , 
     name: { 
         type: String , 
         required: [ true, "A name is required"] ,
         trim: true , 
         minLength: 6, 
         maxlength: 20 
     }, 
     password : {
         type: String , 
         required: [true, "A password in required"] , 
     }, 
     role : {
         type: String , 
         required: [true, "The Role is required"] , 
         enum: ['ADMIN', 'USER'] 
     }

}, { timestamps: true}) 

/** 
 *  bcrypt.hash is function used to hash the password , we use it with a salt or Round ( auto-generated salt)
 *  when we call save method in user Model , we see if the password is modified so we save the new Hash in the database or we call next()
 */
userSchema.pre<User>('save' , async function (next) {
     if ( !this.isModified('password'))
      return next() ; 
     const hash = await bcrypt.hash(this.password, 10 ) ; 
     this.password = hash ; 
     next() ; 
}); 
/**
 * 
 * isValidPassword is a method used to validate the password , we use compare from bcrypt to compare the given password from the one saved in the DB , we don't need to save 
 * the salt , compare determine the salt automatically  
 * 
 */
userSchema.methods.isValidPassword = async function  (
     password: string | Buffer
): Promise<Boolean>  {
     
       return await bcrypt.compare(password, this.password) ;
    }

export default model<User>('user' , userSchema) ; 