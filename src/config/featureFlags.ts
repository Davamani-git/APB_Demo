export interface FeatureFlags {
  enableAverageTicketKpi: boolean;
  enableCategoryChart: boolean;
}

export const defaultFeatureFlags: FeatureFlags = {
  enableAverageTicketKpi: true,
  enableCategoryChart: true
};
