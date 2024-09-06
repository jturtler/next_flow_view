import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import * as Constant from "@/lib/constant";
import ProgressBar from "@/ui/basics/ProgressBar";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/ui/basics/Modal";
import { IoIosCloseCircle } from "react-icons/io";
import TaskForm from "./TaskForm";
import { useEffect, useState } from "react";
import * as AppStore from "@/lib/appStore";
import { useProject } from "@/contexts/ProjectContext";
import { IoTrash } from "react-icons/io5";


export default function TaskList({projectId, data}: {projectId: string, data: JSONObject[]}) {

    const [showTaskForm, setShowTaskForm] = useState(false);

    const { projectDetails, processStatus, removeTask } = useProject();

    useEffect(() => {

    }, [data]);

    useEffect(() => {
        if( processStatus === Constant.SAVE_DATA_SUCCESS ) {
            setShowTaskForm(false);
        }
    }, [projectDetails, processStatus]);

    const getProgressData = (task: JSONObject): JSONObject => {
        let result: JSONObject = { name: `${task.name} is ${Utils.getStatusName(task.status)}`, percent: 0 };


        if( task.status === Constant.TASK_STATUS_COMPLETED ) {
            result.percent = 100;
        }
        else if( task.status === Constant.TASK_STATUS_IN_PROGRESS ) {

            const taskDays = Utils.getDaysBetweenDates( task.startDate, task.endDate ); 
            const realDays = Utils.getDaysBetweenDates( new Date(), task.endDate ); 

            result.percent = ( ( taskDays - realDays ) / taskDays ) * 100;
            result.name = ( realDays < 0 ) ? `${task.name} is overdue` : `${task.name} has ${realDays} day(s) left`;
        }

        return result;
    } 

    const showUpdateTaskForm = (task: JSONObject) => {
        AppStore.setTask( task );
        setShowTaskForm( true );
    }

    const deleteTask = (task: JSONObject) => {
        const ok = confirm(`Are you sure you want to delete the task '${task.name}'?`);
        if( ok ) {
            removeTask(task._id);
        }
    }

    const sortedData = (data.length == 0 ) ? [] : data.sort((a, b) => Utils.convertDateStrToObj(a.startDate).getTime() - Utils.convertDateStrToObj(b.startDate).getTime());

    return (
        <>
            <div className="grid grid-cols-1 gap-3">
                {sortedData.map((task:JSONObject, idx: number) => {
                    const progressBarData = getProgressData(task);
                    
                    return ( <div key={`task_${task._id}`} className="border border-gray-300 p-3">
                        <div className="flex flex-row space-x-2">
                            <FaEdit className="size-5 text-blue-600 hover:text-sky-blue cursor-pointer" onClick={() => showUpdateTaskForm(task)}/>
                                 {/* Remove Icon */}
                            <IoTrash
                                className="size-5 text-red-600 hover:text-red-800 cursor-pointer" 
                                onClick={() => deleteTask(task)} 
                            />
                            <div>{Utils.formatDateTime(task.startDate)}</div>
                            <div>-</div>
                            <div>{Utils.formatDateTime(task.endDate)}</div>
                        </div>
                        <ProgressBar name={progressBarData.name} percentage={progressBarData.percent} />
                    </div> )
                })}
            </div>

            
            {showTaskForm && <Modal>
                <div className="bg-white rounded-lg w-3/4">
                    <h2 className="py-3 px-5 text-xl flex bg-blue-navy text-white rounded-t-lg items-center justify-between">
                        <div>Edit Task</div>
                        <div className="flex cursor-pointer" onClick={() => setShowTaskForm(false)}>
                            <IoIosCloseCircle className="size-6" />
                        </div>
                    </h2>

                    <div className="p-5 rounded-md bg-gray-100">
                        <TaskForm projectId={projectId} data={AppStore.getTask()} />
                    </div>
                </div>
            </Modal>}
        </>
    )
}