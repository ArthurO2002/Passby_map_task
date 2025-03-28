import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { CircularProgress, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import IApartment from "../../types/clusterLayer";
import Filters from "./Filters/Filters";
import { useDataContext } from "../../context/DataContext";

const Table = () => {
  const columns: GridColDef[] = [
    { field: "pid", flex: 1, headerName: "ID" },
    { field: "name", flex: 1, headerName: "Name" },
    { field: "city", flex: 1, headerName: "City" },
    { field: "region", flex: 1, headerName: "Region" },
    { field: "postal_code", flex: 1, headerName: "Postal Code" },
    { field: "tenant_type", flex: 1, headerName: "Tenant Type" },
    { field: "longitude", flex: 1, headerName: "Longitude" },
    { field: "latitude", flex: 1, headerName: "Latitude" },
  ];
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { filteredData } = useDataContext();

  const sortedRows = useMemo(() => {
    if (!filteredData) return;
    if (sortModel.length === 0) return filteredData;

    const { field } = sortModel[0];

    return [...filteredData].sort((a, b) => {
      const valA = a[field as keyof IApartment];
      const valB = b[field as keyof IApartment];

      return valA < valB ? -1 : valA > valB ? 1 : 0;
    });
  }, [filteredData, sortModel]);

  const onSortChange = (model: GridSortModel) => {
    setSortModel(model);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  useEffect(() => {
    setPaginationModel({ ...paginationModel, page: 0 });
  }, [filteredData]);

  return (
    <Paper
      sx={{ width: "100%", height: "calc(100% - 64px)", boxShadow: "none" }}
    >
      <Filters />
      {filteredData ? (
        <DataGrid
          hideFooterSelectedRowCount
          rows={sortedRows}
          getRowId={(row) => row.pid}
          columns={columns}
          disableColumnMenu
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={(model) => onSortChange(model)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20, 100]}
          sx={{ border: 0, width: "100%", height: "100%" }}
        />
      ) : (
        <CircularProgress color="inherit" />
      )}
    </Paper>
  );
};

export default Table;
