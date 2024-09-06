"use server";

import mongoose, { Schema } from "mongoose";


const TaskSchema = new Schema(
	{
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Project',
        },
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
        status: { type: String, required: true }, // e.g., not_started, in_progress, completed
        assignedTo: [ {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        }],
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
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export default Task;