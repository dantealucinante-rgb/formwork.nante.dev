export interface Project {
    id: string;
    name: string;
    created_at: string;
}

export interface DocumentOutput {
    id: string;
    projectId: string;
    content: string;
    format: 'pdf' | 'docx';
}
