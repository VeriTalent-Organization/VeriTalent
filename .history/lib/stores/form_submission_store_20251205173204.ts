import { userTypes } from "@/types/user_type";



export interface CreateUserInterface{
    user_type:userTypes;
    full_name:string;
    email:string;
    password:string;
    country:string;
    has_agreed_to_terms:boolean;
    professional_status?:string;
    current_designation?:string;
}