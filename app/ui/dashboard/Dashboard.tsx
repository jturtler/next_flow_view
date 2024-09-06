"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import * as dbService from "@/lib/dbService";
import { JSONObject } from "@/lib/definations";
import * as Constant from "@/lib/constant";
import { useMainUi } from "@/contexts/MainUiContext";
import * as AppStore from "@/lib/appStore";
import { Calendar } from "nextjs-jc-component-libs/dist/components";
import { EventType } from "nextjs-jc-component-libs/dist/libs/definations";
import * as Utils from "@/lib/utils";
import { GoDotFill } from "react-icons/go";
import { BiCalendar } from "react-icons/bi";
import { FaTimeline } from "react-icons/fa6";
import { MdOutlineViewTimeline } from "react-icons/md";
import { FcTimeline } from "react-icons/fc";
import { IoStatsChart } from "react-icons/io5";
import { LuGanttChart } from "react-icons/lu";
import UserProjectsTimeline from "./UserProjectsTimeline";


export default function Dashboard() {

    const { setMainPage } = useMainUi();

    const { user } = useAuth();
    const [details, setDetails] = useState<JSONObject>({});
    const [errMessage, setErrMessage] = useState("");

    const fetchProjects = async () => {
        const response: JSONObject = await dbService.fetchProjectsByUserId(user!._id);
        if( response.status != "success" ) {
            setErrMessage( response.message );
        }
        else {

            const projects = response.data;

            const projectIds = projects.map((item: JSONObject) => item._id);

            const taskResponse = await dbService.fetchTasksByProjectIdList(projectIds);
            const meetingResponse = await dbService.fetchMeetingsByProjectIdList(projectIds);
            const milestoneResponse = await dbService.fetchMilestonesByProjectIdList(projectIds);


            AppStore.setProjectList(projects);
            AppStore.setDetailsProjectList({tasks: taskResponse.data, meetings: meetingResponse.data, milestones: milestoneResponse.data});
            setDetails({ projects, tasks: taskResponse.data, meetings: meetingResponse.data, milestones: milestoneResponse.data });
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    const getCalendarEvents = (): EventType[] => {
        let events: EventType[] = [];

        let tasks = details.tasks && details.tasks.map((item: JSONObject) => {
            return {
                title: item.name,
                start: Utils.convertDateStrToObj(item.startDate),
                end: Utils.convertDateStrToObj(item.endDate),
                color: Utils.getTaskColor()
            } as EventType
        });
        if(!tasks) tasks = [];
        
        let milestones = details.milestones && details.milestones.map((item: JSONObject) => {
            return {
                title: item.name,
                start: Utils.convertDateStrToObj(item.dueDate),
                end: Utils.convertDateStrToObj(item.dueDate),
                color: Utils.getMilestoneColor()
            } as EventType
        });
        if(!milestones) milestones = [];

        
        let meetings = details.meetings && details.meetings.map((item: JSONObject) => {
            return {
                title: item.name,
                start: Utils.convertDateStrToObj(item.date),
                end: Utils.convertDateStrToObj(item.date),
                color: Utils.getMeetingColor()
            } as EventType
        });
        if(!meetings) meetings = [];

        return events.concat(tasks, milestones, meetings);
    }

    const showProjectDetails = (project: JSONObject) => {
        AppStore.setProject(project);
        setMainPage(Constant.PAGE_PROJECT_DETAILS);
    }

    const getEventList = () => {
        const events = getCalendarEvents();
        const today = new Date();
        const list: EventType[] = events.filter((event: EventType) => today.getTime() <= event.end.getTime() );

        return list.sort((a,b)=> a.end.getTime() - b.end.getTime());
    }

    if( errMessage !== "" ) return (<div className="p-3">{errMessage}</div>);

    const eventList = getEventList();

    return (
        <div className="px-6 my-8 grid grid-cols-1 lg:grid-cols-3 gap-y-5 gap-x-5 z-10 md:grid-cols-2">

            <div className="space-y-4 lg:col-span-2 ">
                {Object.keys(details).length > 0 && <UserProjectsTimeline projects={AppStore.getProjectList()!} details={AppStore.getDetailsProjectList()!} />}
            </div>

            <div className="space-y-4">
                <div className="bg-blue-navy text-slate-50 rounded-lg px-5 py-3 space-y-4">
                    <div className="text-lg border-b border-light-sky-blue pb-1">Project List</div>
                    <div className="space-y-2">
                        {details.projects && details.projects.map((project: JSONObject, idx: number)=> (
                            <div key={`project-${project._id}`} className="flex cursor-pointer hover:text-yellow-500 items-center space-x-2" onClick={() => showProjectDetails(project)}>
                                <LuGanttChart />
                                <span>{project.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 min-w-96 min-h-[520px]">
                    {/* <Calendar events={[]} onClick={({date: Date, events: EventType[]})=> {}} /> */}
                    <Calendar events={getCalendarEvents()} onClick={(data: JSONObject)=> { }} />
                </div>

                <div className="row-span-2 items-center justify-center bg-white rounded-lg p-3 space-y-2 h-full">
                    <div className="font-bold">Task List</div>
                    {eventList === undefined && eventList === null ? <div>[No task]</div> :
                        eventList.map((event: EventType, idx: number) => (
                            <div key={`today_event_${idx}`} style={{backgroundColor: event.color}} className={`p-2 rounded-md`}>Due date on {Utils.formatDateTimeObj(event.end)} - {event.title}</div>
                        ))}
                </div>
            </div>
        </div>
    )
}