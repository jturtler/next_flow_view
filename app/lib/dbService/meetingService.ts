"use server";

import { randomBytes } from "node:crypto";
import { JSONObject } from "../definations";
import { readFileData, updateDataList } from "@/services/fileService";
import { TMeeting } from "../../../types/model";

const meetingFileName = "meetings.json";

export async function fetchMeetingsByProjectIdList(
	projectIds: string[]
): Promise<JSONObject> {
	try {
		const projectIdSet = new Set(projectIds);
		const meetings = await readFileData<TMeeting>(meetingFileName);

		return {
			status: "success",
			data: meetings.filter((meeting) => projectIdSet.has(meeting.projectId)),
		};
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}

export async function saveMetting(payload: JSONObject): Promise<JSONObject> {
	try {
		const now = new Date().toISOString();
		const date = new Date(payload.date);
		if (Number.isNaN(date.getTime())) {
			throw new Error("Meeting date must be valid.");
		}

		const meetingData: TMeeting = {
			...payload,
			_id: payload._id ?? randomBytes(12).toString("hex"),
			projectId: payload.projectId,
			name: payload.name,
			description: payload.description,
			date: date.toISOString(),
			participants: payload.participants ?? [],
			meetingNotes: payload.meetingNotes ?? "",
			assignedTo: payload.assignedTo,
			createdBy: payload.createdBy,
			createdAt: payload.createdAt ?? now,
			updatedAt: now,
		};

		const savedMeeting = await updateDataList<TMeeting, TMeeting>(
			meetingFileName,
			(meetings) => {
				const existingIndex = meetings.findIndex(
					(meeting) => meeting._id === meetingData._id,
				);
				if (existingIndex === -1) {
					meetings.push(meetingData);
					return meetingData;
				}

				const updatedMeeting = {
					...meetingData,
					createdAt: meetings[existingIndex].createdAt,
				};
				meetings[existingIndex] = updatedMeeting;
				return updatedMeeting;
			},
		);

		return { status: "success", data: savedMeeting };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}

export async function removeMetting(id: string): Promise<JSONObject> {
	try {
		await updateDataList<TMeeting, void>(meetingFileName, (meetings) => {
			const meetingIndex = meetings.findIndex((meeting) => meeting._id === id);
			if (meetingIndex !== -1) meetings.splice(meetingIndex, 1);
		});

		return { status: "success" };
	} catch (error: any) {
		return { status: "error", message: error.message };
	}
}
