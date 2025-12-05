import { userTypes } from "@/types/user_type";



export interface CreateUserInterface{
    user_type:userTypes;
    full_name:string;
    email:string;
    password:string;
    
}