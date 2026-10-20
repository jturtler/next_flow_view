"use server";

import { JSONObject } from "../definations";
import { readFileData } from "@/services/fileService";
import {
	TMeeting,
	TMilestone,
	TProject,
	TTask,
} from "../../../types/model";

const projectFileName = "projects.json";
const taskFileName = "tasks.json";
const meetingFileName = "meetings.json";
const milestoneFileName = "milestones.json";

export async function fetchProjectsByUserId(
  userId: string
): Promise<JSONObject> {
  try {
    const projects = await readFileData<TProject>(projectFileName);
    return {
      status: "success",
      data: projects.filter((project) => project.managedBy === userId),
    };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function fetchProjectById(projectId: string): Promise<JSONObject> {
  try {
    const [meetings, milestones, tasks] = await Promise.all([
      readFileData<TMeeting>(meetingFileName),
      readFileData<TMilestone>(milestoneFileName),
      readFileData<TTask>(taskFileName),
    ]);

    return {
      status: "success",
      data: {
        meetings: meetings.filter((meeting) => meeting.projectId === projectId),
        milestones: milestones.filter(
          (milestone) => milestone.projectId === projectId,
        ),
        tasks: tasks.filter((task) => task.projectId === projectId),
      },
    };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}
