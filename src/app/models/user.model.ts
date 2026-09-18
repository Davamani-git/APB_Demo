export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  assignedApplications?: string[];
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'Coordinator' | 'Enrollment Manager' | 'System Administrator';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  entityType: string;
  entityId: string;
  details: any;
  ipAddress?: string;
}