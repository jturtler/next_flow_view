import { useAuth } from "@/contexts/AuthContext";
import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react";
import * as Constant from "@/lib/constant";
import * as Utils from "@/lib/utils";
import { useProject } from "@/contexts/ProjectContext";
import { FaSpinner } from "react-icons/fa";


export default function MeetingForm({ projectId, data = null }: {projectId: string, data?: JSONObject | null}) {

    const { user } = useAuth();
    const { projectDetails, saveMeeting, error, processStatus } = useProject();

    const getInitData = (): JSONObject => {
        if( data === null ) {
            return {
                projectId: projectId,
                name: '',
                description: '',
                date: '',
                status: 'not_started',
                assignedTo: [],
                createdBy: user!._id
            } as JSONObject
        }
        else {
            let temp = Utils.cloneJSONObject(data);
            temp.date = Utils.convertToLocalDateStrForDateInputField(temp.date);

            return temp;
        }
    }
    
    const [formData, setFormData] = useState<JSONObject>(getInitData());

    useEffect(() => {
        // alert()
    },[projectDetails])
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({
            ...formData,
            assignedTo: selectedUsers,
        });
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Meeting formData: ", formData);
        saveMeeting(formData);
    };

    return (
        <div className="w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meeting Name */}
                <div>
                    <label className="mb-2 text-sm font-medium mt-2">Meeting Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="mb-2 text-sm font-medium mt-2">Date</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 text-sm font-medium mt-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500 h-[90px]"
                        required
                    />
                </div>

                {/* Assigned To */}
                <div>
                    <label className="text-sm font-medium text-gray-700">Assign to Users</label>
                    <select
                        multiple
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleUserSelection}
                          className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    >
                        {user!.teamMembers.map((member: JSONObject) => (
                            <option key={member._id} value={member._id}>
                                {member.email}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            <div className="mt-3">
                <button
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
                >
                    {data === null ? "Create Meeting" : "Update Meeting"}
                    {processStatus === Constant.SAVE_DATA_REQUEST && <FaSpinner className="ml-auto h-5" size={20} />}
                </button>

                {processStatus === Constant.SAVE_DATA_FAILURE && <span className="text-red-500">{error}</span>}
            </div>
        </div>

    );
}