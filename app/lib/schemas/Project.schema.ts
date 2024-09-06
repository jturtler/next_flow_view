"use server";

import mongoose, { Schema } from "mongoose";


const ProjectSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
        status: { type: Date, required: true },
        managedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        teamMembers: [ {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        }],
	},
	{
		timestamps: true,
	}
)
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;