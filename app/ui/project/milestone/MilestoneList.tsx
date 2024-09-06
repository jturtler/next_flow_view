import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import * as Constant from "@/lib/constant";
import ProgressBar from "@/ui/basics/ProgressBar";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/ui/basics/Modal";
import { IoIosCloseCircle } from "react-icons/io";
import MilestoneForm from "./MilestoneForm";
import { useEffect, useState } from "react";
import * as AppStore from "@/lib/appStore";
import { useProject } from "@/contexts/ProjectContext";
import { IoTrash } from "react-icons/io5";


export default function MilestoneList({projectId, data}: {projectId: string, data: JSONObject[]}) {

    const [showMilestoneForm, setShowMilestoneForm] = useState(false);

    const { projectDetails, processStatus, removeMilestone } = useProject();

    useEffect(() => {

    }, [data]);

    useEffect(() => {
        if( processStatus === Constant.SAVE_DATA_SUCCESS ) {
            setShowMilestoneForm(false);
        }
    }, [projectDetails, processStatus]);

    const showUpdateMilestoneForm = (milestone: JSONObject) => {
        AppStore.setMilestone( milestone );
        setShowMilestoneForm( true );
    }

    const deleteMilestone = (milestone: JSONObject) => {
        const ok = confirm(`Are you sure you want to delete the milestone '${milestone.name}'?`);
        if( ok ) {
            removeMilestone(milestone._id);
        }
    }

    const sortedData = (data.length == 0 ) ? [] : data.sort((a, b) => Utils.convertDateStrToObj(a.dueDate).getTime() - Utils.convertDateStrToObj(b.dueDate).getTime());
    
    return (
        <>
            {sortedData.map((milestone:JSONObject, idx: number) => ( 
                <div key={`meeting_${milestone._id}`} className="grid grid-cols-8 open:justify-center items-center border-b mb-5 pb-1 border-gray-300">
                     <div className="px-2 py-1 rounded-md mr-4 whitespace-nowrap items-center flex" style={{backgroundColor: Utils.getStatusColor(milestone.status)}}>{Utils.getStatusName(milestone.status)}</div>

                    <div className="col-span-2">
                    

                        <div>{Utils.formatDateTime(milestone.dueDate)}</div>
                    </div>
                    
                    <div className="col-span-4">
                        <div className="font-semibold">{milestone.name}</div>
                        <div>{milestone.description}</div>
                    </div>

                    <div className="flex space-x-3 flex-1 justify-end">
                        <FaEdit className="size-5 text-blue-600 hover:text-sky-blue cursor-pointer" onClick={() => showUpdateMilestoneForm(milestone)}/>
                            {/* Remove Icon */}
                        <IoTrash
                            className="size-5 text-red-600 hover:text-red-800 cursor-pointer" 
                            onClick={() => deleteMilestone(milestone)} 
                        />
                    </div>
                </div> 
            ))}

            
            {showMilestoneForm && <Modal>
                <div className="bg-white rounded-lg w-3/4">
                    <h2 className="py-3 px-5 text-xl flex bg-blue-navy text-white rounded-t-lg items-center justify-between">
                        <div>Edit Milestone</div>
                        <div className="flex cursor-pointer" onClick={() => setShowMilestoneForm(false)}>
                            <IoIosCloseCircle className="size-6" />
                        </div>
                    </h2>

                    <div className="p-5 rounded-md bg-gray-100">
                        <MilestoneForm projectId={projectId} data={AppStore.getMilestone()} />
                    </div>
                </div>
            </Modal>}
        </>
    )
}