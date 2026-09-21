export interface DashboardStats {
  total: number;
  readyToSubmit: number;
  incomplete: number;
  expiringSoon: number;
}

export interface DrillDownData {
  groupName: string;
  count: number;
  applicationIds: string[];
}