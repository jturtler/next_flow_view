"use server";

import mongoose, { Schema } from "mongoose";


const MilestoneSchema = new Schema(
	{ 
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Project',
        },
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		dueDate: { type: Date, required: true },
        status: { type: String, required: true }, // e.g., pending, achieved, delayed
        assignedTo: [{type: String, required: true}],
        createdBy:  {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        }
	},
	{
		timestamps: true,
	}
)
const Milestone = mongoose.models.Milestone || mongoose.model('Milestone', MilestoneSchema);

export default Milestone;