'use server';

import { JSONObject } from "../definations";
import connectToDatabase from "./db";
import User from "../schemas/User.schema";
import * as Encrypt from "./encryptPassword";
import * as Utils from "@/lib/utils";
import mongoose from "mongoose";


export async function login({email, password}: JSONObject): Promise<JSONObject> {

	try {
		await connectToDatabase();
		const searchResult = await User.find({ email });

		// Find the users with the password if there is password in parametters
		let matchedUser: JSONObject | null = null;
		for (let i = 0; i < searchResult.length; i++) {
			const user = searchResult[i];
			const matched = await Encrypt.comparePassword(password!, user.password);
			if (matched) {
				matchedUser = user;
				break;
			}
		}

		if ( matchedUser === null ) {
			return ({status: "fail", message: "Username/Password is wrong"});
		}
		

		const teamMemberIdObjs = matchedUser.teamMembers.map((id: string) => new mongoose.Types.ObjectId(id));
		const teamMembers = await User.find({ _id: { $in: teamMemberIdObjs } });
		matchedUser.teamMembers = teamMembers;

		// Utils.cloneJSONObject(matchedUser) ==> need to do it so that I can avoid the issue "Warning: Only plain objects can be passed to Client Components from Server Components" 
		return ({status: "success", data: Utils.cloneJSONObject( matchedUser )});
	} catch (error: any) {
		return ({status: "error", message: error.message});
	}
}

export async function register(userData: JSONObject): Promise<JSONObject> {
	
	try {
		await connectToDatabase();

		const password = userData.password;
		userData.password = await Encrypt.hashPassword(password);

		const newUser = await User.create(userData);
		return ({status: "succcess", data: Utils.cloneJSONObject(newUser)});

	} catch (error: any) {
		return ({status: "error", message: error.message});
		// if (error instanceof mongoose.Error.ValidationError) {
        //     return({status: "error",error: 'Validation Error:' + error.message});
        // } else if (error instanceof mongoose.Error.CastError) {
        //     return({error: 'Cast Error:' + error.message});
        // } else if (error.code === 11000) {  // Duplicate key error code
        //     return({error: 'Duplicate Key Error:' + error.message});
        // } else {
        //     return({error: 'UnknownError:' + error.message});
        // }
	}
}


// export async function linkTeamMembers() {
//     try {
//         await connectToDatabase();

//         // Find all users with the "team_member" role
//         const teamMembers = await User.find({ role: 'team_member' });

//         // Iterate over each team member and link them to other team members
//         for (let user of teamMembers) {
//             user.teamMembers = teamMembers
//                 .filter(member => member._id.toString() !== user._id.toString()) // Exclude the user from their own teamMembers array
//                 .map(member => member._id); // Map to ObjectId

//             await user.save();
//         }

//         console.log('Team members linked successfully.');
//     } catch (error) {
//         console.error('Error linking team members:', error);
//     } 
// }
