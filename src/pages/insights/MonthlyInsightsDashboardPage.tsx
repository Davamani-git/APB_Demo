import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import FunctionsOutlinedIcon from "@mui/icons-material/FunctionsOutlined";
import Box from "@mui/material/Box";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { PageContainer } from "../../components/common/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { DateMonthPicker } from "../../components/common/DateMonthPicker";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { MonthlySummaryHeader } from "../../components/dashboard/MonthlySummaryHeader";
import { KpiCardGrid } from "../../components/dashboard/KpiCardGrid";
import { SpendCategoryChart } from "../../components/dashboard/SpendCategoryChart";
import { SpendCategoryLegend } from "../../components/dashboard/SpendCategoryLegend";
import { TransactionsSummaryTable } from "../../components/dashboard/TransactionsSummaryTable";
import { DashboardErrorBanner } from "../../components/dashboard/DashboardErrorBanner";
import { useInsightsStore } from "../../state/insightsStore";
import { getDefaultMonth } from "../../utils/dateUtils";
import { INSIGHTS_QUERY_KEYS } from "../../constants/insights";
import { getMonthlySummary } from "../../services/insightsService";
import { getErrorMessage } from "../../utils/errorHandling";
import { formatCurrency } from "../../utils/numberFormatters";

export const MonthlyInsightsDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const selectedMonth = useInsightsStore((state) => state.selectedMonth);
  const setSelectedMonth = useInsightsStore((state) => state.setSelectedMonth);

  useEffect(() => {
    const monthFromQuery = searchParams.get("month");
    if (monthFromQuery) {
      setSelectedMonth(monthFromQuery);
      return;
    }
    const defaultMonth = getDefaultMonth();
    setSelectedMonth(defaultMonth);
    const params = new URLSearchParams(searchParams);
    params.set("month", defaultMonth);
    setSearchParams(params, { replace: true });
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;
    const params = new URLSearchParams(location.search);
    if (params.get("month") !== selectedMonth) {
      params.set("month", selectedMonth);
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  }, [selectedMonth, location.pathname, location.search, navigate]);

  const queryEnabled = !!selectedMonth;

  const queryKey = useMemo(
    () => [INSIGHTS_QUERY_KEYS.monthlySummary, selectedMonth],
    [selectedMonth]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey,
    queryFn: () => getMonthlySummary({ month: selectedMonth }),
    enabled: queryEnabled,
    staleTime: 5 * 60 * 1000
  });

  const hasData = data && (data.totalSpend > 0 || data.categories.length > 0);

  const errorMessage = isError ? getErrorMessage(error) : "";

  const kpiItems = useMemo(() => {
    if (!data) {
      return [];
    }
    const avg = data.transactionCount > 0 ? data.totalSpend / data.transactionCount : 0;
    return [
      {
        id: "total-spend",
        label: "Total spend this month",
        value: formatCurrency(data.totalSpend, data.currency),
        icon: <SavingsOutlinedIcon />
      },
      {
        id: "transaction-count",
        label: "Number of transactions",
        value: data.transactionCount.toString(),
        icon: <ReceiptLongOutlinedIcon />
      },
      {
        id: "average-amount",
        label: "Average transaction amount",
        value: formatCurrency(avg, data.currency),
        icon: <FunctionsOutlinedIcon />
      }
    ];
  }, [data]);

  const chartData = useMemo(
    () =>
      (data?.categories ?? []).map((c, index) => ({
        category: c.category,
        amount: c.amount,
        percentage: c.percentage,
        color: ["#1E88E5", "#FFB300", "#4CAF50", "#AB47BC", "#EC407A", "#26A69A"][index % 6]
      })),
    [data]
  );

  const tableRows = useMemo(
    () =>
      (data?.categories ?? []).map((c) => ({
        category: c.category,
        transactionCount: c.transactionCount,
        amount: c.amount,
        percentage: c.percentage
      })),
    [data]
  );

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    queryClient.invalidateQueries({ queryKey: [INSIGHTS_QUERY_KEYS.monthlySummary, month] });
  };

  const headerActions = (
    <Box className="flex items-center gap-3">
      <DateMonthPicker value={selectedMonth} onChange={handleMonthChange} />
      <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<RefreshIcon />}
        onClick={() => refetch()}
        disabled={isFetching}
      >
        Refresh
      </Button>
    </Box>
  );

  return (
    <MainLayout>
      <PageContainer>
        <PageHeader
          title="Monthly credit card spend"
          subtitle={selectedMonth ? `Spending insights for ${selectedMonth}` : undefined}
          actions={headerActions}
        />

        {isError && <DashboardErrorBanner message={errorMessage} onRetry={() => refetch()} />}

        {isLoading || (!hasData && isFetching) ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState description={errorMessage} onRetry={() => refetch()} />
        ) : !hasData ? (
          <EmptyState
            title="No credit card activity for this month"
            description="We did not find any posted transactions for the selected month. Try another month from the selector above."
          />
        ) : (
          <>
            <MonthlySummaryHeader
              selectedMonth={data?.month ?? selectedMonth}
              totalSpend={data?.totalSpend ?? null}
              transactionCount={data?.transactionCount ?? null}
              currency={data?.currency}
            />

            <Box className="mt-5">
              {kpiItems.length > 0 && <KpiCardGrid items={kpiItems} />}
            </Box>

            <Box className="mt-5">
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={7} lg={8}>
                  <SpendCategoryChart
                    data={chartData.map((c) => ({
                      category: c.category,
                      amount: c.amount,
                      percentage: c.percentage
                    }))}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={4}>
                  <SpendCategoryLegend data={chartData} />
                </Grid>
              </Grid>
            </Box>

            <Box className="mt-5">
              <TransactionsSummaryTable rows={tableRows} />
            </Box>
          </>
        )}
      </PageContainer>
    </MainLayout>
  );
};
