# React Code Splitting \& Lazy Loading

## The Problem: Big Bundle Files

**Traditional approach:**

- All JavaScript code bundled into one big file
- Users download ALL code even for single page visit
- Slow loading, high bounce rates
- Unnecessary network usage


## The Solution: Code Splitting + Lazy Loading

**Code Splitting** = Break app into smaller chunks
**Lazy Loading** = Load chunks only when needed

## Basic Implementation

### Before (Static Imports)

```jsx
// All components loaded immediately
import Home from './components/Home';
import About from './components/About';  
import Contact from './components/Contact';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
);
```


### After (Lazy Loading)

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components loaded only when accessed
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

const App = () => (
  <Routes>
    <Route 
      path="/*" 
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      } 
    />
  </Routes>
);
```


## Enhanced Loading with Delayed Fallback

### LazyLoader Component

```jsx
const LazyLoader = ({ show = false, delay = 0, children }) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout;

    if (!show) {
      setShowLoader(false);
      return;
    }

    if (delay === 0) {
      setShowLoader(true);
      return;
    }

    timeout = setTimeout(() => {
      setShowLoader(true);
    }, delay);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [show, delay]);

  return showLoader ? children : null;
};
```


### Usage with Delayed Loading

```jsx
<Suspense 
  fallback={
    <LazyLoader show={true} delay={500}>
      <h3>Loading...</h3>
    </LazyLoader>
  }
>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Suspense>
```


## Route-Based vs Component-Based Splitting

### Route-Based (Recommended)

```jsx
// Split by pages/routes
const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
```


### Component-Based (For Large Components)

```jsx
// Split individual heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'));
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  </div>
);
```


## Advanced Pattern: Conditional Loading

```jsx
const AdminPanel = lazy(() => import('./AdminPanel'));

const App = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowAdmin(!showAdmin)}>
        Toggle Admin
      </button>
      
      {showAdmin && (
        <Suspense fallback={<div>Loading admin panel...</div>}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
};
```


## Error Handling

```jsx
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }) => (
  <div>
    <h2>Oops! Something went wrong</h2>
    <p>{error.message}</p>
  </div>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);
```


## What Happens Behind the Scenes

1. **Build Time**: Webpack creates separate chunks for each lazy component
2. **Runtime**: When route is accessed, chunk is downloaded
3. **Caching**: Once loaded, component stays in memory
4. **Fallback**: Suspense shows loading UI during download

## File Structure Example

```
build/
├── static/js/
│   ├── main.js          // App shell + Home page
│   ├── 2.chunk.js       // About page  
│   ├── 3.chunk.js       // Contact page
│   └── 4.chunk.js       // Admin panel
```


## Best Practices

### ✅ **Good Candidates for Lazy Loading**

- Route components (pages)
- Admin panels or authenticated areas
- Heavy third-party libraries
- Rarely used features
- Modal content


### ❌ **Don't Lazy Load**

- Critical above-the-fold content
- Small components
- Frequently used utilities
- App navigation/header


## Interview Points

1. **Bundle Splitting**: Break large bundles into smaller chunks
2. **React.lazy()**: Dynamic imports for components
3. **Suspense**: Handles loading states for lazy components
4. **Route-Based**: Split by pages for maximum benefit
5. **Performance**: Faster initial load, better user experience
6. **Error Boundaries**: Handle loading failures gracefully

**Key Benefit**: Users only download code they actually need, resulting in faster load times and better performance! 🚀


# React Performance Optimization: Avoiding Unnecessary Re-renders

## The Problem: Wasted Renders

Your transcript shows a React app with unnecessary re-renders. When typing in an input field, ALL components re-render even when their props haven't changed.

**Example scenario:**

- User types in "Add Ingredient" input
- Components that have nothing to do with the input still re-render
- This kills performance in larger apps


## The Solution: React.memo + useCallback

### Step 1: Wrap Components with React.memo

```jsx
import { memo } from 'react';

const IngredientsList = memo(({ ingredients, onDelete }) => {
  console.log('IngredientsList rendering');
  
  return (
    <ul>
      {ingredients.map(ingredient => (
        <li key={ingredient.id}>
          {ingredient.name}
          <button onClick={() => onDelete(ingredient.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
});
```


### Step 2: Fix Function References with useCallback

**Problem:** Even with `memo`, functions are recreated on every render, causing unnecessary re-renders.

```jsx
// ❌ BAD - Function recreated every render
const ParentComponent = () => {
  const [ingredients, setIngredients] = useState([]);
  
  const deleteIngredient = (id) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
  };
  
  return (
    <IngredientsList 
      ingredients={ingredients} 
      onDelete={deleteIngredient} // New function reference every time!
    />
  );
};
```

```jsx
// ✅ GOOD - Function memoized with useCallback
import { useCallback } from 'react';

const ParentComponent = () => {
  const [ingredients, setIngredients] = useState([]);
  
  const deleteIngredient = useCallback((id) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
  }, []); // Empty dependency array = function never recreated
  
  return (
    <IngredientsList 
      ingredients={ingredients} 
      onDelete={deleteIngredient} // Same function reference!
    />
  );
};
```


## Alternative: Custom Equality Function

If `useCallback` isn't suitable, you can provide a custom comparison:

```jsx
const IngredientsList = memo(({ ingredients, onDelete }) => {
  // Component code...
}, (prevProps, nextProps) => {
  // Only re-render if ingredients actually changed
  return prevProps.ingredients === nextProps.ingredients;
});
```


## When to Use Each Approach

### ✅ **React.memo**

- Components that render frequently
- Components with complex props
- Child components that receive stable data


### ✅ **useCallback**

- Functions passed as props to memoized components
- Functions used in dependency arrays
- Expensive function calculations


### ❌ **Don't Use For**

- Every component (adds overhead)
- Components that change frequently anyway
- Simple, fast-rendering components


## Complete Working Example

```jsx
import { useState, useCallback, memo } from 'react';

// Memoized child component
const IngredientsList = memo(({ ingredients, onDelete }) => {
  console.log('IngredientsList rendering');
  
  return (
    <div>
      {ingredients.map(ingredient => (
        <div key={ingredient.id}>
          <span>{ingredient.name}</span>
          <button onClick={() => onDelete(ingredient.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
});

// Parent component
const IngredientsApp = () => {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Salt' },
    { id: 2, name: 'Pepper' }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Memoized function to prevent unnecessary re-renders
  const deleteIngredient = useCallback((id) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
  }, []);

  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients(prev => [...prev, {
        id: Date.now(),
        name: inputValue
      }]);
      setInputValue('');
    }
  };

  return (
    <div>
      <h1>Ingredients ({ingredients.length})</h1>
      
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add ingredient..."
      />
      <button onClick={addIngredient}>Add</button>
      
      {/* This won't re-render when typing in input! */}
      <IngredientsList 
        ingredients={ingredients}
        onDelete={deleteIngredient}
      />
    </div>
  );
};
```


## Key Interview Points

1. **React.memo**: Prevents re-renders when props haven't changed
2. **useCallback**: Memoizes functions to maintain stable references
3. **Shallow Comparison**: memo does shallow prop comparison by default
4. **Custom Equality**: Can provide custom comparison function to memo
5. **Performance Trade-off**: Memoization has overhead, use wisely
6. **Dependency Arrays**: Empty array = never recreate, add dependencies as needed

**Result:** Components only re-render when their actual data changes, dramatically improving app performance! 🚀

# React useMemo for Memoizing Elements - Key Points

## The Problem: Unnecessary Element Recreation

Your transcript shows a component that re-renders its header text on every parent re-render, even when the header content hasn't actually changed.

**Before:**

```jsx
const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  
  // This runs on EVERY render!
  const createIngredientsHeaderText = () => {
    console.log('Create ingredients header text called');
    return <h2>Ingredients ({ingredients.length})</h2>;
  };

  return (
    <div>
      {createIngredientsHeaderText()}
      {/* Other components */}
    </div>
  );
};
```


## The Solution: useMemo for Elements

**After:**

```jsx
import { useMemo } from 'react';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  
  // Only re-creates when ingredients.length changes!
  const ingredientsHeader = useMemo(() => {
    console.log('Create ingredients header text called');
    return <h2>Ingredients ({ingredients.length})</h2>;
  }, [ingredients.length]); // Only depends on length

  return (
    <div>
      {ingredientsHeader}
      {/* Other components */}
    </div>
  );
};
```


## How It Works

### Without useMemo:

- User types in input → Component re-renders
- Header element gets re-created every time
- Unnecessary work for unchanged content


### With useMemo:

- User types in input → Component re-renders
- useMemo checks: has `ingredients.length` changed?
- If NO → Return cached header element
- If YES → Create new header element


## Complete Example

```jsx
import { useState, useMemo } from 'react';

const IngredientsApp = () => {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Salt' },
    { id: 2, name: 'Pepper' }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Memoized header - only updates when count changes
  const header = useMemo(() => {
    console.log('Header created'); // Only logs when ingredients.length changes
    return (
      <div>
        <h1>My Recipe</h1>
        <h2>Ingredients ({ingredients.length})</h2>
        <p>Keep track of your cooking ingredients</p>
      </div>
    );
  }, [ingredients.length]);

  // Memoized expensive component
  const expensiveStats = useMemo(() => {
    console.log('Stats calculated'); // Only when ingredients change
    const totalChars = ingredients.reduce((sum, item) => sum + item.name.length, 0);
    return (
      <div className="stats">
        <p>Total ingredients: {ingredients.length}</p>
        <p>Total characters: {totalChars}</p>
      </div>
    );
  }, [ingredients]);

  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients(prev => [...prev, {
        id: Date.now(),
        name: inputValue
      }]);
      setInputValue('');
    }
  };

  return (
    <div>
      {header} {/* Won't recreate when typing */}
      
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add ingredient..."
      />
      <button onClick={addIngredient}>Add</button>
      
      {expensiveStats} {/* Won't recreate when typing */}
      
      <ul>
        {ingredients.map(ingredient => (
          <li key={ingredient.id}>{ingredient.name}</li>
        ))}
      </ul>
    </div>
  );
};
```


## When to Use useMemo for Elements

### ✅ **Good Use Cases**

- Complex JSX that doesn't change often
- Elements with expensive calculations
- Static content that depends on specific props
- Preventing child component re-creation


### ❌ **Don't Use For**

- Simple, fast-rendering elements
- Elements that change frequently anyway
- One-line JSX expressions


## Key Benefits

1. **Prevents Unnecessary Work**: Element only created when dependencies change
2. **Maintains Referential Equality**: Same element object between renders
3. **Reduces Render Time**: Skip expensive element creation
4. **Works with React.memo**: Stable element references prevent child re-renders

## Interview Points

1. **useMemo Purpose**: Memoizes values/elements to prevent unnecessary recalculation
2. **Dependencies**: Only recalculates when specified dependencies change
3. **Element Memoization**: Can memoize JSX elements, not just primitive values
4. **Performance Tool**: Use for optimization, not as a bug fix
5. **Complement to React.memo**: useMemo for values, React.memo for components
6. **Dependency Array**: Critical for correctness - must include all reactive values

**Key Insight**: useMemo prevents recreation of expensive elements when their inputs haven't changed, leading to better performance in React applications.


# React Performance: State Colocation - Simple Guide

## The Problem: Unnecessary Re-renders

Your transcript shows the final optimization step - when you type in the "Add Ingredient" input, ALL components re-render even though only the input component should care about the input value.

## State Colocation: Move State Down

**The solution:** Move state as close as possible to where it's used.

### ❌ Before - State in Parent

```jsx
const IngredientsApp = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState(''); // ← Input state in parent

  return (
    <div>
      <InfoHelper />                    {/* Re-renders on input change! */}
      <IngredientsList />               {/* Re-renders on input change! */}
      <AddIngredient 
        ingredient={ingredient}         {/* Needs input state */}
        setIngredient={setIngredient} 
      />
    </div>
  );
};
```


### ✅ After - State Moved Down

```jsx
const IngredientsApp = () => {
  const [ingredients, setIngredients] = useState([]);

  return (
    <div>
      <InfoHelper />                    {/* ✅ No longer re-renders! */}
      <IngredientsList />               {/* ✅ No longer re-renders! */}
      <AddIngredient />                 {/* Manages its own input state */}
    </div>
  );
};

const AddIngredient = () => {
  const [ingredient, setIngredient] = useState(''); // ← Moved here!

  return (
    <input 
      value={ingredient}
      onChange={(e) => setIngredient(e.target.value)}
      placeholder="Add ingredient..."
    />
  );
};
```


## What Happened?

1. **Before:** Input state was in parent → Every keystroke caused parent to re-render → All siblings re-rendered
2. **After:** Input state moved to component that needs it → Only that component re-renders

## Benefits of State Colocation

### ✅ **Performance**

- Fewer components re-render
- React has less to check on each update
- Faster UI responses


### ✅ **Maintainability**

- State logic closer to where it's used
- Easier to understand component responsibilities
- Less prop drilling


### ✅ **Simpler Code**

- No unnecessary props being passed down
- Clearer component boundaries


## Key Rules for State Placement

1. **Start Local**: Always start with state in the component that needs it
2. **Lift When Shared**: Only lift state up when multiple components need it
3. **Closest Common Parent**: When sharing, put state in the nearest common parent
4. **Avoid Global State**: Don't put everything in top-level state

## Interview Points

1. **State Colocation Principle**: Keep state as close to where it's used as possible
2. **Performance Impact**: Parent state changes cause all children to re-render
3. **When to Lift**: Only lift state when multiple components truly need it
4. **Maintenance Benefit**: Easier to understand and modify related code
5. **React's Render Behavior**: State change triggers re-render of component tree

**Key Insight**: *"Place code as close to where it's relevant as possible"* - this applies to state, functions, and any other logic in React components.

This simple technique can dramatically improve performance in larger React applications! 🚀


# React Performance: Component Lifting Technique - Final Optimization

## The Problem: Even Simple Components Re-render

Your transcript shows that even the simple `IngredientsInfoHelper` button component re-renders when the ingredients state changes, despite receiving no props. This happens because of React's reconciliation process.

## The Solution: Lift Components Up as Props

Instead of defining components inside the render tree, pass them as props from a parent that doesn't change.

### ❌ Before - Component Defined Inside Parent

```jsx
const Ingredients = ({ children }) => {
  const [ingredients, setIngredients] = useState([]);

  return (
    <div>
      <IngredientsInfoHelper />     {/* Re-renders on state change */}
      <IngredientsList ingredients={ingredients} />
      <AddIngredient />
    </div>
  );
};
```


### ✅ After - Component Passed as Prop

```jsx
// In App.js - component created once, never changes
const App = () => {
  return (
    <Ingredients 
      ingredientsInfoHelper={<IngredientsInfoHelper />}
    >
      {/* other content */}
    </Ingredients>
  );
};

// In Ingredients component
const Ingredients = ({ ingredientsInfoHelper }) => {
  const [ingredients, setIngredients] = useState([]);

  return (
    <div>
      {ingredientsInfoHelper}      {/* Never re-renders! */}
      <IngredientsList ingredients={ingredients} />
      <AddIngredient />
    </div>
  );
};
```


## Why This Works

**React's Reconciliation Process:**

1. When `ingredients` state changes, the `Ingredients` component re-renders
2. React recreates the entire component tree to check for changes
3. Components defined inside get recreated even if they don't need props

**With Lifting:**

1. `IngredientsInfoHelper` is created once in `App` component
2. It's passed as a prop (JSX element) to `Ingredients`
3. When `ingredients` state changes, the prop doesn't change
4. React uses the same element instance → no re-render

## Complete Example

```jsx
// App.js
const App = () => {
  return (
    <IngredientsApp 
      staticComponents={{
        infoHelper: <IngredientsInfoHelper />,
        sidebar: <InstructionsSidebar />,
        footer: <RecipeFooter />
      }}
    />
  );
};

// IngredientsApp.js  
const IngredientsApp = ({ staticComponents }) => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');

  return (
    <div>
      {staticComponents.infoHelper}    {/* Never re-renders */}
      {staticComponents.sidebar}       {/* Never re-renders */}
      
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      
      <IngredientsList ingredients={ingredients} />
      
      {staticComponents.footer}        {/* Never re-renders */}
    </div>
  );
};

// Static components that don't need any props
const IngredientsInfoHelper = () => (
  <button className="info-btn">
    ℹ️ Recipe Tips
  </button>
);

const InstructionsSidebar = () => (
  <aside>
    <h3>Instructions</h3>
    <p>Add your ingredients one by one...</p>
  </aside>
);

const RecipeFooter = () => (
  <footer>
    <p>Happy cooking! 👨‍🍳</p>
  </footer>
);
```


## Summary: 5 React Optimization Techniques

Based on your transcript, here are the 5 techniques covered:

### 1. **React.memo** - Memoize Components

```jsx
const IngredientsList = memo(({ ingredients, onDelete }) => {
  // Component only re-renders when props change
});
```


### 2. **useCallback** - Memoize Functions

```jsx
const deleteIngredient = useCallback((id) => {
  setIngredients(prev => prev.filter(item => item.id !== id));
}, []);
```


### 3. **useMemo** - Memoize Values/Elements

```jsx
const header = useMemo(() => (
  <h2>Ingredients ({ingredients.length})</h2>
), [ingredients.length]);
```


### 4. **State Colocation** - Move State Down

```jsx
// Move input state from parent to the component that uses it
const AddIngredient = () => {
  const [input, setInput] = useState(''); // Local state
  // ...
};
```


### 5. **Component Lifting** - Pass as Props

```jsx
// Create static components in parent, pass as props
<IngredientsApp 
  staticComponent={<IngredientsInfoHelper />}
/>
```


## When to Use These Techniques

### ✅ **Optimize When:**

- Components re-render frequently
- Components are large/complex
- You measure actual performance issues
- Components have expensive calculations


### ❌ **Don't Over-optimize:**

- Small, fast-rendering components
- Components that change frequently anyway
- When it adds unnecessary complexity
- Without measuring performance impact


## Interview Points

1. **React.memo**: Prevents component re-renders when props unchanged
2. **useCallback**: Memoizes functions to maintain stable references
3. **useMemo**: Memoizes expensive calculations or JSX elements
4. **State Colocation**: Move state close to where it's used
5. **Component Lifting**: Pass static components as props to prevent recreation
6. **Performance Measurement**: Only optimize when you have actual performance issues

**Key Insight**: React is fast by default. These optimizations should be applied strategically to components that actually benefit from them, not everywhere! 🚀

# React Throttling: Controlling Function Execution Frequency

## The Problem: Too Many Function Calls

Your transcript shows a mouse tracking app that fires hundreds of events per second as the mouse moves. This can kill performance and overwhelm the browser.

**Without throttling:**

- Mouse moves → Event fires for every pixel
- Hundreds of unnecessary function calls
- Performance degradation and UI freezing


## The Solution: Throttling

**Throttling** = Limit function execution to once per time interval, regardless of how many times it's called.

### Custom Throttle Implementation

```jsx
// helpers/throttle.js
export const throttle = (fn, wait) => {
  let timerId;
  let inThrottle = false;
  let lastTime = 0;

  return function (...args) {
    if (!inThrottle) {
      // First call - execute immediately
      lastTime = Date.now();
      inThrottle = true;
      return fn.apply(this, args);
    } else {
      // Subsequent calls - schedule execution
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(this, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};
```


### Using Throttle in React Hook

```jsx
import { useState, useEffect } from 'react';
import { throttle } from '../helpers/throttle';

const useMousePosition = (options = {}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { throttleTime = 200 } = options;

  useEffect(() => {
    const handleMouseMove = throttle((event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    }, throttleTime);

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [throttleTime]);

  return position;
};
```


### Component Usage

```jsx
const TrackMouse = () => {
  const position = useMousePosition({ throttleTime: 200 }); // Update every 200ms

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <h2>Mouse Tracker</h2>
      <p>Move your mouse around!</p>
      <div>
        Position: X: {position.x}, Y: {position.y}
      </div>
    </div>
  );
};
```


## How Throttling Works

### Timeline Example (200ms throttle)

```
0ms:   Mouse moves → Function executes immediately
50ms:  Mouse moves → Ignored (within throttle period)
100ms: Mouse moves → Ignored (within throttle period)  
200ms: Mouse moves → Function executes (throttle period passed)
250ms: Mouse moves → Ignored (new throttle period starts)
```


## Throttle vs Debounce

### **Throttle** - Regular Intervals

```jsx
// Executes at most once every 200ms, regardless of input frequency
const throttledFunc = throttle(searchAPI, 200);
```

**Use for:** Scroll events, mouse tracking, button clicks, resize events

### **Debounce** - Wait for Pause

```jsx
// Executes only after user stops typing for 300ms
const debouncedFunc = debounce(searchAPI, 300);
```

**Use for:** Search inputs, form validation, API calls triggered by typing

## Real-World Examples

### Scroll Event Throttling

```jsx
const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY);
    }, 100); // Update every 100ms

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};
```


### Button Click Throttling

```jsx
const ThrottledButton = ({ onClick, children }) => {
  const throttledClick = useMemo(
    () => throttle(onClick, 1000), // Prevent spam clicking
    [onClick]
  );

  return <button onClick={throttledClick}>{children}</button>;
};
```


### Window Resize Throttling

```jsx
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = throttle(() => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }, 250);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};
```


## Using Lodash Throttle (Alternative)

```jsx
import { throttle } from 'lodash';
import { useMemo } from 'react';

const TrackMouse = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const throttledMouseMove = useMemo(
    () => throttle((event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    }, 200),
    []
  );

  useEffect(() => {
    window.addEventListener('mousemove', throttledMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      throttledMouseMove.cancel(); // Important: cancel pending calls
    };
  }, [throttledMouseMove]);

  return <div>Position: {position.x}, {position.y}</div>;
};
```


## Interview Points

1. **Purpose**: Throttling limits function execution frequency to improve performance
2. **Implementation**: Higher-order function that controls timing of execution
3. **Use Cases**: Mouse events, scroll events, resize events, button clicks
4. **vs Debounce**: Throttle = regular intervals, Debounce = wait for pause
5. **Performance**: Reduces excessive function calls and improves UI responsiveness
6. **Cleanup**: Important to clear timers and cancel pending executions

**Key Insight**: Throttling is essential for handling high-frequency events in web applications without sacrificing performance! 🚀


# React Debouncing: Reducing API Calls for Better Performance

## The Problem: Search Spam

Your transcript shows a search feature that fires an API request for every keystroke. When a user types "meat", it makes 4 separate API calls - one for each letter!

**Without debouncing:**

- User types "m" → API call
- User types "e" → API call
- User types "a" → API call
- User types "t" → API call
- **Result:** 4 unnecessary API calls for one search


## The Solution: Debouncing

**Debouncing** = Delay function execution until user stops interacting for a specified time.

### Custom Debounce Implementation

```jsx
// helpers/debounce.js
export const debounce = (fn, delay) => {
  let timerId;
  
  return function (...args) {
    // Clear previous timer
    if (timerId) {
      clearTimeout(timerId);
    }
    
    // Set new timer
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
```


### Using Debounce in React Component

```jsx
import { useState, useMemo } from 'react';
import { debounce } from '../helpers/debounce';

const SearchMeals = () => {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);

  // ✅ Memoize debounced function to prevent recreation on every render
  const debouncedSearch = useMemo(() => 
    debounce(async (searchQuery) => {
      if (searchQuery.trim()) {
        const results = await searchMeals(searchQuery);
        setMeals(results);
      }
    }, 500), // Wait 500ms after user stops typing
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value); // Only calls API after 500ms of inactivity
  };

  return (
    <div>
      <input 
        value={query}
        onChange={handleInputChange}
        placeholder="Search meals..."
      />
      
      <ul>
        {meals.map(meal => (
          <li key={meal.id}>{meal.name}</li>
        ))}
      </ul>
    </div>
  );
};
```


## Why useMemo Instead of useCallback?

From your transcript - this is a key interview point:

### ❌ Problem with useCallback

```jsx
// This recreates debounce function on every render!
const debouncedSearch = useCallback(
  debounce(async (query) => {
    const results = await searchMeals(query);
    setMeals(results);
  }, 500),
  []
);
```

**Issue:** `debounce()` runs on every render, creating new timers and breaking the debouncing effect.

### ✅ Solution with useMemo

```jsx
// This creates debounce function only once!
const debouncedSearch = useMemo(() => 
  debounce(async (query) => {
    const results = await searchMeals(query);
    setMeals(results);
  }, 500),
  []
);
```

**Fix:** `useMemo` ensures the debounced function is created only once and reused.

## How Debouncing Works

### Timeline Example (500ms debounce)

```
0ms:   User types "m" → Timer starts (500ms)
100ms: User types "e" → Timer resets (500ms)
200ms: User types "a" → Timer resets (500ms)  
300ms: User types "t" → Timer resets (500ms)
800ms: Timer fires → API call for "meat"
```

**Result:** Only 1 API call instead of 4!

## Debounce vs Throttle - Key Differences

### **Debounce** - Wait for Pause

- Executes only after user stops interacting
- Resets timer on each new interaction
- **Use for:** Search inputs, form validation, auto-save


### **Throttle** - Regular Intervals

- Executes at most once per time interval
- Continues executing at regular intervals
- **Use for:** Scroll events, mouse tracking, button clicks


## Real-World Examples

### Form Auto-Save

```jsx
const AutoSaveForm = () => {
  const [formData, setFormData] = useState({});

  const debouncedSave = useMemo(() => 
    debounce(async (data) => {
      await saveFormData(data);
      console.log('Form auto-saved!');
    }, 2000), // Save 2 seconds after user stops typing
    []
  );

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    debouncedSave(newData);
  };

  return (
    <form>
      <input 
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Your name"
      />
      <textarea 
        onChange={(e) => handleChange('message', e.target.value)}
        placeholder="Your message"
      />
    </form>
  );
};
```


### Live Search with Cleanup

```jsx
const LiveSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const debouncedSearch = useMemo(() => 
    debounce(async (searchTerm) => {
      if (searchTerm.length >= 2) {
        const data = await fetchSearchResults(searchTerm);
        setResults(data);
      } else {
        setResults([]);
      }
    }, 300),
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.(); // If using lodash debounce
    };
  }, [debouncedSearch]);

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder="Search..."
      />
      
      {results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
};
```


## Using Lodash Debounce (Alternative)

```jsx
import { debounce } from 'lodash';

const SearchComponent = () => {
  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(() => 
    debounce((searchTerm) => {
      console.log('Searching for:', searchTerm);
      // API call here
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Important: cancel pending calls
    };
  }, [debouncedSearch]);

  return (
    <input 
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
};
```


## Interview Points

1. **Purpose**: Debouncing delays execution until user stops interacting
2. **Use Cases**: Search inputs, form validation, auto-save, API calls
3. **vs Throttle**: Debounce waits for pause, throttle limits frequency
4. **React Integration**: Must use useMemo to prevent function recreation
5. **Performance**: Reduces API calls and improves user experience
6. **Cleanup**: Cancel pending debounced calls on component unmount

**Key Insight**: Debouncing is essential for user input handling - it prevents overwhelming servers with requests while providing smooth user experience! 🚀
