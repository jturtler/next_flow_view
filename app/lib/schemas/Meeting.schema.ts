
"use server";

import mongoose, { Schema } from "mongoose";


const MettingSchema = new Schema(
	{ 
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Project',
        },
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
        participants: [ {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        }],
        meetingNotes: { type: String, required: false },
        assignedTo: [{
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
const Metting = mongoose.models.Metting || mongoose.model('Metting', MettingSchema);

export default Metting;