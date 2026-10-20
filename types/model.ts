export type TUser = {
    _id: string;
    email: string;
    password: string;
    role: string;
    teamMembers: string[];
    createdAt: string;
    updatedAt: string;
}

export type TProject = {
    _id: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    managedBy: string; // User ID
    teamMembers: string[]; // Array of User IDs
    createdAt: string;
    updatedAt: string;
}  

export type TMeeting = {
    _id: string;
    projectId: string;
    name: string;
    description: string;
    date: string;
    participants: string[]; // Array of User IDs
    meetingNotes: string;
    assignedTo: string[]; // Array of User IDs
    createdBy: string; // User ID
    createdAt: string;
    updatedAt: string;
}  

export type TMilestone = {
    _id: string;
    projectId: string;
    name: string;
    description: string;
    dueDate: string;
    status: string;
    assignedTo: string[]; // Array of User IDs
    createdBy: string; // User ID
    createdAt: string;
    updatedAt: string;
}


export type TTask = {
    _id: string;
    projectId: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string; // e.g., not_started, in_progress, completed
    assignedTo: string[]; // Array of User IDs
    createdBy: string; // User ID
    createdAt: string;
    updatedAt: string;
}