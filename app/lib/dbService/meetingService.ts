"use server";

import mongoose from "mongoose";
import { JSONObject } from "../definations";
import connectToDatabase from "./db";
import Metting from "../schemas/Meeting.schema";
import * as Utils from "@/lib/utils";

export async function fetchMeetingsByProjectIdList(
	projectIds: string[]
): Promise<JSONObject> {
	try {
		await connectToDatabase();

		const projectObjIds = projectIds.map(
			(id) => new mongoose.Types.ObjectId(id)
		);
		const meetings = await Metting.find({ projectId: { $in: projectObjIds } });

		return { status: "success", data: Utils.cloneJSONObject(meetings) };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}



export async function saveMetting( payload: JSONObject ): Promise<JSONObject> {
	try {
		await connectToDatabase();

		let metting: JSONObject = Utils.cloneJSONObject(payload);
		metting.projectId = new mongoose.Types.ObjectId(payload.projectId);
		metting.assignedTo = payload.assignedTo.map((id: string) => new mongoose.Types.ObjectId(id));
		metting.createdBy = new mongoose.Types.ObjectId(payload.createdBy);
		
        // Save the metting to the database
		let newMetting;
		if( metting._id === undefined ) { // Add new
        	newMetting = await Metting.create(metting);
		}
		else {
			newMetting = await Metting.findByIdAndUpdate(metting._id, metting, { new: true, runValidators: true });
		}

		return { status: "success", data: Utils.cloneJSONObject(newMetting) };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}


export async function removeMetting(id: string): Promise<JSONObject> {
	
	try {
		await connectToDatabase();
		
        // Save the metting to the database
		const newMetting = await Metting.findByIdAndDelete(id);

		return { status: "success" };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}