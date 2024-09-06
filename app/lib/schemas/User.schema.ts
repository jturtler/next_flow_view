"use server";

import mongoose, { Schema } from "mongoose";


const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, required: true }, // e.g., project_manager, team_member, viewer
		teamMembers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
	},
	{
		timestamps: true,
	}
)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;