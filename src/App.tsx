import React from "react";
import "./App.css";
import { Box } from "@mui/material";
import Map from "./components/map";
import Table from "./components/table";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <DataProvider>
      <Box
        component="div"
        display="flex"
        sx={{ width: "100%", height: "100vh" }}
      >
        <Box sx={{ width: "50%", height: "100%", overflow: "hidden" }}>
          <Map />
        </Box>
        <Box sx={{ width: "50%", height: "100%" }}>
          <Table />
        </Box>
      </Box>
    </DataProvider>
  );
}

export default App;
