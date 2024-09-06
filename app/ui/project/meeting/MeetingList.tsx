import { JSONObject } from "@/lib/definations";
import * as Utils from "@/lib/utils";
import * as Constant from "@/lib/constant";
import ProgressBar from "@/ui/basics/ProgressBar";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/ui/basics/Modal";
import { IoIosCloseCircle } from "react-icons/io";
import MeetingForm from "./MeetingForm";
import { useEffect, useState } from "react";
import * as AppStore from "@/lib/appStore";
import { useProject } from "@/contexts/ProjectContext";
import { IoTrash } from "react-icons/io5";


export default function MeetingList({projectId, data}: {projectId: string, data: JSONObject[]}) {

    const [showMeetingForm, setShowMeetingForm] = useState(false);

    const { projectDetails, processStatus, removeMeeting } = useProject();

    useEffect(() => {

    }, [data]);

    useEffect(() => {
        if( processStatus === Constant.SAVE_DATA_SUCCESS ) {
            setShowMeetingForm(false);
        }
    }, [projectDetails, processStatus]);

    const showUpdateMeetingForm = (meeting: JSONObject) => {
        AppStore.setMeeting( meeting );
        setShowMeetingForm( true );
    }

    const deleteMeeting = (meeting: JSONObject) => {
        const ok = confirm(`Are you sure you want to delete the meeting '${meeting.name}'?`);
        if( ok ) {
            removeMeeting(meeting._id);
        }
    }
    
    const sortedData = (data.length == 0 ) ? [] : data.sort((a, b) => Utils.convertDateStrToObj(a.date).getTime() - Utils.convertDateStrToObj(b.date).getTime());

    return (
        <>
            {sortedData.map((meeting:JSONObject, idx: number) => ( 
                <div key={`meeting_${meeting._id}`} className="grid grid-cols-7 justify-center items-center border-b mb-5 pb-1 border-gray-300">
                    <div className="col-span-2">{Utils.formatDateTime(meeting.date)}</div>
                    
                    <div className="col-span-4">
                        <div className="font-semibold">{meeting.name}</div>
                        <div>{meeting.description}</div>
                        {meeting.meetingNotes && <div>{meeting.meetingNotes}</div>}
                    </div>

                    <div className="flex space-x-3 flex-1 justify-end">
                        <FaEdit className="size-5 text-blue-600 hover:text-sky-blue cursor-pointer" onClick={() => showUpdateMeetingForm(meeting)}/>
                            {/* Remove Icon */}
                        <IoTrash
                            className="size-5 text-red-600 hover:text-red-800 cursor-pointer" 
                            onClick={() => deleteMeeting(meeting)} 
                        />
                    </div>
                </div> 
            ))}

            
            {showMeetingForm && <Modal>
                <div className="bg-white rounded-lg w-3/4">
                    <h2 className="py-3 px-5 text-xl flex bg-blue-navy text-white rounded-t-lg items-center justify-between">
                        <div>Edit Meeting</div>
                        <div className="flex cursor-pointer" onClick={() => setShowMeetingForm(false)}>
                            <IoIosCloseCircle className="size-6" />
                        </div>
                    </h2>

                    <div className="p-5 rounded-md bg-gray-100">
                        <MeetingForm projectId={projectId} data={AppStore.getMeeting()} />
                    </div>
                </div>
            </Modal>}
        </>
    )
}