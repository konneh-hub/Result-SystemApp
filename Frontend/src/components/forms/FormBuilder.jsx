import React from 'react';
import { TextField, Box, Button, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  control,
  errors,
  fullWidth = true,
  required = false,
  multiline = false,
  rows = 4,
  options = [],
  disabled = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (type === 'select') {
          return (
            <TextField
              {...field}
              select
              label={label}
              fullWidth={fullWidth}
              error={!!errors[name]}
              helperText={errors[name]?.message}
              disabled={disabled}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select {label}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </TextField>
          );
        }

        return (
          <TextField
            {...field}
            label={label}
            type={type}
            placeholder={placeholder}
            fullWidth={fullWidth}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            required={required}
            multiline={multiline}
            rows={rows}
            disabled={disabled}
          />
        );
      }}
    />
  );
};

const FormBuilder = ({ fields, onSubmit, schema, loading = false, submitButtonText = 'Submit' }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues: fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {}),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {fields.map((field) => (
          <Box
            key={field.name}
            sx={{
              gridColumn: field.fullWidth || field.type === 'textarea' ? '1 / -1' : 'auto',
            }}
          >
            <FormField {...field} control={control} errors={errors} />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button variant="outlined" type="reset">
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : submitButtonText}
        </Button>
      </Box>
    </form>
  );
};

export default FormBuilder;
