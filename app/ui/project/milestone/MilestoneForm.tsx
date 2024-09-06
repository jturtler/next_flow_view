import { useAuth } from "@/contexts/AuthContext";
import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react";
import * as Constant from "@/lib/constant";
import * as Utils from "@/lib/utils";
import { useProject } from "@/contexts/ProjectContext";
import { FaSpinner } from "react-icons/fa";


export default function MilestoneForm({ projectId, data = null }: {projectId: string, data?: JSONObject | null}) {

    const { user } = useAuth();
    const { projectDetails, saveMilestone, error, processStatus } = useProject();

    const getInitData = (): JSONObject => {
        if( data === null ) {
            return {
                projectId: projectId,
                name: '',
                description: '',
                dueDate: '',
                status: 'pending',
                assignedTo: [],
                createdBy: user!._id
            } as JSONObject
        }
        else {
            let temp = Utils.cloneJSONObject(data);
            temp.dueDate = Utils.convertToLocalDateStrForDateInputField(temp.dueDate);

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
        saveMilestone(formData);
    };

    return (
        <div className="w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Milestone Name */}
                <div>
                    <label className="mb-2 text-sm font-medium mt-2">Milestone Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                </div>

                {/* Due Date */}
                <div>
                    <label className="mb-2 text-sm font-medium mt-2">Due Date</label>
                    <input
                        type="datetime-local"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="mb-2 text-sm font-medium mt-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 p-2 text-sm outline-2 placeholder:text-gray-500 h-20"
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
                                value={Constant.MILESTONE_STATUS_PENDING}
                                checked={formData.status === Constant.MILESTONE_STATUS_PENDING}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                required
                            />
                            <span className="ml-2">Pending</span>
                        </label>

                        <label className="inline-flex items-center text-xs font-medium my-1 mx-1">
                            <input
                                type="radio"
                                name="status"
                                value={Constant.MILESTONE_STATUS_ACHIEVED}
                                checked={formData.status === Constant.MILESTONE_STATUS_ACHIEVED}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                required
                            />
                            <span className="ml-2">Achieved</span>
                        </label>

                        <label className="inline-flex items-center text-xs font-medium my-1 mx-1">
                            <input
                                type="radio"
                                name="status"
                                value={Constant.MILESTONE_STATUS_DELAY}
                                checked={formData.status === Constant.MILESTONE_STATUS_DELAY}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                required
                            />
                            <span className="ml-2">Delay</span>
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
                    {data === null ? "Create Milestone" : "Update Milestone"}
                    {processStatus === Constant.SAVE_DATA_REQUEST && <FaSpinner className="ml-auto h-5" size={20} />}
                </button>

                {processStatus === Constant.SAVE_DATA_FAILURE && <span className="text-red-500">{error}</span>}
            </div>
        </div>

    );
}