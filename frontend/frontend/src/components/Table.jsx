import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";

function CustomTable({ columns, data }) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col}>{row[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default CustomTable;