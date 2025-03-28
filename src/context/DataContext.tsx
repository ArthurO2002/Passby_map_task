import React, { createContext, useState, useEffect, useContext } from "react";
import useFetchData from "../hooks/useFetchData";
import IApartment from "../types/clusterLayer";

interface DataContextProps {
  data: IApartment[] | null;
  filteredData: IApartment[] | null;
  setFilter: (value: IApartment[]) => void;
}

const DataContext = createContext<DataContextProps>({
  data: [],
  filteredData: [],
  setFilter: () => {},
});

export const DataProvider = ({ children }: React.PropsWithChildren) => {
  const data = useFetchData(); // Fetch data
  const [filteredData, setFilteredData] = useState(data);

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const setFilter = (value: IApartment[]) => {
    setFilteredData(value);
  };

  return (
    <DataContext.Provider value={{ data, filteredData, setFilter }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
