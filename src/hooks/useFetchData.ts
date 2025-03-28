import { useEffect, useState } from "react";
import IApartment from "../types/clusterLayer";

const useFetchData = () => {
  const [rows, setRows] = useState<IApartment[] | null>(null);

  const getData = async () => {
    try {
      const data = await fetch("/data.json");
      setRows(await data.json());
    } catch (err) {
      console.error("Error fetching JSON:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return rows;
};

export default useFetchData;
