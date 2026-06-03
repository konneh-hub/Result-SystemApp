# Setup and Development Guide

## Initial Setup

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Configure Environment

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=SLUGHUB
VITE_JWT_STORAGE_KEY=slughub_token
```

**API_URL**: Backend API server address (default: http://localhost:5000)  
**APP_NAME**: Application name for display  
**JWT_STORAGE_KEY**: LocalStorage key for JWT token

### 3. Start Development Server
```bash
npm run dev
```

Application will open at http://localhost:3000

## Demo Credentials

### Admin
- Email: `admin@university.edu`
- Password: `Admin@123`

### Lecturer
- Email: `lecturer@university.edu`
- Password: `Lecturer@123`

### HOD
- Email: `hod@university.edu`
- Password: `HOD@123`

### Dean
- Email: `dean@university.edu`
- Password: `Dean@123`

### Exam Officer
- Email: `examofficer@university.edu`
- Password: `Officer@123`

### Student
- Email: `student@university.edu`
- Password: `Student@123`

## Project Structure Overview

### API Layer (`src/api/`)
Organized by resource with consistent patterns:
- `GET` - Fetch data
- `POST` - Create data
- `PUT` - Update data
- `DELETE` - Remove data

All requests automatically include JWT token via axios interceptor.

### Context API (`src/contexts/`)
**AuthContext** handles:
- User login/logout
- Token management
- Role-based access control
- Auto-login on page refresh

### Custom Hooks (`src/hooks/`)
**useApi** - Wrapper for API calls with loading/error states  
**useForm** - Form state management  
**usePagination** - Pagination logic  
**useLocalStorage** - Persist data to localStorage

### Components

**Common Components**
- `Header` - Top navigation bar
- `Sidebar` - Role-based menu
- `Footer` - Application footer

**Reusable Components**
- `StatCard` - Display metrics
- `DataTable` - Paginated table with search/filter
- `ChartCard` - Chart container
- `UserCard` - User profile card
- `FormBuilder` - Dynamic form builder

**Chart Components**
- `BarChartComponent`
- `LineChartComponent`
- `PieChartComponent`

### Pages

Organized by role:
- `admin/` - System administration
- `lecturer/` - Course and result management
- `hod/` - Department oversight
- `dean/` - Faculty management
- `examOfficer/` - Result processing
- `student/` - Student portal

Each role has specific dashboards and workflows.

### Routing (`src/routes/`)

**Protected Routes** - Require authentication  
**Role Routes** - Role-specific access  
**Public Routes** - Authentication pages

Protected routes redirect unauthenticated users to login.  
Role-based routes show "Unauthorized" if user lacks permissions.

## Development Workflow

### Creating a New Page

1. **Create page component**
   ```jsx
   // src/pages/admin/NewPage.jsx
   import React from 'react';
   import { Box, Typography } from '@mui/material';

   const NewPage = () => (
     <Box>
       <Typography variant="h4">New Page</Typography>
     </Box>
   );

   export default NewPage;
   ```

2. **Add route** in `src/routes/index.jsx`
   ```jsx
   <Route path="new-page" element={<NewPage />} />
   ```

3. **Add navigation** in `src/components/common/Sidebar.jsx`
   ```javascript
   { icon: SomeIcon, label: 'New Page', path: '/admin/new-page' }
   ```

### Fetching Data

```jsx
import { useEffect, useState } from 'react';
import { itemApi } from '../../api/itemApi';

const MyComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemApi.getAll();
      setItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return <DataTable columns={columns} rows={items} />;
};
```

### Using Forms

```jsx
import * as yup from 'yup';
import FormBuilder from '../../components/forms/FormBuilder';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  name: yup.string().required('Name required'),
});

const fields = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'name', label: 'Full Name', required: true },
];

const handleSubmit = async (data) => {
  try {
    await itemApi.create(data);
    // Handle success
  } catch (error) {
    // Handle error
  }
};

<FormBuilder 
  fields={fields} 
  schema={schema} 
  onSubmit={handleSubmit}
/>
```

## Build Commands

### Development
```bash
npm run dev       # Start dev server with hot reload
```

### Production
```bash
npm run build     # Build optimized production bundle
npm run preview   # Preview production build locally
```

### Linting
```bash
npm run lint      # Check code quality
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **Lazy Load Routes**
   ```jsx
   const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
   ```

2. **Optimize Images** - Use appropriate formats and sizes

3. **Code Splitting** - Automatic with Vite

4. **Memoization** - Use React.memo for expensive components

5. **API Caching** - Implement request caching for repeated calls

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
1. Verify backend is running
2. Check `VITE_API_URL` in `.env.local`
3. Check CORS headers from backend
4. Open browser DevTools Network tab for details

### Authentication Issues
1. Clear localStorage: `localStorage.clear()`
2. Check token expiration in JWT
3. Verify backend authentication endpoint

## Best Practices

### Code Organization
- One component per file
- Keep components focused and small
- Use index.js for clean imports

### Naming Conventions
- Components: PascalCase (e.g., `UserCard.jsx`)
- Files: PascalCase for components, camelCase for utilities
- Functions: camelCase (e.g., `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)

### State Management
- Use Context for global state
- Use useState for component state
- Use localStorage for persistence

### Error Handling
- Always handle API errors with try-catch
- Show user-friendly error messages
- Log errors to console in development

### Comments
- Comment complex logic
- Document component props
- Explain API integration patterns

## Next Steps

1. **Customize Theme** - Edit `src/utils/theme.js`
2. **Add More Pages** - Follow page creation workflow
3. **Implement Features** - Use provided API services
4. **Deploy** - Build and deploy to hosting platform

---

Need help? Check the main README.md or contact the development team.
