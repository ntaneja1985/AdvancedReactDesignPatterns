# React Query with API Layer - Key Points

## Main Concept

**React Query** = Better data fetching with automatic caching, background updates, and loading states

## Setup (3 Steps)

### 1. Install \& Configure

```jsx
npm install @tanstack/react-query

// App.js - Setup once
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourComponents />
    </QueryClientProvider>
  );
}
```


### 2. Create API Function

```jsx
// quoteApi.js - Regular API call
export const fetchTopQuotes = () => {
  return api.get('top-quotes').then(res => res.data.quotes);
};
```


### 3. Use in Component

```jsx
// Component.jsx
import { useQuery } from '@tanstack/react-query';
import { fetchTopQuotes } from '../api/quoteApi';

const QuotesComponent = () => {
  const { 
    data: quotes, 
    isLoading, 
    isError, 
    isSuccess 
  } = useQuery({
    queryKey: ['top-quotes'],  // Unique ID for this query
    queryFn: fetchTopQuotes    // Function to call
  });

  if (isLoading) return <div>Loading quotes...</div>;
  if (isError) return <div>Error loading quotes</div>;

  return (
    <div>
      {quotes.map(quote => (
        <div key={quote.id}>{quote.text}</div>
      ))}
    </div>
  );
};
```


## Key Benefits

- ✅ **Automatic caching** - Same data won't be fetched twice
- ✅ **Background updates** - Keeps data fresh automatically
- ✅ **Loading states** - Built-in loading/error handling
- ✅ **No useEffect needed** - Cleaner components


## Interview Points

1. **QueryClient**: Central manager for all queries and cache
2. **QueryKey**: Unique identifier for each query (like cache key)
3. **QueryFunction**: The actual API call function
4. **Auto States**: isLoading, isError, isSuccess built-in
5. **Integration**: Works with existing API layer - just replace fetch logic
6. **Provider Pattern**: Wrap app once, use anywhere

**Why Use It**: Makes data fetching much simpler than useEffect + useState + manual error handling!


# React Query useMutation - Key Points

## What is useMutation?

**For data changes** - posting, updating, deleting data (unlike useQuery which is for fetching)

## Basic Setup

### 1. Create API Functions

```jsx
// quoteApi.js
export const postQuote = (quoteData) => {
  return api.post('quotes', quoteData);
};

export const resetQuotes = () => {
  return api.post('reset');
};
```


### 2. Use in Component

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const UpdateQuotes = () => {
  const queryClient = useQueryClient();
  
  const createQuoteMutation = useMutation({
    mutationFn: postQuote,
    onSuccess: () => {
      // Refresh the quotes list
      queryClient.invalidateQueries(['top-quotes']);
      toast.success('Quote created!');
    }
  });

  const handleSubmit = (formData) => {
    createQuoteMutation.mutate(formData);
  };

  return (
    <div>
      {createQuoteMutation.isPending && <div>Creating...</div>}
      <button onClick={() => handleSubmit({author: 'John', text: 'Hello'})}>
        Create Quote
      </button>
    </div>
  );
};
```


## Key Properties

```jsx
const mutation = useMutation({
  mutationFn: postQuote,
  onSuccess: () => { /* Runs when successful */ },
  onError: (error) => { /* Runs when failed */ }
});

// Available properties:
mutation.mutate(data)     // Trigger the mutation
mutation.isPending        // Is it loading?
mutation.isError          // Did it fail?
mutation.isSuccess        // Did it succeed?
mutation.data             // Response data
mutation.error            // Error object
```


## Invalidating Queries (Refresh Data)

```jsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: postQuote,
  onSuccess: () => {
    // This tells React Query to refetch quotes
    queryClient.invalidateQueries(['top-quotes']);
  }
});
```


## Complete Form Example

```jsx
const QuoteForm = () => {
  const [form, setForm] = useState({ author: '', text: '' });
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: postQuote,
    onSuccess: () => {
      setForm({ author: '', text: '' });  // Clear form
      queryClient.invalidateQueries(['top-quotes']);
      toast.success('Quote created!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.author || !form.text) {
      alert('Please fill all fields');
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={form.author}
        onChange={(e) => setForm({...form, author: e.target.value})}
        placeholder="Author"
      />
      <input 
        value={form.text}
        onChange={(e) => setForm({...form, text: e.target.value})}
        placeholder="Quote"
      />
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Quote'}
      </button>
    </form>
  );
};
```


## Interview Points

1. **useMutation vs useQuery**: Mutation = change data, Query = get data
2. **mutate()**: Function to trigger the mutation
3. **onSuccess**: Callback when mutation succeeds
4. **invalidateQueries**: Refresh related data after changes
5. **isPending**: Loading state for mutations
6. **Form Integration**: Handle form submission with mutations

**Key Benefit**: Automatic state management for data changes + easy cache invalidation!


# React Query Pagination - Key Points

## Basic Concept

**Pagination with React Query** = Show data page by page, keeping previous data visible during loading

## Setup

### 1. API Function with Page Parameter

```jsx
// quoteApi.js
export const quotesByPage = (page) => {
  return api.get('quotes', {
    params: { page }
  }).then(res => res.data);
};
```


### 2. Component Implementation

```jsx
const PaginatedQuotes = () => {
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['quotes', page],  // Include page in key!
    queryFn: () => quotesByPage(page),
    keepPreviousData: true      // Keep old data while loading new
  });

  if (isError) return <div>Error loading quotes</div>;

  return (
    <div>
      {/* Show fetching indicator for first load */}
      {isLoading && <div>Fetching quotes...</div>}
      
      {/* Show data */}
      {data?.map(quote => (
        <div key={quote.id}>{quote.text}</div>
      ))}
      
      {/* Pagination controls */}
      <button 
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(p - 1, 1))}
      >
        Previous
      </button>
      
      <span>Page {page}</span>
      
      <button 
        onClick={() => setPage(p => p + 1)}
      >
        Next
      </button>
      
      {/* Show loading for page changes */}
      {isFetching && <div>Loading...</div>}
    </div>
  );
};
```


## Key Configuration

```jsx
useQuery({
  queryKey: ['quotes', page],    // Page number in query key!
  queryFn: () => fetchQuotes(page),
  keepPreviousData: true         // Don't clear old data while loading
});
```


## Loading States

- **`isLoading`** = First time loading (no data yet)
- **`isFetching`** = Any time fetching (including page changes)

```jsx
// First load: isLoading = true, isFetching = true
// Page change: isLoading = false, isFetching = true
```


## Why `keepPreviousData: true`?

**Without it:**

- User clicks "Next page"
- Screen goes blank while loading
- New data appears

**With it:**

- User clicks "Next page"
- Previous page stays visible
- New data smoothly replaces it


## Interview Points

1. **Query Key Array**: `['quotes', page]` - page must be in key for caching
2. **keepPreviousData**: Prevents blank screen during page changes
3. **Loading States**: `isLoading` vs `isFetching` for different UX
4. **Smooth UX**: Users can see data while new page loads
5. **Automatic Caching**: Each page cached separately by React Query

**Key Benefit**: Smooth pagination experience with no blank screens and automatic caching per page!


# React Query Infinite Scroll - Key Points

## Basic Concept

**Infinite Scroll** = Load more data automatically when user reaches bottom of page (no "Load More" button needed)

## Setup Components

### 1. Install Library

```bash
npm install react-intersection-observer
```


### 2. API Function with Cursor

```jsx
// quoteApi.js  
export const fetchQuotesByCursor = (cursor) => {
  return api.get('quotes', {
    params: { cursor }
  }).then(res => res.data);
};
```


### 3. Component Implementation

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const InfiniteScroll = () => {
  // Observer for bottom of list
  const { ref: loadMoreRef, inView } = useInView();
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['quotes'],
    queryFn: ({ pageParam = 0 }) => fetchQuotesByCursor(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // Return next cursor or undefined if no more pages
      return lastPage.nextCursor ?? undefined;
    }
  });

  // Fetch more when bottom element comes into view
  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetching, hasNextPage]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.quotes.map(quote => (
            <div key={quote.id}>{quote.text}</div>
          ))}
        </div>
      ))}
      
      {/* This element triggers loading more */}
      <div ref={loadMoreRef}>
        {isFetching && <div>Loading more...</div>}
      </div>
    </div>
  );
};
```


## Key Hooks \& Properties

### useInfiniteQuery

- **`queryFn`**: Gets `{ pageParam }` - the cursor/page number
- **`getNextPageParam`**: Returns next cursor or `undefined` if no more
- **`data.pages`**: Array of all loaded pages
- **`fetchNextPage()`**: Load next page
- **`hasNextPage`**: Boolean - are there more pages?


### useInView

- **`ref`**: Attach to element you want to observe
- **`inView`**: Boolean - is element visible?


## Data Structure

```jsx
// data.pages looks like:
[
  { quotes: [...], nextCursor: 'abc123' },  // Page 1
  { quotes: [...], nextCursor: 'def456' },  // Page 2  
  { quotes: [...], nextCursor: null }       // Last page
]
```


## Loading States

- **`isLoading`**: First load (no data yet)
- **`isFetching`**: Any loading (including next pages)


## The Magic - Auto Load More

```jsx
useEffect(() => {
  if (inView && !isFetching && hasNextPage) {
    fetchNextPage(); // Load more when bottom element visible
  }
}, [inView]);
```


## Interview Points

1. **useInfiniteQuery**: Special hook for paginated data that accumulates
2. **Intersection Observer**: Detects when element enters viewport
3. **pageParam**: Cursor/offset passed to API function
4. **getNextPageParam**: Determines what cursor to use for next page
5. **Auto-trigger**: useEffect watches `inView` to load more automatically
6. **Data Structure**: All pages stored in `data.pages` array

**Key Benefit**: Smooth infinite scrolling with automatic loading and no manual "Load More" buttons!


# React Query Request Cancellation - Key Points

## Basic Concept

**Cancel requests** when user changes mind, components unmount, or requests take too long

## Modern Way: AbortSignal (React Query 3.3+)

### 1. Setup Component with Cancellation

```jsx
import { useQuery, useQueryClient } from '@tanstack/react-query';

const QueryCancellation = () => {
  const [shouldAbort, setShouldAbort] = useState(false);
  const queryClient = useQueryClient();
  
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['quotes-with-abort'],
    queryFn: async ({ signal }) => {
      // Pass signal to API layer
      return fetchTopQuotes({ signal })
        .catch(error => {
          if (error.name === 'AbortError') {
            toast.error('Request aborted');
          }
          throw error;
        });
    }
  });

  const onFetchQuotes = () => {
    // Start fetch
    queryClient.refetchQueries(['quotes-with-abort']);
    
    // Cancel after 200ms if shouldAbort is true
    setTimeout(() => {
      if (shouldAbort) {
        queryClient.cancelQueries(['quotes-with-abort']);
      }
    }, 200);
  };

  return (
    <div>
      <label>
        <input 
          type="checkbox"
          checked={shouldAbort}
          onChange={(e) => setShouldAbort(e.target.checked)}
        />
        Should abort requests
      </label>
      
      <button onClick={onFetchQuotes}>Fetch Quotes</button>
      
      {isLoading && <div>Loading...</div>}
      {isFetching && <div>Fetching...</div>}
    </div>
  );
};
```


### 2. API Layer with Signal Support

```jsx
// api.js - Already supports AbortSignal from our previous setup
const withAbort = (axiosMethod) => {
  return async (...args) => {
    const config = args[args.length - 1] || {};
    const { signal, ...restConfig } = config;
    
    if (signal) {
      restConfig.signal = signal; // Pass signal to Axios
    }
    
    return axiosMethod(...args.slice(0, -1), restConfig);
  };
};

// quoteApi.js  
export const fetchTopQuotes = (config = {}) => {
  return api.get('top-quotes', config); // Signal passed through
};
```


## Key Methods

### Manual Cancellation

```jsx
const queryClient = useQueryClient();

// Cancel specific query
queryClient.cancelQueries(['quotes']);

// Cancel all queries  
queryClient.cancelQueries();
```


### Automatic Cancellation

```jsx
const { data } = useQuery({
  queryKey: ['quotes'],
  queryFn: async ({ signal }) => {
    // React Query provides signal automatically
    const response = await fetch('/api/quotes', { signal });
    return response.json();
  }
});

// Query auto-cancels when:
// - Component unmounts
// - Query becomes inactive
// - New query with same key starts
```


## Signal Flow

**Query Function receives `{ signal }`:**

```jsx
queryFn: async ({ signal }) => {
  return api.get('/quotes', { signal }); // Pass to API
}
```

**API layer forwards to Axios:**

```jsx
// Axios automatically handles AbortSignal
axios.get('/quotes', { signal })
```

**When cancelled:**

```jsx
catch (error) {
  if (error.name === 'AbortError') {
    // Request was cancelled, not a real error
  }
}
```


## When to Use Cancellation

### ✅ **Good Use Cases**

- Search-as-you-type (cancel previous searches)
- User navigates away quickly
- Long-running requests with cancel button
- Component unmounts before request completes


### ❌ **Not Needed For**

- Simple, fast API calls
- One-time data fetching
- Critical operations that must complete


## Interview Points

1. **AbortSignal**: Modern browser API for cancelling async operations
2. **Automatic Signal**: React Query provides signal to every query function
3. **Manual Cancel**: `queryClient.cancelQueries()` for user-triggered cancellation
4. **API Integration**: Pass signal through API layer to Axios/fetch
5. **Error Handling**: Cancelled requests throw `AbortError`
6. **Performance**: Prevents unnecessary network usage and state updates

**Key Benefit**: Cleaner code with automatic cancellation + ability to manually cancel when needed!
