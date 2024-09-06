import { useAuth } from "@/contexts/AuthContext";
import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react";
import * as Constant from "@/lib/constant";
import * as Utils from "@/lib/utils";
import { useProject } from "@/contexts/ProjectContext";
import { FaSpinner } from "react-icons/fa";


export default function TaskForm({ projectId, data = null }: {projectId: string, data?: JSONObject | null}) {

    const { user } = useAuth();
    const { projectDetails, saveTask, error, processStatus } = useProject();

    const getInitData = (): JSONObject => {
        if( data === null ) {
            return {
                projectId: projectId,
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                status: 'not_started',
                assignedTo: [],
                createdBy: user!._id
            } as JSONObject
        }
        else {
            let temp = Utils.cloneJSONObject(data);
            temp.startDate = Utils.convertToLocalDateStrForDateInputField(temp.startDate);
            temp.endDate = Utils.convertToLocalDateStrForDateInputField(temp.endDate);

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
        console.log("Task Formdata: ", formData);
        saveTask(formData);
    };

    return (
        <div className="w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Task Name */}
                <div>
                    <label className="mb-2 text-sm font-medium mt-2">Task Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
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
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500 h-9"
                        required
                    />
                </div>

                {/* Start Date */}
                <div>
                    <label className="mb-2 text-sm font-medium mt-2">Start Date</label>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="mb-2 text-sm font-medium mt-2">End Date</label>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="grid grid-cols-1 space-y-2 rounded-md border border-gray-300 p-2 bg-white">
                        <label className="inline-flex items-center text-xs font-medium my-1 mx-1">
                            <input
                                type="radio"
                                name="status"
                                value={Constant.TASK_STATUS_NOT_STARTED}
                                checked={formData.status === Constant.TASK_STATUS_NOT_STARTED}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                required
                            />
                            <span className="ml-2">Not Started</span>
                        </label>

                        <label className="inline-flex items-center text-xs font-medium my-1 mx-1">
                            <input
                                type="radio"
                                name="status"
                                value={Constant.TASK_STATUS_IN_PROGRESS}
                                checked={formData.status === Constant.TASK_STATUS_IN_PROGRESS}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                required
                            />
                            <span className="ml-2">In Progress</span>
                        </label>

                        <label className="inline-flex items-center text-xs font-medium my-1 mx-1">
                            <input
                                type="radio"
                                name="status"
                                value={Constant.TASK_STATUS_COMPLETED}
                                checked={formData.status === Constant.TASK_STATUS_COMPLETED}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                required
                            />
                            <span className="ml-2">Completed</span>
                        </label>
                    </div>
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
                    {data === null ? "Create Task" : "Update Task"}
                    {processStatus === Constant.SAVE_DATA_REQUEST && <FaSpinner className="ml-auto h-5" size={20} />}
                </button>

                {processStatus === Constant.SAVE_DATA_FAILURE && <span className="text-red-500">{error}</span>}
            </div>
        </div>

    );
}