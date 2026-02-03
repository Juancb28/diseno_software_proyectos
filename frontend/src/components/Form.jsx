import { TextField, Button, Box } from "@mui/material";

function CustomForm({ fields, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    fields.forEach((f) => {
      data[f.name] = e.target[f.name].value;
    });
    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {fields.map((f) => (
        <TextField key={f.name} name={f.name} label={f.label} type={f.type || "text"} />
      ))}
      <Button type="submit" variant="contained">Guardar</Button>
    </Box>
  );
}

export default CustomForm;