import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useController, useFormContext } from "react-hook-form";
import { useDataContext } from "../../../../context/DataContext";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

const TenantType = () => {
  const { control } = useFormContext();
  const { data } = useDataContext();
  const [tenantOptions, setTenantOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!data) return;
    const options = Array.from(new Set(data.map((item) => item.tenant_type)));

    setTenantOptions(options);
  }, [data]);

  const { field } = useController({
    name: "tenant_type",
    control,
  });

  return (
    <Grid component="div" sx={{ width: "50%" }}>
      <Select
        fullWidth
        size="small"
        {...field}
        endAdornment={
          field.value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => field.onChange("")}>
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
