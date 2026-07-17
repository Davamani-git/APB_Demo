import { FC, useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { formatCurrency, formatPercentage } from "../../utils/numberFormatters";

export interface TransactionsSummaryRow {
  category: string;
  transactionCount: number;
  amount: number;
  percentage: number;
}

type OrderByField = "amount" | "transactionCount" | "category" | "percentage";

type OrderDirection = "asc" | "desc";

interface TransactionsSummaryTableProps {
  rows: TransactionsSummaryRow[];
}

export const TransactionsSummaryTable: FC<TransactionsSummaryTableProps> = ({ rows }) => {
  const [orderBy, setOrderBy] = useState<OrderByField>("amount");
  const [order, setOrder] = useState<OrderDirection>("desc");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const valA = a[orderBy];
      const valB = b[orderBy];
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, orderBy, order]);

  const handleSort = (field: OrderByField) => {
    if (orderBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(field);
      setOrder("desc");
    }
  };

  if (!rows || rows.length === 0) {
    return (
      <Box className="bg-background-card rounded-card shadow-card border border-border-subtle p-4 flex items-center justify-center">
        <Typography variant="body2" className="text-text-secondary">
          No category summary is available for this month.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper className="bg-background-card rounded-card shadow-card border border-border-subtle overflow-hidden">
      <Box className="px-4 pt-4 pb-2">
        <Typography variant="subtitle1" className="font-semibold">
          Category summary
        </Typography>
      </Box>
      <TableContainer>
        <Table size="small" aria-label="Transactions summary by category">
          <TableHead>
            <TableRow className="bg-slate-900/60">
              <TableCell sortDirection={orderBy === "category" ? order : false}>
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={orderBy === "category" ? order : "asc"}
                  onClick={() => handleSort("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "transactionCount" ? order : false} align="right">
                <TableSortLabel
                  active={orderBy === "transactionCount"}
                  direction={orderBy === "transactionCount" ? order : "desc"}
                  onClick={() => handleSort("transactionCount")}
                >
                  # of Transactions
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "amount" ? order : false} align="right">
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "desc"}
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "percentage" ? order : false} align="right">
                <TableSortLabel
                  active={orderBy === "percentage"}
                  direction={orderBy === "percentage" ? order : "desc"}
                  onClick={() => handleSort("percentage")}
                >
                  Share of total
                </TableSortLabel>
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={row.category} className="hover:bg-slate-800/60">
              <TableCell component="th" scope="row">
                {row.category}
              </TableCell>
              <TableCell align="right">{row.transactionCount}</TableCell>
              <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
              <TableCell align="right">{formatPercentage(row.percentage)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
  );
};
