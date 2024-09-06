import { JSONObject } from "./definations";
import * as Utils from "@/lib/utils";

let _projectList: JSONObject[] | null = null;
let _details: JSONObject | null = null;
let _project: JSONObject | null = null;
let _task: JSONObject | null = null;
let _meeting: JSONObject | null = null;
let _milestone: JSONObject | null = null;

export const setProjectList = (projectList: JSONObject[] | null) => {
	_projectList = projectList;
};

export const getProjectList = (): JSONObject[] | null => {
	return _projectList;
};

export const setDetailsProjectList = (details: JSONObject | null) => {
	_details = details;
};

export const getDetailsProjectList = (): JSONObject | null => {
	return _details;
};



export const setProject = (project: JSONObject | null) => {
	_project = project;
};

export const getProject = (): JSONObject | null => {
	return _project;
};



export const setTask = (task: JSONObject | null) => {
    _task = task;
};

export const getTask = (): JSONObject | null => {
	return _task;
};

export const setMeeting = (meeting: JSONObject | null) => {
    _meeting = meeting;
};

export const getMeeting = (): JSONObject | null => {
	return _meeting;
};

export const setMilestone = (milestone: JSONObject | null) => {
    _milestone = milestone;
};

export const getMilestone = (): JSONObject | null => {
	return _milestone;
};
