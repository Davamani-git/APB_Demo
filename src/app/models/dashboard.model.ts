export interface DashboardStats {
  totalApplications: number;
  byStatus: StatusCount[];
  byCoordinator: CoordinatorCount[];
  byPayer: PayerCount[];
  highPriorityApplications: HighPriorityApp[];
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface CoordinatorCount {
  coordinatorName: string;
  count: number;
}

export interface PayerCount {
  payerName: string;
  count: number;
}

export interface HighPriorityApp {
  id: string;
  providerName: string;
  priorityScore: number;
  status: string;
}