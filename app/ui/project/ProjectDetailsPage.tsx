"use client";

import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react";
import * as dbService from "@/lib/dbService";
import ProjectTimeline from "./ProjectTimeline";
import * as Constant from "@/lib/constant";
import { useMainUi } from "@/contexts/MainUiContext";
import * as AppStore from "@/lib/appStore";
import TaskPage from "./task/TaskPage";
import * as Utils from "@/lib/utils";
import { ProjectProvider, useProject } from "@/contexts/ProjectContext";
import ProjectCalendarTimeline from "./ProjectCalendarTimeline";
import MeetingPage from "./meeting/MeetingPage";
import MilestonePage from "./milestone/MilestonePage";


export default function ProjectDetailsPage({ project }: { project: JSONObject }) {

    const { subPage,setSubPage } = useMainUi();
    const { projectDetails } = useProject();
    
 
    useEffect(() => {
        setSubPage(Constant.SUB_PAGE_TIMELINE);
    }, []);

    const projectId = AppStore.getProject()!._id;

    if( projectDetails === null ) return (<div>Loading ...</div>);

    return (
        <div className="relative h-full py-6 px-5 bg-white">
            {subPage === Constant.SUB_PAGE_TIMELINE && <ProjectTimeline data={projectDetails} />}
            {subPage === Constant.SUB_PAGE_CALENDAR && <ProjectCalendarTimeline project={project} data={projectDetails}/>} 
            {subPage === Constant.SUB_PAGE_NEW_TASK && <TaskPage projectId={projectId} data={projectDetails} />}
            {subPage === Constant.SUB_PAGE_NEW_MEETING && <MeetingPage projectId={projectId} data={projectDetails} />}
            {subPage === Constant.SUB_PAGE_NEW_MILESTONE && <MilestonePage projectId={projectId} data={projectDetails} />}
        </div>
    )
}