# Component Development Guide

## Creating Custom Components

### Stateless Components
```jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const MyComponent = ({ title, subtitle, children }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {subtitle && <Typography variant="caption">{subtitle}</Typography>}
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Box>
  );
};

export default MyComponent;
```

### Components with Hooks
```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const MyHookComponent = () => {
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data on mount
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch logic
  };

  if (loading) return <CircularProgress />;

  return <Box>{/* Content */}</Box>;
};

export default MyHookComponent;
```

## Reusable Component Patterns

### Props Destructuring
```jsx
const Card = ({ 
  title, 
  subtitle, 
  children, 
  sx = {}, 
  elevation = 1 
}) => {
  return <MuiCard elevation={elevation} sx={sx} />;
};
```

### Conditional Rendering
```jsx
const UserCard = ({ user, showEmail = true }) => {
  return (
    <>
      <Typography>{user.name}</Typography>
      {showEmail && <Typography>{user.email}</Typography>}
    </>
  );
};
```

### Component Composition
```jsx
const Dashboard = () => {
  return (
    <Box>
      <Header />
      <Content />
      <Footer />
    </Box>
  );
};
```

## MUI Styling

### Sx Prop (Recommended)
```jsx
<Box
  sx={{
    p: 3,
    mb: 2,
    backgroundColor: '#F5F7FA',
    borderRadius: 2,
    '&:hover': {
      boxShadow: 2,
    },
  }}
>
  Content
</Box>
```

### Spacing System
```jsx
// Padding/Margin: p/m + breakpoint (xs, sm, md, lg, xl) + value (0-5)
<Box sx={{ p: 2, mb: 3, pl: { xs: 1, sm: 2, md: 3 } }} />
```

### Responsive Design
```jsx
<Box
  sx={{
    display: { xs: 'block', sm: 'grid' },
    gridTemplateColumns: { sm: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
    gap: 2,
  }}
>
  {/* Items */}
</Box>
```

### Theme Colors
```jsx
const theme = useTheme();

<Box sx={{ color: theme.palette.primary.main }}>
  Styled text
</Box>
```

## Form Components

### Basic Form Component
```jsx
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

const MyForm = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### Form with Validation Schema
```jsx
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  email: yup.string().email('Invalid email').required(),
  password: yup.string().min(8, 'Min 8 characters').required(),
}).required();

const { control, handleSubmit } = useForm({
  resolver: yupResolver(schema),
});
```

## Custom Hooks

### Data Fetching Hook
```jsx
const useData = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};
```

### Local Storage Hook
```jsx
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, setStoredValue];
};
```

## Advanced Patterns

### Higher-Order Component (HOC)
```jsx
const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth(MyComponent);
```

### Render Props Pattern
```jsx
const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, [url]);

  return children({ data, loading });
};

// Usage
<DataFetcher url="/api/data">
  {({ data, loading }) => (
    loading ? <Spinner /> : <div>{data}</div>
  )}
</DataFetcher>
```

### Compound Components Pattern
```jsx
const Tab = ({ value, index, children }) => {
  return value === index && children;
};

const Tabs = ({ value, onChange, children }) => {
  return (
    <>
      {/* Tab buttons */}
      {children}
    </>
  );
};

// Usage
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value={0} index={0}>Content 1</Tab>
  <Tab value={1} index={1}>Content 2</Tab>
</Tabs>
```

## Performance Optimization

### Memoization
```jsx
import { memo } from 'react';

const MyComponent = memo(({ data }) => {
  return <div>{data}</div>;
});

export default MyComponent;
```

### useCallback
```jsx
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

<Button onClick={handleClick}>Click me</Button>
```

### useMemo
```jsx
const expensiveValue = useMemo(() => {
  return data.map(item => ({ ...item, value: item.price * quantity }));
}, [data, quantity]);
```

## Testing Components

### Unit Test Example
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Component Checklist

- [ ] Props documented with JSDoc
- [ ] Default props defined
- [ ] Error states handled
- [ ] Loading states handled
- [ ] Responsive design tested
- [ ] Accessibility considered (ARIA labels)
- [ ] Performance optimized
- [ ] Unit tests written
- [ ] Storybook story created (if applicable)

---

For more examples, check existing components in `src/components/`
