import {
  Button,
  Box,
  MenuItem,
  Popper,
  Fade,
  Paper,
  Select,
  Input,
  IconButton,
} from "@mui/material";
import TenantType from "./FilterFields/TenantType";
import { useState, MouseEvent } from "react";
import { useDataContext } from "../../../context/DataContext";
import { Close } from "@mui/icons-material";
import { v4 } from "uuid";

const Filters = () => {
  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<
    { id: string; key: string; value: string }[]
  >([{ id: v4(), key: "", value: "" }]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsFiltersVisible(!isFiltersVisible);
  };
  const { data, setFilter } = useDataContext();

  const filterableFields = [
    { pid: "Id" },
    { name: "Name" },
    { city: "City" },
    { region: "Region" },
    { postal_code: "Postal Code" },
    { tenant_type: "Tenant Type" },
  ];

  const onSubmit = () => {
    if (!data) return;

    const idFilterValue = filters.find((item) => item.key === "pid")?.value;
    const nameFilterValue = filters.find((item) => item.key === "name")?.value;
    const cityFilterValue = filters.find((item) => item.key === "city")?.value;
    const regionFilterValue = filters.find(
      (item) => item.key === "region",
    )?.value;
    const postalCodeFilterValue = filters.find(
      (item) => item.key === "postal_code",
    )?.value;
    const tenantTypeFilterValue = filters.find(
      (item) => item.key === "tenant_type",
    )?.value;

    const filteredData = data.filter((item) => {
      return (
        (!nameFilterValue ||
          String(item.name || "")
            .toLowerCase()
            .includes(nameFilterValue.toLowerCase())) &&
        (!idFilterValue ||
          String(item.pid || "")
            .toLowerCase()
            .includes(idFilterValue.toLowerCase())) &&
        (!cityFilterValue ||
          String(item.city || "")
            .toLowerCase()
            .includes(cityFilterValue.toLowerCase())) &&
        (!regionFilterValue ||
          String(item.region || "")
            .toLowerCase()
            .includes(regionFilterValue.toLowerCase())) &&
        (!postalCodeFilterValue ||
          String(item.postal_code || "")
            .toLowerCase()
            .includes(postalCodeFilterValue.toLowerCase())) &&
        (!tenantTypeFilterValue ||
          String(item.tenant_type || "")
            .toLowerCase()
            .includes(tenantTypeFilterValue.toLowerCase()))
      );
    });

    setFilter(filteredData);
  };

  const onFilterFiledChange = (value: string, id: string) => {
    const changedFilterIndex = filters.findIndex((item) => {
      return item.id === id;
    });
    if (changedFilterIndex !== -1) {
      const newFilters = [...filters];
      newFilters[changedFilterIndex] = { id, key: value, value: "" };
      setFilters(newFilters);
    } else {
      setFilters([...filters, { id: v4(), key: value, value: "" }]);
    }
  };

  const onFilterValueChange = (value: string, id: string) => {
    const changedFilterIndex = filters.findIndex((item) => {
      return item.id === id;
    });
    const newFilters = [...filters];
    newFilters[changedFilterIndex] = {
      id,
      key: newFilters[changedFilterIndex].key,
      value: value,
    };
    setFilters(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    if (filters.length > 1) {
      const newFilters = filters.filter((_, i) => i !== index);
      setFilters(newFilters);
    } else {
      setFilters([{ id: v4(), key: "", value: "" }]);
    }
  };

  const handleAddFilter = () => {
    setFilters([...filters, { id: v4(), key: "", value: "" }]);
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        aria-describedby={"filter"}
        variant="contained"
        onClick={handleClick}
      >
        Open Filters
      </Button>
      <Popper
        id="filter"
        open={isFiltersVisible}
        sx={{ minWidth: "500px" }}
        transition
        anchorEl={anchorEl}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Box
                p={2}
                bgcolor="background.paper"
                borderRadius="8px"
                boxShadow={3}
              >
                {filters.map((filter, index) => (
                  <Box
                    key={filter.id}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                  >
                    <Select
                      value={filter.key}
                      onChange={(event) =>
                        onFilterFiledChange(event.target.value, filter.id)
                      }
                      displayEmpty
                      sx={{ width: "50%" }}
                      size="small"
                    >
                      <MenuItem value="" disabled>
                        Select Filed
                      </MenuItem>

                      {filterableFields.map((item) => {
                        const [[filterableFieldKey, filterableFieldValue]] =
                          Object.entries(item);
                        const isFilterVisible = !filters.find((filter) => {
                          return filterableFieldKey === filter.key;
                        });
                        return isFilterVisible ||
                          filters[index].key === filterableFieldKey ? (
                          <MenuItem value={filterableFieldKey}>
                            {filterableFieldValue}
                          </MenuItem>
                        ) : null;
                      })}
                    </Select>
                    {filter.key === "tenant_type" ? (
                      <TenantType />
                    ) : (
                      <Input
                        value={filter.value}
                        onChange={(event) =>
                          onFilterValueChange(event.target.value, filter.id)
                        }
                        placeholder="Input"
                        size="small"
                        sx={{ marginLeft: 1, width: "50%" }}
                      />
                    )}
                    <IconButton
                      onClick={() => handleRemoveFilter(index)}
                      color="error"
                      size="small"
                      sx={{ marginLeft: 1 }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                ))}
                <Box display="flex" justifyContent="space-between">
                  <Button onClick={handleAddFilter} variant="text" size="small">
                    Add Filter
                  </Button>
                  <Button onClick={onSubmit} variant="contained" size="small">
                    Save Filters
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default Filters;
