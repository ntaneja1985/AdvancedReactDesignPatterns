# React API Layer Implementation with Axios

## Summary

Building a centralized API layer that abstracts HTTP requests from components, providing maintainability, consistency, and separation of concerns.

## Architecture Overview

```
Components → Custom Hooks → API Layer → Backend Server
     ↑            ↑            ↑
   UI Logic   State Mgmt   HTTP Calls
```


## 1. Base API Configuration

### File: `src/api/api.js`

```javascript
import axios from 'axios';

// Base configuration
const axiosParams = {
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : 'https://your-production-api.com'
};

// Create axios instance
const axiosInstance = axios.create(axiosParams);

// API wrapper function
const api = (axiosInstance) => {
  return {
    get: (url, config = {}) => axiosInstance.get(url, config),
    delete: (url, config = {}) => axiosInstance.delete(url, config),
    post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
    patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
    put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  };
};

export default api(axiosInstance);
```


## 2. Feature-Based API Files

### File: `src/api/usersApi.js`

```javascript
import api from './api';

const URLs = {
  fetchUsers: 'users'
};

export const fetchUsers = (config = {}) => {
  return api.get(URLs.fetchUsers, {
    baseURL: 'https://jsonplaceholder.typicode.com/', // External API
    ...config
  });
};

export const createUser = (userData, config = {}) => {
  return api.post(URLs.fetchUsers, userData, config);
};

export const updateUser = (userId, userData, config = {}) => {
  return api.put(`${URLs.fetchUsers}/${userId}`, userData, config);
};

export const deleteUser = (userId, config = {}) => {
  return api.delete(`${URLs.fetchUsers}/${userId}`, config);
};
```


## 3. Custom Hook Implementation

### File: `src/components/Users.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../api/usersApi';
import styled from 'styled-components';

// Custom hook for user data
const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initFetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, initFetchUsers };
};

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const FetchButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
`;

const UserCard = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
`;

// Main component
const Users = () => {
  const { users, loading, error, initFetchUsers } = useFetchUsers();

  useEffect(() => {
    initFetchUsers(); // Fetch on mount
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <FetchButton onClick={initFetchUsers}>
        Fetch Users
      </FetchButton>
      
      <div>
        {users.map(user => (
          <UserCard key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </UserCard>
        ))}
      </div>
    </Container>
  );
};

export default Users;
```


## 4. Usage in App Component

### File: `src/App.jsx`

```javascript
import React from 'react';
import Users from './components/Users';

function App() {
  return (
    <div className="App">
      <h1>API Layer Demo</h1>
      <Users />
    </div>
  );
}

export default App;
```


## Advanced API Layer Features

### 1. Request/Response Interceptors

```javascript
// src/api/api.js
const axiosInstance = axios.create(axiosParams);

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```


### 2. Error Handling

```javascript
// src/api/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data.message || 'Server Error',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Network Error - No response from server',
      status: 'NETWORK_ERROR'
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'Unknown Error',
      status: 'UNKNOWN_ERROR'
    };
  }
};
```


### 3. Generic API Hook

```javascript
// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { handleApiError } from '../api/errorHandler';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...params);
      setData(response.data);
      return response.data;
    } catch (err) {
      const handledError = handleApiError(err);
      setError(handledError);
      throw handledError;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};

// Usage
const UsersList = () => {
  const { data: users, loading, error, execute: fetchUsers } = useApi(fetchUsers);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {users && users.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
};
```


## Folder Structure

```
src/
├── api/
│   ├── api.js              # Base configuration
│   ├── usersApi.js         # User endpoints
│   ├── productsApi.js      # Product endpoints
│   └── errorHandler.js     # Error handling utilities
├── hooks/
│   └── useApi.js           # Generic API hook
└── components/
    └── Users.jsx           # Component with custom hook
```


## Benefits of API Layer

### ✅ **Centralized Configuration**

- Single place for base URL, headers, interceptors
- Easy environment switching
- Consistent error handling


### ✅ **Maintainability**

- API changes only require updates in one place
- Clear separation of concerns
- Easy to mock for testing


### ✅ **Reusability**

- HTTP methods wrapped and reusable
- Custom hooks can be shared across components
- Feature-based organization


### ✅ **Type Safety (with TypeScript)**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

export const fetchUsers = (): Promise<AxiosResponse<User[]>> => {
  return api.get<User[]>('/users');
};
```


## Main Interview Points

1. **Separation of Concerns**: Components don't handle HTTP logic directly
2. **Axios Instance**: Centralized configuration with interceptors
3. **Feature-Based APIs**: Organize endpoints by business domain
4. **Custom Hooks**: Abstract API calls into reusable hooks
5. **Error Handling**: Centralized error processing and user feedback
6. **Environment Configuration**: Different URLs for dev/prod environments

**Key Insight**: *"Abstract the 'how' so components focus on the 'what'"* - components shouldn't care about HTTP details, just data.

# React API State Management: From Manual to Optimized

## Summary

Evolution from manual state handling (loading, error states) to a unified API status pattern with helper utilities for cleaner, more maintainable code.

## Problem: Manual State Management

### ❌ Before - Multiple State Variables

```jsx
const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initFetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { users, isLoading, error, initFetchUsers };
};

// Component usage - complex conditional logic
const Users = () => {
  const { users, isLoading, error, initFetchUsers } = useFetchUsers();

  // ❌ Complex state checking for initial render
  if (!isLoading && users.length === 0 && !error) {
    return <h1>Welcome to my site</h1>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {users.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
};
```

**Problems:**

- Multiple states for one API action
- Complex conditional logic
- Duplicate code across different API calls
- Prone to typos in string literals


## Solution 1: API Status Constants

### Define Standard API States

```jsx
// At top of component file or separate constants file
const API_STATUS = {
  IDLE: 'idle',       // Initial state, no action performed
  PENDING: 'pending', // API call in progress
  SUCCESS: 'success', // API call completed successfully
  ERROR: 'error'      // API call failed
};
```


### Single Status State

```jsx
const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [fetchUsersStatus, setFetchUsersStatus] = useState(API_STATUS.IDLE);
  const [error, setError] = useState(null);

  const initFetchUsers = async () => {
    setFetchUsersStatus(API_STATUS.PENDING);
    setError(null);
    
    try {
      const response = await fetchUsers();
      setUsers(response.data);
      setFetchUsersStatus(API_STATUS.SUCCESS);
    } catch (err) {
      setError(err);
      setFetchUsersStatus(API_STATUS.ERROR);
    }
  };

  return { users, fetchUsersStatus, error, initFetchUsers };
};
```


### Cleaner Component Logic

```jsx
const Users = () => {
  const { users, fetchUsersStatus, error, initFetchUsers } = useFetchUsers();

  useEffect(() => {
    initFetchUsers(); // Auto-fetch on mount
  }, []);

  // ✅ Clear state-based rendering
  if (fetchUsersStatus === API_STATUS.IDLE) {
    return <h1>Welcome to my site</h1>;
  }

  if (fetchUsersStatus === API_STATUS.PENDING) {
    return <div>Loading...</div>;
  }

  if (fetchUsersStatus === API_STATUS.ERROR) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      <button onClick={initFetchUsers}>Refresh Users</button>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```


## Solution 2: Async Helper Utility

### Create Reusable Async Handler

```jsx
// src/helpers/withAsync.js
export const withAsync = async (fn) => {
  // Validate input
  if (typeof fn !== 'function') {
    throw new Error('Argument must be a function');
  }

  try {
    const { data } = await fn(); // Execute API call and extract data
    return { response: data, error: null };
  } catch (error) {
    return { response: null, error };
  }
};
```


### Clean Hook Implementation

```jsx
import { withAsync } from '../helpers/withAsync';

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [fetchUsersStatus, setFetchUsersStatus] = useState(API_STATUS.IDLE);

  const initFetchUsers = async () => {
    setFetchUsersStatus(API_STATUS.PENDING);

    // ✅ Clean async handling - no try/catch needed
    const { response, error } = await withAsync(fetchUsers);

    if (error) {
      setFetchUsersStatus(API_STATUS.ERROR);
      // Handle error (could store in state if needed)
    } else {
      setUsers(response);
      setFetchUsersStatus(API_STATUS.SUCCESS);
    }
  };

  return { users, fetchUsersStatus, initFetchUsers };
};
```


## Advanced: Generic API Hook

### Reusable Hook for Any API Call

```jsx
// src/hooks/useApiCall.js
import { useState } from 'react';
import { withAsync } from '../helpers/withAsync';

const API_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending', 
  SUCCESS: 'success',
  ERROR: 'error'
};

export const useApiCall = (apiFunction) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(API_STATUS.IDLE);
  const [error, setError] = useState(null);

  const execute = async (...params) => {
    setStatus(API_STATUS.PENDING);
    setError(null);

    const { response, error: apiError } = await withAsync(() => apiFunction(...params));

    if (apiError) {
      setError(apiError);
      setStatus(API_STATUS.ERROR);
    } else {
      setData(response);
      setStatus(API_STATUS.SUCCESS);
    }
  };

  return {
    data,
    status,
    error,
    execute,
    isIdle: status === API_STATUS.IDLE,
    isPending: status === API_STATUS.PENDING,
    isSuccess: status === API_STATUS.SUCCESS,
    isError: status === API_STATUS.ERROR
  };
};
```


### Usage with Any API Function

```jsx
import { useApiCall } from '../hooks/useApiCall';
import { fetchUsers, createUser, updateUser } from '../api/usersApi';

const Users = () => {
  const { data: users, status, error, execute: loadUsers, isPending } = useApiCall(fetchUsers);
  const { execute: addUser, isPending: isCreating } = useApiCall(createUser);

  useEffect(() => {
    loadUsers(); // Auto-load on mount
  }, []);

  const handleAddUser = async (userData) => {
    await addUser(userData);
    loadUsers(); // Refresh list after adding
  };

  if (status === 'idle') return <h1>Welcome to my site</h1>;
  if (isPending) return <div>Loading users...</div>;
  if (status === 'error') return <div>Error: {error?.message}</div>;

  return (
    <div>
      <button onClick={loadUsers} disabled={isPending}>
        Refresh Users
      </button>
      
      <button onClick={() => handleAddUser({ name: 'New User' })} disabled={isCreating}>
        {isCreating ? 'Adding...' : 'Add User'}
      </button>

      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```


## Constants Organization

### Separate Constants File

```jsx
// src/constants/apiStatus.js
export const API_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success', 
  ERROR: 'error'
} as const;

// For TypeScript users
export type ApiStatus = typeof API_STATUS[keyof typeof API_STATUS];
```


### Import and Use

```jsx
import { API_STATUS } from '../constants/apiStatus';

const MyComponent = () => {
  const [status, setStatus] = useState(API_STATUS.IDLE);
  
  // ✅ No typos, IntelliSense support
  if (status === API_STATUS.PENDING) {
    return <LoadingSpinner />;
  }
};
```


## Benefits Summary

### ✅ **Unified State Management**

- Single state variable instead of multiple boolean flags
- Standardized across all API calls
- Clear state transitions


### ✅ **Better Developer Experience**

- No more typos in status strings
- IntelliSense support with constants
- Consistent patterns across codebase


### ✅ **Reduced Complexity**

- Simpler conditional logic
- Reusable helper utilities
- Generic hooks for common patterns


### ✅ **Maintainability**

- Easy to add new API states if needed
- Centralized error handling
- Clear separation of concerns


## Main Interview Points

1. **API State Pattern**: Use IDLE, PENDING, SUCCESS, ERROR states instead of multiple booleans
2. **Helper Utilities**: Abstract try/catch logic into reusable functions
3. **Constants Usage**: Prevent typos and improve maintainability
4. **Generic Hooks**: Create reusable patterns for common API operations
5. **State Consolidation**: Single source of truth for API status
6. **Error Handling**: Consistent error handling across all API calls

**Key Insight**: *"Standardize your async patterns"* - having consistent API state management makes code predictable and maintainable across the entire application.


# API Status Management: From Constants to Boolean Helpers

## Summary

Evolution from string literals to constants, then to boolean helper hooks for cleaner, type-safe API status management.

## Problem: String Literals and Inconsistency

### ❌ Before - Magic Strings

```jsx
const useFetchUsers = () => {
  const [fetchUsersStatus, setFetchUsersStatus] = useState('idle');

  const initFetchUsers = async () => {
    setFetchUsersStatus('pending');  // ❌ Prone to typos
    try {
      const response = await fetchUsers();
      setFetchUsersStatus('success'); // ❌ Could be 'resolved'?
    } catch (error) {
      setFetchUsersStatus('error');   // ❌ Could be 'failed'?
    }
  };
};

// Component usage - string comparisons everywhere
if (fetchUsersStatus === 'pending') { /* ... */ }  // ❌ Typo-prone
```


## Solution 1: Constants File

### File: `src/constants/apiStatus.js`

```javascript
// Individual constants
export const IDLE = 'idle';
export const PENDING = 'pending';
export const SUCCESS = 'success';
export const ERROR = 'error';

// Object version for dot notation
export const API_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending', 
  SUCCESS: 'success',
  ERROR: 'error'
};

// Array version for iteration (mentioned for future use)
export const API_STATUSES = Object.values(API_STATUS);
```


### Usage with Constants

```jsx
import { API_STATUS } from '../constants/apiStatus';

const useFetchUsers = () => {
  const [fetchUsersStatus, setFetchUsersStatus] = useState(API_STATUS.IDLE);

  // ✅ No typos, autocomplete support
  const initFetchUsers = async () => {
    setFetchUsersStatus(API_STATUS.PENDING);
    
    const { response, error } = await withAsync(fetchUsers);
    
    if (error) {
      setFetchUsersStatus(API_STATUS.ERROR);
    } else {
      setUsers(response);
      setFetchUsersStatus(API_STATUS.SUCCESS);
    }
  };
};

// Component usage
if (fetchUsersStatus === API_STATUS.PENDING) { /* ✅ Type-safe */ }
```


## Solution 2: Boolean Helper Hook

### Custom Hook: `src/api/hooks/useApiStatus.js`

```javascript
import { useState, useMemo } from 'react';
import { API_STATUS, API_STATUSES } from '../../constants/apiStatus';

// Helper function to capitalize strings
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generate boolean status object
const prepareStatuses = (currentStatus) => {
  const statuses = {};
  
  for (const status of API_STATUSES) {
    // Create keys like: isIdle, isPending, isSuccess, isError
    const normalizedStatus = capitalize(status.toLowerCase());
    const key = `is${normalizedStatus}`;
    
    // Only the current status will be true
    statuses[key] = status === currentStatus;
  }
  
  return statuses;
};

export const useApiStatus = (initialStatus = API_STATUS.IDLE) => {
  const [status, setStatus] = useState(initialStatus);
  
  // Memoize status object to prevent unnecessary recalculations
  const statuses = useMemo(() => prepareStatuses(status), [status]);
  
  return {
    status,                    // Current status string
    setStatus,                 // Status setter
    ...statuses               // isIdle, isPending, isSuccess, isError
  };
};
```


### Enhanced Hook Usage

```jsx
import { useApiStatus } from '../api/hooks/useApiStatus';
import { API_STATUS } from '../constants/apiStatus';

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const {
    status: fetchUsersStatus,
    setStatus: setFetchUsersStatus,
    isIdle: isFetchUsersIdle,
    isPending: isFetchUsersPending,
    isSuccess: isFetchUsersSuccess,
    isError: isFetchUsersError
  } = useApiStatus(API_STATUS.IDLE);

  const initFetchUsers = async () => {
    setFetchUsersStatus(API_STATUS.PENDING);
    
    const { response, error } = await withAsync(fetchUsers);
    
    if (error) {
      setFetchUsersStatus(API_STATUS.ERROR);
    } else {
      setUsers(response);
      setFetchUsersStatus(API_STATUS.SUCCESS);
    }
  };

  return {
    users,
    fetchUsersStatus,
    isFetchUsersIdle,
    isFetchUsersPending,
    isFetchUsersSuccess,
    isFetchUsersError,
    initFetchUsers
  };
};
```


### Clean Component Logic

```jsx
const Users = () => {
  const {
    users,
    isFetchUsersIdle,
    isFetchUsersPending,
    isFetchUsersSuccess,
    isFetchUsersError,
    initFetchUsers
  } = useFetchUsers();

  useEffect(() => {
    initFetchUsers();
  }, []);

  // ✅ Clean boolean checks instead of string comparisons
  if (isFetchUsersIdle) {
    return <h1>Welcome to my site</h1>;
  }

  if (isFetchUsersPending) {
    return <div>Loading users...</div>;
  }

  if (isFetchUsersError) {
    return <div>Failed to load users</div>;
  }

  if (isFetchUsersSuccess) {
    return (
      <div>
        <button onClick={initFetchUsers}>Refresh Users</button>
        {users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
};
```


## How the Boolean Generation Works

### Step-by-Step Breakdown

```javascript
// Input: currentStatus = 'pending'
// API_STATUSES = ['idle', 'pending', 'success', 'error']

const prepareStatuses = (currentStatus) => {
  const statuses = {};
  
  // Loop through each status
  for (const status of API_STATUSES) {
    // status = 'idle'     → normalizedStatus = 'Idle'     → key = 'isIdle'
    // status = 'pending'  → normalizedStatus = 'Pending'  → key = 'isPending' 
    // status = 'success'  → normalizedStatus = 'Success'  → key = 'isSuccess'
    // status = 'error'    → normalizedStatus = 'Error'    → key = 'isError'
    
    const normalizedStatus = capitalize(status.toLowerCase());
    const key = `is${normalizedStatus}`;
    
    // Only 'isPending' will be true when currentStatus = 'pending'
    statuses[key] = status === currentStatus;
  }
  
  return statuses;
  // Result: { isIdle: false, isPending: true, isSuccess: false, isError: false }
};
```


## Feature-Based Organization

### Folder Structure

```
src/
├── constants/
│   └── apiStatus.js          # Global constants
├── api/
│   └── hooks/                # API-specific hooks
│       └── useApiStatus.js   # Status management hook
└── components/
    └── Users.jsx             # Component using the hook
```

**Why in `/api/hooks/`?**

- Hook is specifically for API status management
- Keeps related functionality close together
- Not globally reusable outside API context


## Advanced: TypeScript Version

### With TypeScript Support

```typescript
// constants/apiStatus.ts
export const API_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export type ApiStatus = typeof API_STATUS[keyof typeof API_STATUS];

// useApiStatus.ts
interface StatusBooleans {
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseApiStatusReturn extends StatusBooleans {
  status: ApiStatus;
  setStatus: (status: ApiStatus) => void;
}

export const useApiStatus = (initialStatus: ApiStatus = API_STATUS.IDLE): UseApiStatusReturn => {
  // Implementation...
};
```


## Benefits Summary

### ✅ **Type Safety \& DX**

```jsx
// ✅ Autocomplete support
API_STATUS.PENDING  // IntelliSense shows available options

// ✅ No typos
if (isPending) { /* Clean boolean check */ }

// ❌ vs string comparison prone to errors  
if (status === 'pendng') { /* Typo! */ }
```


### ✅ **Performance Optimization**

```jsx
// useMemo prevents recalculation on every render
const statuses = useMemo(() => prepareStatuses(status), [status]);
```


### ✅ **Consistency Across Team**

- Constants prevent different naming conventions
- Boolean helpers provide uniform API
- Clear patterns for new developers


### ✅ **Maintainability**

- Single source of truth for status values
- Easy to add new statuses if needed
- Refactoring is safer with constants


## Main Interview Points

1. **Constants Over Strings**: Prevent typos and ensure consistency
2. **Boolean Helpers**: Cleaner conditional logic than string comparisons
3. **Feature-Based Organization**: Keep API-related hooks close to API layer
4. **Performance Optimization**: useMemo for expensive calculations
5. **Type Safety**: Constants provide better developer experience
6. **Team Consistency**: Standardized patterns across codebase

**Key Insight**: *"Make impossible states impossible"* - boolean helpers ensure only one status is true at a time, preventing impossible state combinations.

# Preventing Flickering Loaders in React

## Summary

Creating a lazy loader component that delays showing loading indicators to prevent flickering when API responses are very fast (under 500ms).

## Problem: Flickering Loaders

### ❌ The Issue

```jsx
const Users = () => {
  const { isFetchUsersPending, initFetchUsers } = useFetchUsers();

  // ❌ Shows loader immediately, even for 100ms API calls
  if (isFetchUsersPending) {
    return <div>Loading...</div>;  // Flickers on fast responses
  }

  return (
    <button onClick={initFetchUsers}>
      Fetch Users
    </button>
  );
};
```

**Problem:** Fast API responses (< 500ms) cause loading indicators to flash briefly, creating poor UX.

## Solution: Lazy Loader Component

### File: `src/components/LazyLoader.jsx`

```jsx
import { useState, useEffect } from 'react';

const LazyLoader = ({ 
  show = false,           // Should loader be shown?
  delay = 0,             // Delay in milliseconds before showing
  children,              // Loading content (spinner, text, etc.)
  fallback              // Content to show when not loading
}) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout;

    // If show is false, hide loader immediately
    if (!show) {
      setShowLoader(false);
      return;
    }

    // If delay is 0, show loader immediately
    if (delay === 0) {
      setShowLoader(true);
      return;
    }

    // Otherwise, wait for delay before showing loader
    timeout = setTimeout(() => {
      setShowLoader(true);
    }, delay);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [show, delay]);

  return showLoader ? children : (fallback || null);
};

export default LazyLoader;
```


### Usage in Component

```jsx
import LazyLoader from './LazyLoader';

const Users = () => {
  const {
    users,
    isFetchUsersPending,
    initFetchUsers
  } = useFetchUsers();

  useEffect(() => {
    initFetchUsers();
  }, []);

  return (
    <div>
      <LazyLoader
        show={isFetchUsersPending}
        delay={500}                    // Wait 500ms before showing loader
        fallback="Fetch Users"        // Show this when not loading
      >
        Loading...                     {/* Show this after delay */}
      </LazyLoader>
      
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```


## How It Works

### Timeline for Fast API (200ms response)

```
0ms:    User clicks button
0ms:    show=true, start 500ms timer
200ms:  API responds, show=false
200ms:  Timer cancelled, loader never shows
Result: No flickering ✅
```


### Timeline for Slow API (800ms response)

```
0ms:    User clicks button
0ms:    show=true, start 500ms timer
500ms:  Timer fires, showLoader=true, display loader
800ms:  API responds, show=false, hide loader
Result: Loader shown only when needed ✅
```


## Advanced: Enhanced Lazy Loader

### With More Features

```jsx
import { useState, useEffect } from 'react';

const LazyLoader = ({
  show = false,
  delay = 300,
  minShowTime = 0,        // Minimum time to show loader (prevents flash)
  children,
  fallback = null,
  className = ''
}) => {
  const [showLoader, setShowLoader] = useState(false);
  const [showStartTime, setShowStartTime] = useState(null);

  useEffect(() => {
    let showTimeout;
    let hideTimeout;

    if (!show) {
      // If loader is currently shown and has minShowTime
      if (showLoader && minShowTime > 0 && showStartTime) {
        const elapsedTime = Date.now() - showStartTime;
        const remainingTime = minShowTime - elapsedTime;

        if (remainingTime > 0) {
          // Wait for remaining time before hiding
          hideTimeout = setTimeout(() => {
            setShowLoader(false);
            setShowStartTime(null);
          }, remainingTime);
          return () => clearTimeout(hideTimeout);
        }
      }

      setShowLoader(false);
      setShowStartTime(null);
      return;
    }

    if (delay === 0) {
      setShowLoader(true);
      setShowStartTime(Date.now());
      return;
    }

    showTimeout = setTimeout(() => {
      setShowLoader(true);
      setShowStartTime(Date.now());
    }, delay);

    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [show, delay, minShowTime, showLoader, showStartTime]);

  if (!showLoader) {
    return fallback;
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};
```


### Usage with Enhanced Features

```jsx
<LazyLoader
  show={isFetchUsersPending}
  delay={400}              // Wait 400ms before showing
  minShowTime={300}        // Show for at least 300ms to avoid flash
  fallback={
    <button onClick={initFetchUsers}>
      Fetch Users
    </button>
  }
>
  <div className="spinner">
    <LoadingSpinner />
    <span>Loading users...</span>
  </div>
</LazyLoader>
```


## Reusable Hook Version

### Custom Hook Implementation

```jsx
// hooks/useDelayedLoader.js
import { useState, useEffect } from 'react';

export const useDelayedLoader = (show, delay = 300, minShowTime = 0) => {
  const [showLoader, setShowLoader] = useState(false);
  const [showStartTime, setShowStartTime] = useState(null);

  useEffect(() => {
    let showTimeout;
    let hideTimeout;

    if (!show) {
      if (showLoader && minShowTime > 0 && showStartTime) {
        const elapsedTime = Date.now() - showStartTime;
        const remainingTime = minShowTime - elapsedTime;

        if (remainingTime > 0) {
          hideTimeout = setTimeout(() => {
            setShowLoader(false);
            setShowStartTime(null);
          }, remainingTime);
          return () => clearTimeout(hideTimeout);
        }
      }

      setShowLoader(false);
      setShowStartTime(null);
      return;
    }

    if (delay === 0) {
      setShowLoader(true);
      setShowStartTime(Date.now());
      return;
    }

    showTimeout = setTimeout(() => {
      setShowLoader(true);
      setShowStartTime(Date.now());
    }, delay);

    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [show, delay, minShowTime, showLoader, showStartTime]);

  return showLoader;
};
```


### Hook Usage

```jsx
const Users = () => {
  const { isFetchUsersPending, initFetchUsers } = useFetchUsers();
  const shouldShowLoader = useDelayedLoader(isFetchUsersPending, 400, 200);

  if (shouldShowLoader) {
    return <LoadingSpinner />;
  }

  return (
    <button onClick={initFetchUsers}>
      Fetch Users
    </button>
  );
};
```


## Configuration Recommendations

### Delay Settings

```jsx
// Fast APIs (< 200ms typical)
const FAST_API_DELAY = 300;

// Medium APIs (200-800ms typical) 
const MEDIUM_API_DELAY = 200;

// Slow APIs (> 800ms typical)
const SLOW_API_DELAY = 100;

// Form submissions
const FORM_SUBMIT_DELAY = 500; // Users expect immediate feedback

// Search/filter operations
const SEARCH_DELAY = 200;      // Show quickly for search
```


### Usage Patterns

```jsx
// Search with debounce + lazy loader
const SearchResults = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { isSearching } = useSearch(debouncedQuery);

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      <LazyLoader
        show={isSearching && query.length > 0}
        delay={200}
        fallback={<SearchPrompt />}
      >
        <SearchSpinner />
      </LazyLoader>
    </div>
  );
};
```


## Benefits

### ✅ **Better UX**

- No flickering on fast responses
- Consistent loader behavior
- Professional feel


### ✅ **Configurable**

- Adjustable delay per use case
- Minimum show time prevents flash
- Fallback content support


### ✅ **Performance**

- Proper cleanup prevents memory leaks
- No unnecessary renders
- Minimal overhead


### ✅ **Reusable**

- Works with any loading state
- Composable with other patterns
- Easy to customize


## Main Interview Points

1. **UX Problem**: Fast API responses cause loader flickering
2. **Solution**: Delayed loader with configurable timeout
3. **Cleanup**: Proper timeout cleanup prevents memory leaks
4. **Flexibility**: Configurable delay based on expected response time
5. **Enhanced Features**: Minimum show time, fallback content
6. **Hook Pattern**: Reusable logic as custom hook

**Key Insight**: *"Don't show loaders for what users won't perceive as loading"* - delays under 300-500ms feel instant, so loaders just add visual noise.


# Simple Explanation: Creating a Reusable API Hook

Let me break this down in simple terms!

## The Problem We're Solving

Imagine you have 3 different pages:

- **Users page** - fetches list of users
- **Products page** - fetches list of products
- **Orders page** - fetches list of orders

Each page does almost the **same thing**:

1. Start loading → show "Loading..."
2. Make API call
3. Success → show data
4. Error → show "Error!"

But you're writing the **same code 3 times**! 😤

## Before: Repetitive Code

```jsx
// Users page
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Same pattern... 😴
};

// Products page - SAME CODE AGAIN!
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // ... exact same pattern
};
```


## After: One Reusable Hook

**Create once, use everywhere:**

```jsx
// useAPI.js - The magic reusable hook
const useAPI = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async () => {
    setLoading(true);
    try {
      const response = await apiFunction(); // Whatever API you pass in
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};
```


## Now Use It Everywhere!

```jsx
// Users page - SUPER CLEAN!
const UsersPage = () => {
  const { data: users, loading, error, execute } = useAPI(fetchUsers);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  
  return (
    <div>
      <button onClick={execute}>Load Users</button>
      {users?.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
};

// Products page - SAME PATTERN!
const ProductsPage = () => {
  const { data: products, loading, error, execute } = useAPI(fetchProducts);
  // Same simple code!
};
```


## What Just Happened? 🤯

1. **Before**: Wrote the same loading/error/success logic 3 times
2. **After**: Wrote it ONCE in `useAPI`, now reuse it everywhere

## Think of it Like a Recipe 👨‍🍳

- **Old way**: Write full recipe every time you cook
- **New way**: Write recipe once, follow it for any dish

The `useAPI` hook is like a **recipe template**:

1. Start cooking (loading = true)
2. Follow the steps (call the API)
3. Serve the dish (set the data) OR handle mistakes (set error)

You just **change the ingredients** (different API functions) but follow the **same process**!

## That's It!

**useAPI** = One hook that handles the boring stuff (loading, errors) so you just focus on your data!

No more copy-pasting the same code everywhere. Write once, use everywhere! 🎉

# Request Cancellation in React - Simple Version

## The Problem: Old Requests Coming Back

Think of this like ordering pizza 🍕:

1. You call and order "Pepperoni pizza"
2. You change your mind, call again: "Actually, make it Hawaiian"
3. **Problem:** Both pizzas arrive! You get pepperoni (old request) AFTER Hawaiian (new request)

**Same thing happens with search:**

- User types "LA" → API call starts
- User types "LASAGNA" → Another API call starts
- **Problem:** "LA" results come back AFTER "LASAGNA" results!


## The Solution: Cancel Old Requests

Just like calling the pizza place to cancel the first order, we cancel old API requests before making new ones.

## How It Works

### Step 1: Create a "Cancel Token"

```jsx
// Like getting a "cancellation receipt" for each request
const abortRef = useRef({});

const searchMeals = async (query) => {
  // Cancel any previous request first
  abortRef.current.abort?.(); // "Cancel my last order"
  
  // Make new request with cancellation ability
  const response = await api.get('/search', {
    params: { s: query },
    abort: (cancelFunction) => {
      abortRef.current.abort = cancelFunction; // "Here's how to cancel this one"
    }
  });
  
  setResults(response.data);
};
```


### Step 2: Enhanced API Layer

```jsx
// api.js - Add cancellation support
const withAbort = (axiosMethod) => {
  return async (...args) => {
    const config = args[args.length - 1] || {};
    const { abort, ...restConfig } = config;
    
    if (typeof abort === 'function') {
      // Create cancel token
      const cancelSource = axios.CancelToken.source();
      restConfig.cancelToken = cancelSource.token;
      
      // Give cancel function to caller
      abort(cancelSource.cancel);
    }
    
    try {
      return await axiosMethod(...args.slice(0, -1), restConfig);
    } catch (error) {
      if (axios.isCancel(error)) {
        error.aborted = true; // Mark as cancelled
      }
      throw error;
    }
  };
};

// Wrap all methods
export default {
  get: withAbort(axios.get),
  post: withAbort(axios.post),
  // ... etc
};
```


### Step 3: Use in Component

```jsx
const SearchMeals = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const abortRef = useRef({});

  const searchMeals = async (searchQuery) => {
    // Cancel previous request
    abortRef.current.abort?.();
    
    try {
      const response = await api.get('/meals/search', {
        params: { s: searchQuery },
        abort: (cancel) => {
          abortRef.current.abort = cancel; // Store cancel function
        }
      });
      
      setMeals(response.data.meals || []);
    } catch (error) {
      if (error.aborted) {
        console.log('Request cancelled'); // Not an error, just cancelled
      } else {
        console.error('Real error:', error);
      }
    }
  };

  // Search when user types
  useEffect(() => {
    if (query) {
      searchMeals(query);
    }
  }, [query]);

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search meals..."
      />
      
      {meals.map(meal => (
        <div key={meal.idMeal}>{meal.strMeal}</div>
      ))}
    </div>
  );
};
```


## What Happens When You Type Fast?

1. Type "L" → Request starts
2. Type "LA" → **First request cancelled**, new request starts
3. Type "LAS" → **Second request cancelled**, new request starts
4. **Only the last request** ("LAS") returns results!

## Why This Matters

**Without cancellation:**

- ❌ Wrong search results shown
- ❌ Wasted server resources
- ❌ Poor user experience

**With cancellation:**

- ✅ Always shows latest search
- ✅ Saves server resources
- ✅ Better user experience


## Bonus: Add Debouncing

**Even better:** Wait for user to stop typing before searching:

```jsx
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
const debouncedQuery = useDebounce(query, 300);
useEffect(() => {
  if (debouncedQuery) {
    searchMeals(debouncedQuery);
  }
}, [debouncedQuery]);
```

**Result:** Only search when user stops typing for 300ms + cancel old requests = Perfect search! 🎯


# Explanation of Axios API Code for Beginners

This guide explains a JavaScript code snippet that uses the **Axios** library to help a web application communicate with a server (like fetching or sending data). The explanation is written in simple terms, as if you're new to programming. Think of this code as a tool that makes it easier for your app to talk to a server, with features like canceling requests if needed.

---

## 1. Importing Axios
```javascript
import axios from "axios";
```
- **What it does**: Brings in the **Axios** library, which acts like a messenger to send requests (e.g., asking for data) and receive responses from a server.
- **Analogy**: Axios is like a delivery person who carries messages between your app and a server.

---

## 2. Setting Up the Base URL
```javascript
const axiosParams = {
  baseURL:
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "/",
};
```
- **What it does**: Creates a configuration object called `axiosParams`. It sets a "base URL" (the starting point for all requests) based on whether the app is in **development** mode (testing on your computer) or **production** mode (live online).
    - In development: Uses `http://localhost:3000` (a local server).
    - In production: Uses `"/"` (a relative path, meaning the same domain as the app).
- **Analogy**: It’s like choosing whether to send mail to your neighbor’s house (local testing) or a faraway city (live website).

---

## 3. Creating an Axios Instance
```javascript
const axiosInstance = axios.create(axiosParams);
```
- **What it does**: Creates a customized version of Axios (`axiosInstance`) that uses the settings from `axiosParams`. All requests made with this instance will include the base URL.
- **Analogy**: It’s like customizing your delivery person’s bike with specific instructions (e.g., always start from this address).

---

## 4. Checking for Aborted Requests
```javascript
export const didAbort = (error) => axios.isCancel(error) && { aborted: true };
```
- **What it does**: A helper function that checks if an error occurred because a request was **canceled** (like stopping a delivery). If canceled, it returns `{ aborted: true }`.
- **Analogy**: It’s like checking if a package was returned because you canceled the order.

---

## 5. Creating a Cancel Source
```javascript
const getCancelSource = () => axios.CancelToken.source();
```
- **What it does**: Creates a "cancel token," which allows you to stop a request in progress.
- **Analogy**: It’s like giving your delivery person a walkie-talkie to tell them to turn back mid-delivery.

---

## 6. Checking for Axios Errors
```javascript
export const isApiError = (error) => axios.isAxiosError(error);
```
- **What it does**: Checks if an error is related to Axios (e.g., a server or network issue). It helps identify if the request itself caused the problem.
- **Analogy**: It’s like checking if a delivery failed because of the delivery service (Axios) rather than something else.

---

## 7. Handling Cancellations with `withAbort`
```javascript
const withAbort = (fn) => {
  const executor = async (...args) => {
    const originalConfig = args[args.length - 1];
    const { abort, ...config } = originalConfig;

    if (typeof abort === "function") {
      const { cancel, token } = getCancelSource();
      config.cancelToken = token;
      abort(cancel);
    }

    try {
      if (args.length > 2) {
        const [url, body] = args;
        return await fn(url, body, config);
      } else {
        const [url] = args;
        return await fn(url, config);
      }
    } catch (error) {
      console.log("api error", error);

      if (didAbort(error)) {
        error.aborted = true;
      }

      throw error;
    }
  };

  return executor;
};
```
- **What it does**: This function wraps Axios requests to add the ability to **cancel** them. Here’s how it works:
    1. Takes a function (`fn`) like `axios.get` or `axios.post` and returns a new version (`executor`) that supports canceling.
    2. Checks if the request includes an `abort` function (to cancel the request).
    3. If there’s an `abort` function, it creates a cancel token and attaches it to the request.
    4. Makes the request using the original Axios function.
    5. If an error occurs, it logs it and checks if it was due to cancellation. If so, it marks the error as `aborted: true`.
- **Analogy**: It’s like giving your delivery person an app that lets you cancel their trip halfway. If something goes wrong, it checks if it was because you canceled or due to another issue (like a roadblock).

---

## 8. Creating the API Object
```javascript
const api = (axios) => {
  return {
    get: (url, config = {}) => withAbort(axios.get)(url, config),
    delete: (url, config = {}) => withAbort(axios.delete)(url, config),
    post: (url, body, config = {}) => withAbort(axios.post)(url, body, config),
    patch: (url, body, config = {}) => withAbort(axios.patch)(url, body, config),
    put: (url, body, config = {}) => withAbort(axios.put)(url, body, config),
  };
};
```
- **What it does**: Creates an `api` object with five methods for server communication:
    - **GET**: Fetch data (e.g., a list of products).
    - **DELETE**: Remove something (e.g., a user account).
    - **POST**: Send new data (e.g., a form submission).
    - **PATCH**: Update part of something (e.g., a user’s name).
    - **PUT**: Replace something entirely (e.g., a whole profile).
      Each method is wrapped with `withAbort`, so they all support canceling requests.
- **Analogy**: It’s like setting up a team of delivery people, each with a specific job (fetching, deleting, or sending packages), and all can be told to stop mid-delivery.

---

## 9. Exporting the API
```javascript
export default api(axiosInstance);
```
- **What it does**: Creates the final `api` object using the customized `axiosInstance` (with the base URL) and makes it available for other parts of the app.
- **Analogy**: It’s like handing over your trained delivery team to the company for everyone to use.

---

## Big Picture: What Does This Code Do?
This code sets up a system to make server communication easier and safer. It:
- Uses **Axios** for HTTP requests (GET, POST, etc.).
- Adjusts the server address based on testing or live mode.
- Adds the ability to **cancel** requests, improving user experience (e.g., stopping slow requests).
- Provides a simple `api` object with methods (`get`, `post`, etc.) for the app to use.
- Handles errors, indicating if they were due to cancellation or other issues.

---

## How It’s Used
In another part of the app, a developer might write:
```javascript
import api from './this-file.js';

// Fetch data from the server
api.get('/users').then(response => console.log(response.data));

// Send data to the server
api.post('/users', { name: 'Alice' }).then(response => console.log('User created!'));

// Cancel a request
let cancel;
api.get('/slow-data', { abort: c => cancel = c }).then(response => console.log(response.data));
// Later, cancel the request
cancel();
```
- **Analogy**: The developer uses your delivery team to send or fetch packages and can press a “cancel” button if the package isn’t needed anymore.

---

## Key Takeaways
- Makes server communication easier and more reliable.
- Supports canceling requests to improve user experience.
- Reusable across the app, so developers don’t need to set up Axios repeatedly.


# API Error Logging - Simple Version

## The Problem: Invisible Errors

When users get API errors, you have no idea! 😱

**Without logging:**

- User gets error → Nothing happens on your end
- You only find out if users complain (they usually don't)
- Hard to debug production issues

**With logging:**

- Error happens → You know about it immediately
- Can fix bugs before users complain
- Better app reliability


## The Solution: Add Logging to API Layer

Instead of adding logging everywhere, do it ONCE in the API layer!

### Step 1: Create Logging Wrapper

```jsx
// api.js - Add error logging
const withLogger = async (promise) => {
  try {
    return await promise;
  } catch (error) {
    // Only log in development/staging
    if (process.env.REACT_APP_DEBUG_API === 'true') {
      
      if (error.response) {
        // Server responded with error
        console.log('🚨 API Error (Response):', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers
        });
      } else if (error.request) {
        // No response received
        console.log('🚨 API Error (No Response):', error.request);
      } else {
        // Request setup error
        console.log('🚨 API Error (Setup):', error.message);
      }
      
      console.log('🔍 Request Config:', error.config);
    }
    
    // Still throw the error so components can handle it
    throw error;
  }
};
```


### Step 2: Wrap All API Methods

```jsx
// api.js - Apply logging to everything
const api = (axiosInstance) => {
  return {
    get: (url, config = {}) => 
      withLogger(withAbort(axiosInstance.get)(url, config)),
    
    post: (url, data = {}, config = {}) => 
      withLogger(withAbort(axiosInstance.post)(url, data, config)),
    
    put: (url, data = {}, config = {}) => 
      withLogger(withAbort(axiosInstance.put)(url, data, config)),
    
    delete: (url, config = {}) => 
      withLogger(withAbort(axiosInstance.delete)(url, config))
  };
};
```


### Step 3: Environment Setup

```bash
# .env.development
REACT_APP_DEBUG_API=true

# .env.production  
REACT_APP_DEBUG_API=false
```


## What Gets Logged?

### Different Error Types

**Server Error (400, 500, etc.):**

```
🚨 API Error (Response): {
  data: { message: "User not found" },
  status: 404,
  headers: {...}
}
```

**Network Error (server down):**

```  
🚨 API Error (No Response): XMLHttpRequest {...}
```

**Setup Error (wrong URL format):**

```
🚨 API Error (Setup): Network Error
```


## Advanced: Send to Logging Service

### Production Logging (Send to Server)

```jsx
const sendToLoggingService = (errorData) => {
  // Send to services like Sentry, LogRocket, etc.
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...errorData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }).catch(() => {
    // Silently fail - don't break app if logging fails
  });
};

const withLogger = async (promise) => {
  try {
    return await promise;
  } catch (error) {
    const errorData = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    };
    
    if (process.env.NODE_ENV === 'production') {
      sendToLoggingService(errorData);
    } else {
      console.log('🚨 API Error:', errorData);
    }
    
    throw error;
  }
};
```


## Usage - Zero Changes Needed!

Your components don't change at all:

```jsx
// This automatically gets logged now!
const UserProfile = () => {
  const { data: user, error } = useAPI(fetchUser);
  
  if (error) {
    return <div>Error loading user</div>; // Error was already logged!
  }
  
  return <div>{user.name}</div>;
};
```


## Benefits

### ✅ **Automatic Logging**

- Every API error gets logged
- No need to remember to add logging
- Consistent across entire app


### ✅ **Environment Control**

- Detailed logs in development
- Send to monitoring service in production
- No logs cluttering production console


### ✅ **Rich Error Context**

- Status codes, response data
- Request configuration
- Timestamps and user info


### ✅ **Zero Component Changes**

- Add once to API layer
- Works everywhere automatically
- Doesn't break existing code


## Popular Logging Services

**Free Options:**

- Sentry (error tracking)
- LogRocket (session recording + errors)
- Bugsnag (error monitoring)

**Example with Sentry:**

```jsx
import * as Sentry from "@sentry/react";

const withLogger = async (promise) => {
  try {
    return await promise;
  } catch (error) {
    // Send to Sentry
    Sentry.captureException(error, {
      tags: {
        section: 'api'
      },
      extra: {
        status: error.response?.status,
        data: error.response?.data
      }
    });
    
    throw error;
  }
};
```

**Result:** You know about every API error instantly, can fix bugs proactively, and have a much more reliable app! 🎯
