# SLUGHUB Result Management System - Frontend

A production-ready React.js (Vite) frontend for the SLUGHUB University Result Management System. This is a comprehensive system designed to manage results, grades, and academic records for 6 different user roles.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your API URL and settings

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Build for production**
   ```bash
   npm run build
   ```

## 📚 Technology Stack

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **Material UI (MUI)** - Component library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Yup** - Schema validation
- **Recharts** - Data visualization
- **Context API** - State management
- **JWT** - Authentication

## 📁 Project Structure

```
src/
├── api/                 # API service layer
│   ├── authApi.js
│   ├── studentApi.js
│   ├── courseApi.js
│   ├── resultApi.js
│   ├── gpaApi.js
│   ├── staffApi.js
│   ├── userApi.js
│   ├── adminApi.js
│   ├── departmentApi.js
│   ├── facultyApi.js
│   └── axiosInstance.js
│
├── assets/              # Images, icons, etc.
│
├── components/
│   ├── common/          # Shared components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── tables/          # Data table components
│   │   └── DataTable.jsx
│   ├── forms/           # Form components
│   │   └── FormBuilder.jsx
│   ├── cards/           # Card components
│   │   ├── StatCard.jsx
│   │   ├── ChartCard.jsx
│   │   └── UserCard.jsx
│   └── charts/          # Chart components
│       └── ChartComponents.jsx
│
├── contexts/            # Global state
│   └── AuthContext.jsx
│
├── hooks/               # Custom hooks
│   └── useApi.js
│
├── layouts/
│   ├── MainLayout.jsx
│   └── AuthLayout.jsx
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── UnauthorizedPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── admin/           # Admin pages
│   ├── lecturer/        # Lecturer pages
│   ├── hod/            # HOD pages
│   ├── dean/           # Dean pages
│   ├── examOfficer/    # Exam Officer pages
│   └── student/        # Student pages
│
├── routes/
│   ├── index.jsx        # Main router
│   └── ProtectedRoute.jsx
│
├── utils/
│   ├── theme.js         # MUI theme
│   └── helpers.js       # Utility functions
│
├── App.jsx              # Root component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🔐 Authentication

### Login Flow
1. User enters email and password
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Token automatically added to all API requests
5. On page refresh, user remains logged in if token valid

### Role-Based Access
6 different roles with specific permissions:
- **Admin** - Full system access
- **Lecturer** - Result management
- **HOD** - Department oversight
- **Dean** - Faculty management  
- **Exam Officer** - Result processing
- **Student** - View results

### Protected Routes
```jsx
<Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><MainLayout /></ProtectedRoute>} />
```

## 🎨 UI/UX

### Color Scheme
- **Primary**: #0F4C81 (University Blue)
- **Secondary**: #1ABC9C (Teal)
- **Background**: #F5F7FA (Light Gray)
- **Text Primary**: #2C3E50 (Dark Gray)
- **Text Secondary**: #7F8C8D (Medium Gray)

### Component Usage

**StatCard** - Display key metrics
```jsx
<StatCard 
  title="Total Students" 
  value="1,250" 
  icon={SchoolIcon} 
  color="primary" 
/>
```

**DataTable** - Display tabular data
```jsx
<DataTable
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' }
  ]}
  rows={users}
  pagination={true}
  search={true}
/>
```

**ChartCard** - Display charts
```jsx
<ChartCard title="Student Distribution">
  <PieChartComponent data={data} />
</ChartCard>
```

## 🔌 API Integration

### Adding New API Endpoints

1. **Create API service** (`src/api/newApi.js`)
   ```javascript
   import axiosInstance from './axiosInstance';
   
   export const newApi = {
     getAll: (params) => axiosInstance.get('/endpoint', { params }),
     getById: (id) => axiosInstance.get(`/endpoint/${id}`),
     create: (data) => axiosInstance.post('/endpoint', data),
     update: (id, data) => axiosInstance.put(`/endpoint/${id}`, data),
     delete: (id) => axiosInstance.delete(`/endpoint/${id}`),
   };
   ```

2. **Use in components**
   ```javascript
   import { useApi } from '../hooks/useApi';
   import { newApi } from '../api/newApi';
   
   const { data, loading, execute } = useApi(newApi.getAll);
   ```

## 🎯 Common Workflows

### Display List with Actions
```jsx
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchItems();
}, []);

const fetchItems = async () => {
  try {
    setLoading(true);
    const response = await itemApi.getAll();
    setItems(response.data);
  } finally {
    setLoading(false);
  }
};

<DataTable
  columns={columns}
  rows={items}
  loading={loading}
  actions={(row) => [
    <Button onClick={() => handleEdit(row)}>Edit</Button>,
    <Button onClick={() => handleDelete(row.id)}>Delete</Button>,
  ]}
/>
```

### Form with Validation
```jsx
import * as yup from 'yup';
import FormBuilder from '../components/forms/FormBuilder';

const schema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required(),
});

const fields = [
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'name', label: 'Name' },
];

<FormBuilder
  fields={fields}
  schema={schema}
  onSubmit={async (data) => {
    await itemApi.create(data);
  }}
/>
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Environment Variables for Production
```
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=SLUGHUB
VITE_JWT_STORAGE_KEY=slughub_token
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **xs**: 0px - 600px (Mobile)
- **sm**: 600px - 960px (Tablet)
- **md**: 960px - 1264px (Small Desktop)
- **lg**: 1264px - 1904px (Desktop)
- **xl**: 1904px+ (Large Desktop)

## 🐛 Debugging

### Enable Verbose Logging
Add to `.env.local`:
```
VITE_DEBUG=true
```

### Common Issues

**CORS Errors**
- Ensure backend API is running
- Check `VITE_API_URL` in `.env.local`
- Verify backend CORS configuration

**Login Issues**
- Clear browser storage (F12 > Application > Storage)
- Check token expiration
- Verify backend authentication endpoint

**Page Not Loading**
- Check browser console for errors
- Verify route configuration
- Check component imports

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [Material UI Documentation](https://mui.com)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support, contact the development team or check the documentation.

---

**Version**: 1.0.0  
**Last Updated**: June 2026
