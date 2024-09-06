"use server";

import mongoose from "mongoose";
import { JSONObject } from "../definations";
import connectToDatabase from "./db";
import * as Utils from "@/lib/utils";
import Milestone from "../schemas/Milestone.schema";

export async function fetchMilestonesByProjectIdList(
	projectIds: string[]
): Promise<JSONObject> {
	try {
		await connectToDatabase();

		const projectObjIds = projectIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);
		const milestones = await Milestone.find({
			projectId: { $in: projectObjIds },
		});

		return { status: "success", data: Utils.cloneJSONObject(milestones) };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}



export async function saveMilestone( payload: JSONObject ): Promise<JSONObject> {
	try {
		await connectToDatabase();

		let milestone: JSONObject = Utils.cloneJSONObject(payload);
		milestone.projectId = new mongoose.Types.ObjectId(payload.projectId);
		milestone.assignedTo = payload.assignedTo.map((id: string) => new mongoose.Types.ObjectId(id));
		milestone.createdBy = new mongoose.Types.ObjectId(payload.createdBy);
		
        // Save the milestone to the database
		let newMilestone;
		if( milestone._id === undefined ) { // Add new
        	newMilestone = await Milestone.create(milestone);
		}
		else {
			newMilestone = await Milestone.findByIdAndUpdate(milestone._id, milestone, { new: true, runValidators: true });
		}

		return { status: "success", data: Utils.cloneJSONObject(newMilestone) };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}


export async function removeMilestone(id: string): Promise<JSONObject> {
	
	try {
		await connectToDatabase();
		
        // Save the milestone to the database
		const newMilestone = await Milestone.findByIdAndDelete(id);

		return { status: "success" };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}