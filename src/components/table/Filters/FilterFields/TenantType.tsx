import { IconButton, InputAdornment, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useDataContext } from "../../../../context/DataContext";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

interface TenantTypeProps {
  value: string;
  onChange: (value: string, id: string) => void;
  id: string;
}

const TenantType = ({ value, onChange, id }: TenantTypeProps) => {
  const { data } = useDataContext();
  const [tenantOptions, setTenantOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!data) return;
    const options = Array.from(new Set(data.map((item) => item.tenant_type)));

    setTenantOptions(options);
  }, [data]);

  return (
    <Grid component="div" sx={{ width: "50%" }}>
      <Select
        fullWidth
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value, id)}
        endAdornment={
          value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange("", id)}>
                <Close />
              </IconButton>
            </InputAdornment>
          )
        }
      >
        {tenantOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  );
};

export default TenantType;
