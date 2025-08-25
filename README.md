# Advanced React Design Patterns

- With respect to naming conventions, React JS is un-opinionated
- Common naming conventions are Pascal Case, camelCase and kebab-case


# Design Patterns: Layout Components
- ![img.png](img.png)
- ![img_1.png](img_1.png)

# React Layout Components - Summary

## Overview

Layout components in React are specialized components designed to organize and structure other components within a web page. They follow a separation of concerns principle, where the layout logic is decoupled from the content components, providing flexibility and reusability.

## Core Concept of Layout Components

### Definition

**Layout Components**: Specialized React components that focus on organizing and positioning other components within a web page structure, separating layout concerns from content logic.

### Key Principle

> **Components should function independently of their placement on the page**

This means individual components should not contain positioning or layout-specific logic, making them more flexible and reusable across different contexts.

## Architecture Comparison

### Traditional Approach (Tightly Coupled)

```jsx
// ❌ Component contains both content AND layout styling
const SideNavigation = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '250px',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px'
      }}
    >
      <nav>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
};

// Problems:
// - Layout styles mixed with content logic
// - Hard to reuse in different layouts
// - Component "knows" where it should be positioned
```


### Layout Components Approach (Decoupled)

```jsx
// ✅ Pure content component (layout-agnostic)
const SideNavigation = () => {
  return (
    <nav>
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
};

// ✅ Layout component handles positioning
const SidebarLayout = ({ sidebar, content }) => {
  return (
    <div className="sidebar-layout">
      <aside className="sidebar">
        {sidebar}
      </aside>
      <main className="content">
        {content}
      </main>
    </div>
  );
};

// CSS for layout positioning
const styles = `
.sidebar-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f0f0f0;
  padding: 20px;
  position: fixed;
  height: 100vh;
}

.content {
  margin-left: 250px;
  flex: 1;
  padding: 20px;
}
`;

// Usage - components are inserted into layout
const App = () => {
  return (
    <SidebarLayout
      sidebar={<SideNavigation />}
      content={<MainContent />}
    />
  );
};
```


## Common Layout Component Examples

### 1. Split Screen Layout

```jsx
const SplitScreenLayout = ({ left, right, leftWeight = 1, rightWeight = 1 }) => {
  return (
    <div className="split-screen">
      <div 
        className="left-pane"
        style={{ flex: leftWeight }}
      >
        {left}
      </div>
      <div 
        className="right-pane"
        style={{ flex: rightWeight }}
      >
        {right}
      </div>
    </div>
  );
};

// CSS
const styles = `
.split-screen {
  display: flex;
  height: 100vh;
}

.left-pane, .right-pane {
  padding: 20px;
}

.left-pane {
  background-color: #f8f9fa;
}

.right-pane {
  background-color: #ffffff;
}
`;

// Usage
const Dashboard = () => {
  return (
    <SplitScreenLayout
      left={<Sidebar />}
      right={<MainContent />}
      leftWeight={1}
      rightWeight={3}
    />
  );
};
```


### 2. Grid Layout Component

```jsx
const GridLayout = ({ children, columns = 12, gap = '1rem' }) => {
  return (
    <div 
      className="grid-layout"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap
      }}
    >
      {children}
    </div>
  );
};

const GridItem = ({ children, span = 1, start, end }) => {
  return (
    <div 
      className="grid-item"
      style={{
        gridColumn: start && end 
          ? `${start} / ${end}` 
          : span > 1 
            ? `span ${span}` 
            : undefined
      }}
    >
      {children}
    </div>
  );
};

// Usage
const ProductGrid = () => {
  return (
    <GridLayout columns={12} gap="2rem">
      <GridItem span={12}>
        <Header />
      </GridItem>
      <GridItem span={3}>
        <Sidebar />
      </GridItem>
      <GridItem span={9}>
        <ProductList />
      </GridItem>
      <GridItem span={12}>
        <Footer />
      </GridItem>
    </GridLayout>
  );
};
```


### 3. Modal Layout Component

```jsx
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// CSS
const styles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-body {
  padding: 1rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}
`;

// Usage
const App = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Open Modal
      </button>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="User Profile"
      >
        <UserProfileForm />
      </Modal>
    </div>
  );
};
```


### 4. List Layout Component

```jsx
const List = ({ items, renderItem, ItemComponent, spacing = 'medium' }) => {
  const spacingClasses = {
    small: 'list-spacing-small',
    medium: 'list-spacing-medium', 
    large: 'list-spacing-large'
  };

  return (
    <ul className={`list ${spacingClasses[spacing]}`}>
      {items.map((item, index) => (
        <li key={item.id || index} className="list-item">
          {ItemComponent ? (
            <ItemComponent {...item} />
          ) : (
            renderItem ? renderItem(item, index) : item
          )}
        </li>
      ))}
    </ul>
  );
};

// CSS
const styles = `
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-spacing-small .list-item {
  margin-bottom: 0.5rem;
}

.list-spacing-medium .list-item {
  margin-bottom: 1rem;
}

.list-spacing-large .list-item {
  margin-bottom: 1.5rem;
}
`;

// Content components (layout-agnostic)
const ProductCard = ({ name, price, image }) => (
  <div className="product-card">
    <img src={image} alt={name} />
    <h3>{name}</h3>
    <p>${price}</p>
  </div>
);

// Usage
const ProductList = ({ products }) => {
  return (
    <List
      items={products}
      ItemComponent={ProductCard}
      spacing="large"
    />
  );
};
```


### 5. Responsive Layout Component

```jsx
const ResponsiveLayout = ({ children, breakpoints = {} }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLayoutType = () => {
    const { width } = windowSize;
    const defaultBreakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1200,
      ...breakpoints
    };

    if (width < defaultBreakpoints.mobile) return 'mobile';
    if (width < defaultBreakpoints.tablet) return 'tablet';
    if (width < defaultBreakpoints.desktop) return 'desktop';
    return 'wide';
  };

  return (
    <div className={`responsive-layout layout-${getLayoutType()}`}>
      {children}
    </div>
  );
};

// CSS
const styles = `
.responsive-layout {
  padding: 1rem;
}

.layout-mobile {
  display: flex;
  flex-direction: column;
}

.layout-tablet {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}

.layout-desktop {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  gap: 2rem;
}

.layout-wide {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
}
`;
```


## Benefits of Layout Components

### 1. **Separation of Concerns**

```jsx
// Content logic separated from layout logic
const UserProfile = ({ user }) => (
  <div>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </div>
);

// Layout logic handles positioning
const CardLayout = ({ children }) => (
  <div className="card">
    {children}
  </div>
);
```


### 2. **Reusability**

```jsx
// Same content component used in different layouts
const ProductInfo = ({ product }) => (
  <div>
    <h3>{product.name}</h3>
    <p>{product.description}</p>
  </div>
);

// Different layout contexts
const GridView = () => (
  <GridLayout>
    {products.map(product => (
      <GridItem key={product.id}>
        <ProductInfo product={product} />
      </GridItem>
    ))}
  </GridLayout>
);

const ListView = () => (
  <List
    items={products}
    renderItem={(product) => <ProductInfo product={product} />}
  />
);
```


### 3. **Flexibility**

```jsx
// Easy to switch between different layouts
const Dashboard = ({ layoutType }) => {
  const layouts = {
    sidebar: (content) => (
      <SidebarLayout sidebar={<Navigation />} content={content} />
    ),
    split: (content) => (
      <SplitScreenLayout left={<Navigation />} right={content} />
    ),
    grid: (content) => (
      <GridLayout>{content}</GridLayout>
    )
  };

  const Layout = layouts[layoutType] || layouts.sidebar;

  return Layout(<MainContent />);
};
```


## Best Practices for Layout Components

### 1. **Keep Components Layout-Agnostic**

```jsx
// ❌ Component knows about its position
const Header = () => (
  <header style={{ position: 'fixed', top: 0, width: '100%' }}>
    <h1>My App</h1>
  </header>
);

// ✅ Component focuses only on content
const Header = () => (
  <header>
    <h1>My App</h1>
  </header>
);

// Layout component handles positioning
const FixedHeaderLayout = ({ header, content }) => (
  <div className="fixed-header-layout">
    <div className="fixed-header">
      {header}
    </div>
    <div className="content-with-header-offset">
      {content}
    </div>
  </div>
);
```


### 2. **Use Composition Over Configuration**

```jsx
// ✅ Flexible composition
const PageLayout = ({ header, sidebar, content, footer }) => (
  <div className="page-layout">
    {header && <header className="page-header">{header}</header>}
    <div className="page-main">
      {sidebar && <aside className="page-sidebar">{sidebar}</aside>}
      <main className="page-content">{content}</main>
    </div>
    {footer && <footer className="page-footer">{footer}</footer>}
  </div>
);

// Usage with different combinations
const HomePage = () => (
  <PageLayout
    header={<Header />}
    content={<HomeContent />}
    footer={<Footer />}
  />
);

const AdminPage = () => (
  <PageLayout
    header={<AdminHeader />}
    sidebar={<AdminSidebar />}
    content={<AdminContent />}
  />
);
```


### 3. **Provide Sensible Props for Customization**

```jsx
const FlexLayout = ({ 
  children, 
  direction = 'row', 
  justify = 'flex-start', 
  align = 'stretch',
  wrap = 'nowrap',
  gap = 0 
}) => (
  <div 
    style={{
      display: 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      flexWrap: wrap,
      gap: gap
    }}
  >
    {children}
  </div>
);
```


## Key Takeaways

1. **Separation of Concerns**: Layout components separate positioning logic from content logic
2. **Component Independence**: Individual components should not know about their page placement
3. **Increased Reusability**: Content components can be used in multiple layout contexts
4. **Flexibility**: Easy to change layouts without modifying content components
5. **Maintainability**: Changes to layout don't affect content components and vice versa
6. **Composition Pattern**: Use component composition to build flexible layouts
7. **Responsive Design**: Layout components can handle responsive behavior centrally
8. **Accessibility**: Layout components can implement consistent accessibility patterns
9. **Performance**: Easier to optimize layouts without affecting content rendering
10. **Testing**: Layout and content logic can be tested independently

Layout components are a powerful pattern in React that promotes clean, maintainable, and flexible code by separating concerns and making components more reusable across different contexts and layouts.


# Split Screen Layout Component - React Implementation

## Setup and Installation

```bash
npm install styled-components
```


## Split Screen Component Implementation

```jsx
// components/SplitScreen.js
import styled from 'styled-components';

export const SplitScreen = ({ left, right }) => {
  return (
    <Container>
      <Panel>{left}</Panel>
      <Panel>{right}</Panel>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
`;

const Panel = styled.div`
  flex: 1;
`;
```


## Key Points

### 1. **Props Pattern**

```jsx
// Takes components as props, not data
<SplitScreen 
  left={<LeftSideComponent />}
  right={<RightSideComponent />}
/>
```


### 2. **Styled Components Syntax**

```jsx
const Container = styled.div`
  display: flex;
`;

// styled.elementType`CSS styles here`
```


### 3. **Equal Distribution**

```jsx
const Panel = styled.div`
  flex: 1;  // Each panel takes equal space
`;
```


## Usage Example

```jsx
// App.js
import { SplitScreen } from './components/SplitScreen';

const LeftSideComponent = () => (
  <h2 style={{ backgroundColor: 'crimson' }}>I am left</h2>
);

const RightSideComponent = () => (
  <h2 style={{ backgroundColor: 'brown' }}>I am right</h2>
);

function App() {
  return (
    <SplitScreen
      left={<LeftSideComponent />}
      right={<RightSideComponent />}
    />
  );
}
```


## Important Concepts

### **Layout vs Content Separation**

- `SplitScreen` handles layout (positioning, flex)
- `LeftSideComponent`/`RightSideComponent` handle content only
- Components don't know about their positioning


### **Component Composition**

- Pass entire components as props
- Flexible - can pass any React component
- Reusable across different contexts


### **Styled Components Benefits**

- CSS-in-JS approach
- Component-scoped styles
- Dynamic styling with props (covered later)


## Result

Two equal-width panels displayed side by side, each containing the passed component with different background colors for visual distinction.


# Enhanced Split Screen Component - Dynamic Widths \& Children Pattern

## Enhanced Split Screen with Custom Widths

```jsx
// components/SplitScreen.js
import styled from 'styled-components';

export const SplitScreen = ({ 
  children,
  leftWeight = 1, 
  rightWeight = 1 
}) => {
  const [left, right] = children;
  
  return (
    <Container>
      <Panel flex={leftWeight}>{left}</Panel>
      <Panel flex={rightWeight}>{right}</Panel>
    </Container>
  );
};

// Styled Components with Dynamic Props
const Container = styled.div`
  display: flex;
`;

const Panel = styled.div`
  flex: ${(p) => p.flex};
`;
```


## Key Points

### 1. **Dynamic Flex Values**

```jsx
// Styled component receives props
const Panel = styled.div`
  flex: ${(p) => p.flex};  // Access props with ${(props) => props.propName}
`;

// Usage in JSX
<Panel flex={leftWeight}>{left}</Panel>
<Panel flex={rightWeight}>{right}</Panel>
```


### 2. **Children Pattern (Preferred Approach)**

```jsx
// Instead of separate left/right props
const SplitScreen = ({ children, leftWeight = 1, rightWeight = 1 }) => {
  const [left, right] = children;  // Destructure children array
  return (
    <Container>
      <Panel flex={leftWeight}>{left}</Panel>
      <Panel flex={rightWeight}>{right}</Panel>
    </Container>
  );
};
```


### 3. **Cleaner Usage Syntax**

```jsx
// Clean children approach
<SplitScreen leftWeight={1} rightWeight={3}>
  <LeftSideComponent title="Right" />
  <RightSideComponent title="Left" />
</SplitScreen>

// vs older props approach
<SplitScreen 
  left={<LeftSideComponent />}
  right={<RightSideComponent />}
  leftWeight={1}
  rightWeight={3}
/>
```


## Updated Components with Props

```jsx
const LeftSideComponent = ({ title }) => (
  <h2 style={{ backgroundColor: 'crimson' }}>{title}</h2>
);

const RightSideComponent = ({ title }) => (
  <h2 style={{ backgroundColor: 'brown' }}>{title}</h2>
);
```


## Complete Usage Example

```jsx
// App.js
function App() {
  return (
    <SplitScreen leftWeight={1} rightWeight={3}>
      <LeftSideComponent title="Right" />
      <RightSideComponent title="Left" />
    </SplitScreen>
  );
}
```


## Benefits of Children Pattern

### **1. Cleaner Syntax**

- More natural component composition
- Easy to read and understand


### **2. Easy Props Passing**

```jsx
<SplitScreen leftWeight={1} rightWeight={2}>
  <LeftComponent title="Hello" color="red" />
  <RightComponent data={myData} onClick={handler} />
</SplitScreen>
```


### **3. Styled Components Props Access**

```jsx
// Access any prop passed to styled component
const Panel = styled.div`
  flex: ${(props) => props.flex};
  background: ${(props) => props.bg || 'white'};
  padding: ${(props) => props.padding || '0'};
`;
```


## Result

- Left panel: 25% width (flex: 1)
- Right panel: 75% width (flex: 3)
- Components can receive props easily
- Clean, composable syntax

# List and List Items Layout Components

## Project Setup

### Data Files

```js
// data/authors.js
export const authors = [
  { 
    name: "John Doe", 
    age: 35, 
    country: "USA", 
    books: ["Book 1", "Book 2"] 
  },
  // ... more authors
];

// data/books.js
export const books = [
  { title: "Book Title", author: "Author Name", pages: 200 },
  // ... more books
];
```


## List Item Components

### Small Author List Item

```jsx
// components/authors/SmallAuthorListItem.jsx
export const SmallAuthorListItem = ({ author }) => {
  const { name, age } = author;
  
  return (
    <p>Name: {name}, Age: {age}</p>
  );
};
```


### Large Author List Item

```jsx
// components/authors/LargeAuthorListItem.jsx
export const LargeAuthorListItem = ({ author }) => {
  const { name, age, country, books } = author;
  
  return (
    <>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Country: {country}</p>
      <ul>
        {books.map(book => (
          <li key={book}>{book}</li>
        ))}
      </ul>
    </>
  );
};
```


## Generic List Component

```jsx
// components/lists/RegularList.jsx
export const RegularList = ({ 
  items, 
  sourceName, 
  ItemComponent 
}) => {
  return (
    <>
      {items.map((item, i) => (
        <ItemComponent 
          key={i}
          {...{[sourceName]: item}}
        />
      ))}
    </>
  );
};
```


## Key Points

### 1. **Dynamic Prop Spreading**

```jsx
// Creates dynamic prop names
{...{[sourceName]: item}}

// Runtime examples:
// If sourceName = "author": author={item}
// If sourceName = "book": book={item}
```


### 2. **Component Injection Pattern**

```jsx
// Pass component as prop
<RegularList 
  ItemComponent={SmallAuthorListItem}
  // ...
/>

// Component gets rendered inside list
<ItemComponent {...props} />
```


### 3. **Separation of Concerns**

- **List items**: Focus only on displaying data
- **List component**: Handles iteration and rendering
- **No styling**: Keep styling in parent components


## Usage Example

```jsx
// App.js
import { RegularList } from './components/lists/RegularList';
import { SmallAuthorListItem } from './components/authors/SmallAuthorListItem';
import { LargeAuthorListItem } from './components/authors/LargeAuthorListItem';
import { authors } from './data/authors';

function App() {
  return (
    <>
      <RegularList
        items={authors}
        sourceName="author"
        ItemComponent={SmallAuthorListItem}
      />
      
      <RegularList
        items={authors}
        sourceName="author" 
        ItemComponent={LargeAuthorListItem}
      />
    </>
  );
}
```


## Benefits

### **1. Reusability**

- Same `RegularList` works with any data type
- Different item components for different display needs


### **2. Flexibility**

- Easy to switch between small/large views
- Parent component controls styling


### **3. Separation of Concerns**

- List logic separate from item display logic
- Items don't care about positioning/styling


### **4. Component Injection**

- Pass components as props for dynamic rendering
- Runtime decision of which component to use


## Pattern Summary

- **RegularList**: Generic container handling iteration
- **ListItem components**: Focus on data display only
- **Dynamic props**: Use computed property names for flexibility
- **Component injection**: Pass components as props for flexibility


# Books List Items and Numbered List Component

## Book List Item Components

### Small Book List Item

```jsx
// components/books/SmallBookListItem.jsx
export const SmallBookListItem = ({ book }) => {
  const { name, price } = book;
  
  return (
    <h2>{name} - ${price}</h2>
  );
};
```


### Large Book List Item

```jsx
// components/books/LargeBookListItem.jsx
export const LargeBookListItem = ({ book }) => {
  const { name, price, title, pages } = book;
  
  return (
    <>
      <h2>{name}</h2>
      <p>Price: ${price}</p>
      <h2>{title}</h2>
      <p>Number of pages: {pages}</p>
    </>
  );
};
```


## Numbered List Component

```jsx
// components/lists/NumberedList.jsx
export const NumberedList = ({ 
  items, 
  sourceName, 
  ItemComponent 
}) => {
  return (
    <>
      {items.map((item, i) => (
        <>
          <h3>{i + 1}</h3>
          <ItemComponent 
            key={i}
            {...{[sourceName]: item}}
          />
        </>
      ))}
    </>
  );
};
```


## Complete App Usage

```jsx
// App.js
import { RegularList } from './components/lists/RegularList';
import { NumberedList } from './components/lists/NumberedList';
import { SmallAuthorListItem } from './components/authors/SmallAuthorListItem';
import { LargeAuthorListItem } from './components/authors/LargeAuthorListItem';
import { SmallBookListItem } from './components/books/SmallBookListItem';
import { LargeBookListItem } from './components/books/LargeBookListItem';
import { authors } from './data/authors';
import { books } from './data/books';

function App() {
  return (
    <>
      {/* Authors with Regular List */}
      <RegularList
        items={authors}
        sourceName="author"
        ItemComponent={SmallAuthorListItem}
      />
      
      {/* Books with Regular List */}
      <RegularList
        items={books}
        sourceName="book"
        ItemComponent={SmallBookListItem}
      />
      
      {/* Authors with Numbered List */}
      <NumberedList
        items={authors}
        sourceName="author" 
        ItemComponent={LargeAuthorListItem}
      />
      
      {/* Books with Numbered List */}
      <NumberedList
        items={books}
        sourceName="book"
        ItemComponent={LargeBookListItem}
      />
    </>
  );
}
```


## Key Points

### **1. Component Reusability**

```jsx
// Same RegularList works with different data types
<RegularList sourceName="author" ItemComponent={SmallAuthorListItem} />
<RegularList sourceName="book" ItemComponent={SmallBookListItem} />
```


### **2. List Type Variations**

```jsx
// Different list containers for same items
<RegularList />      // Plain list
<NumberedList />     // Numbered list
// Could add: <BulletList />, <GridList />, etc.
```


### **3. Component Combinations**

With 6 components, you can create multiple variations:

- 2 data types (authors, books)
- 2 item sizes (small, large)
- 2 list types (regular, numbered)
  = **8 different list combinations**


### **4. Pattern Benefits**

- **Separation of concerns**: List logic vs item display vs data
- **Easy to extend**: Add new list types or item components
- **Consistent interface**: All lists use same props pattern
- **Maintainable**: Changes to one component don't affect others


## Component Architecture

```
Lists (Container Logic)
├── RegularList
├── NumberedList
└── [Future: BulletList, GridList]

Items (Display Logic)  
├── Authors/
│   ├── SmallAuthorListItem
│   └── LargeAuthorListItem
└── Books/
    ├── SmallBookListItem  
    └── LargeBookListItem

Data (Static Data)
├── authors
└── books
```


## Result

- Authors and books displayed in both regular and numbered formats
- Small items show minimal info, large items show detailed info
- Easy to mix and match components for different use cases
- Scalable pattern for real-world applications


# Modal Layout Component Implementation

## Modal Component

```jsx
// components/Modal.jsx
import styled from 'styled-components';
import { useState } from 'react';

export const Modal = ({ children }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(true)}>Show Modal</button>
      
      {show && (
        <ModalBackground onClick={() => setShow(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {children}
            <button onClick={() => setShow(false)}>Hide Modal</button>
          </ModalContent>
        </ModalBackground>
      )}
    </>
  );
};

// Styled Components
const ModalBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  overflow: auto;
  background-color: #00000067;
  width: 100%;
  height: 100%;
`;

const ModalContent = styled.div`
  margin: 12% auto;
  padding: 20px;
  background-color: wheat;
  width: 50%;
`;
```


## Key Points

### **1. Modal State Management**

```jsx
const [show, setShow] = useState(false);

// Show modal
<button onClick={() => setShow(true)}>Show Modal</button>

// Hide modal  
<button onClick={() => setShow(false)}>Hide Modal</button>
```


### **2. Conditional Rendering**

```jsx
{show && (
  <ModalBackground>
    <ModalContent>
      {children}
    </ModalContent>
  </ModalBackground>
)}
```


### **3. Event Propagation Control**

```jsx
// Background click closes modal
<ModalBackground onClick={() => setShow(false)}>
  
  {/* Content click doesn't close modal */}
  <ModalContent onClick={(e) => e.stopPropagation()}>
    {children}
  </ModalContent>
</ModalBackground>
```


### **4. Children Pattern Usage**

```jsx
// Modal accepts any content as children
<Modal>
  <LargeBookListItem book={books[0]} />
</Modal>
```


## Usage Example

```jsx
// App.js
import { Modal } from './components/Modal';
import { LargeBookListItem } from './components/books/LargeBookListItem';
import { books } from './data/books';

function App() {
  return (
    <Modal>
      <LargeBookListItem book={books[0]} />
    </Modal>
  );
}
```


## Modal Benefits

### **1. Reusable Container**

- Can display any content inside modal
- Same modal component for different data types


### **2. Event Handling**

- Click outside to close
- Close button functionality
- Prevents event conflicts with `stopPropagation()`


### **3. Flexible Content**

```jsx
// Different content types in same modal
<Modal><UserProfile /></Modal>
<Modal><BookDetails /></Modal>
<Modal><AuthorInfo /></Modal>
```


### **4. Layout Separation**

- Modal handles positioning/overlay logic
- Content components focus on data display
- No styling conflicts


## Component Architecture Pattern

```jsx
// Content Component (Layout-agnostic)
const BookInfo = ({ book }) => (
  <div>
    <h2>{book.name}</h2>
    <p>Price: ${book.price}</p>
  </div>
);

// Can be used in different contexts
<RegularList ItemComponent={BookInfo} />     // In list
<Modal><BookInfo book={book} /></Modal>      // In modal
<SplitScreen left={<BookInfo />} />          // In layout
```


## Key Features

- **Self-contained state management**
- **Background overlay with opacity**
- **Click-outside-to-close functionality**
- **Event propagation control**
- **Responsive positioning (12% from top, centered)**
- **Built from scratch (no external dependencies)**


## Result

A functional modal that can display any React component, with proper event handling and styling, demonstrating the layout component pattern where the modal handles positioning while content components remain layout-agnostic.

# If an interviewer asks about advanced React patterns, you can say:

- One powerful pattern I use is Layout Components. The core idea is to enforce a strict separation of concerns between a component's content and its position on the page. Content components are kept layout-agnostic—they don't know where they are. 
- Then, specialized Layout Components like SplitScreen, Modal, or GridLayout handle all the positioning logic.
- This is achieved through composition, typically by passing components as children or through named props. 
- For things like lists, I use component injection, where a generic List component takes an ItemComponent as a prop.
- The main benefits are huge: it dramatically increases reusability, flexibility, and maintainability. You can swap out layouts without ever touching the content components, and vice versa.

# React Design Patterns Course Summary

## What are Design Patterns?

**Effective solutions to common application development challenges** - emphasizing "effective" because not all solutions are equal. Poor solutions lead to anti-patterns (brittle code, poor performance, reduced maintainability).

## Course Focus

- **React-specific patterns** (not traditional OOP patterns like Gang of Four)
- Patterns from real-world React development experience
- Address common React development challenges


## Key Areas Covered:

### 1. **Reusable Layouts**

- Split screen components
- Modal components
- Component organization patterns


### 2. **Logic Reusability**

- Avoid code duplication
- Share complex logic between components
- Data fetching patterns

```jsx
// Example concept - sharing data fetching logic
const useApiData = (url) => {
  // Reusable data fetching logic
}
```


### 3. **Form Management**

- Form state management
- Validation patterns
- Form submission best practices

```jsx
// Form handling patterns
const FormComponent = () => {
  // State, validation, submission logic
}
```


### 4. **Functional Programming Integration**

- Recursive patterns in React
- Enhanced code organization
- Improved maintainability

```jsx
// Functional programming concepts
const RecursiveComponent = ({ data }) => {
  // Recursive rendering patterns
}
```


## Key Takeaway

Each common React challenge will be addressed with a specific, proven design pattern for optimal solutions.


# Container Components Pattern

## Definition

**React components responsible for handling data loading and data management on behalf of their child components.**

## The Problem

Junior/intermediate developers typically have each component load its own data:

```jsx
// Anti-pattern - each component loads its own data
const UserProfile = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser);
  }, []);
  
  return <div>{user?.name}</div>;
};
```

**Challenge:** Multiple components needing the same data loading logic leads to code duplication.

## The Solution: Container Components

Extract data loading logic into a dedicated container component:

```jsx
// Container Component
const UserContainer = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser);
  }, []);
  
  return children(user); // Pass data to children
};

// Child Component (data-agnostic)
const UserProfile = ({ user }) => {
  return <div>{user?.name}</div>;
};

// Usage
<UserContainer>
  {user => <UserProfile user={user} />}
</UserContainer>
```


## Key Principle

**Data Separation:** Child components should be unaware of data source/management - they simply receive props and display content, similar to how layout components shield children from layout awareness.

## Benefits

- Eliminates data loading code duplication
- Centralizes data management
- Makes components more reusable and testable

# Container Components - Project Setup

## Project Structure

- **UserInfo Component**: Displays user data (name, age) - same as previous LargeListItem
- **BookInfo Component**: Displays book/product data
- Simple Express.js server for data simulation


## Installation Requirements

```bash
npm install express
npm install axios
```


## Server Setup (server.js)

```javascript
// Basic Express server with hardcoded data
const users = [/* user data */];
const books = [/* book data */];
const currentUser = {/* current user */};

// GET and POST endpoints
app.listen(1990); // Server runs on port 1990
```


## Running the Application

```bash
# Terminal 1 - Start server
node server.js
# Server listening on Port 1990

# Terminal 2 - Start React app  
npm start
```


## Configuration

Add to **package.json**:

```json
{
  "proxy": "http://localhost:1990"
}
```

*Enables communication between React app and Express server*

## Component Structure

```jsx
// UserInfo Component
const UserInfo = ({ user }) => {
  const { name, age } = user;
  return <div>{name}, {age}</div>;
};

// BookInfo Component  
const BookInfo = ({ book }) => {
  const { title, author } = book;
  return <div>{title} by {author}</div>;
};
```


## Purpose

These components will be used to display server data, setting up the foundation for container component patterns in upcoming lessons.

# Container Components - First Implementation

## Creating CurrentUserLoader Container

### File: `components/CurrentUserLoader.js`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const CurrentUserLoader = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get('/current-user');
      setUser(response.data);
    })();
  }, []);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { user });
        }
        return child;
      })}
    </>
  );
};
```


## Usage in App.js

```jsx
import { CurrentUserLoader } from './components/CurrentUserLoader';
import { UserInfo } from './components/UserInfo';

function App() {
  return (
    <CurrentUserLoader>
      <UserInfo />
    </CurrentUserLoader>
  );
}
```


## Key Concepts

### 1. **Container Pattern Structure**

- Uses `useState` for data storage
- Uses `useEffect` for data fetching
- Receives `children` as props


### 2. **Data Flow**

1. Container fetches data from `/current-user` endpoint
2. Stores data in `user` state
3. Passes data to children via props

### 3. **Children Manipulation**

```jsx
React.Children.map(children, (child) => {
  if (React.isValidElement(child)) {
    return React.cloneElement(child, { user }); // Attach user prop
  }
  return child;
});
```


### 4. **React.cloneElement()**

- Clones React element and adds extra props
- First param: the child element
- Second param: props to attach


## Result

- UserInfo component receives `user` prop automatically
- Displays current user data (Sarah Waters from server)
- Container handles all data loading logic


## Next Step

Make the container more generic to fetch users by ID, not just current user.


# Generic User Loader Container

## Creating UserLoader (More Flexible)

### File: `components/UserLoader.js`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const UserLoader = ({ userId, children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`/users/${userId}`);
      setUser(response.data);
    })();
  }, [userId]); // Re-fetch when userId changes

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { user });
        }
        return child;
      })}
    </>
  );
};
```


## Key Improvements

### 1. **Dynamic URL Construction**

```jsx
// Before: Fixed endpoint
axios.get('/current-user')

// After: Dynamic endpoint  
axios.get(`/users/${userId}`)
```


### 2. **Props-Based Configuration**

- Accepts `userId` prop for flexibility
- Can fetch any user by ID


### 3. **Dependency Array**

```jsx
useEffect(() => {
  // fetch logic
}, [userId]); // Re-runs when userId changes
```


## Usage Examples

### Single User

```jsx
<UserLoader userId={3}>
  <UserInfo />
</UserLoader>
```


### Multiple Users

```jsx
<UserLoader userId={1}>
  <UserInfo />
</UserLoader>

<UserLoader userId={3}>
  <UserInfo />
</UserLoader>
```


## Server Endpoint

- **URL Pattern:** `/users/${id}`
- **Returns:** User object with specified ID
- **Example:** `/users/3` returns user with ID 3


## Benefits Over CurrentUserLoader

- ✅ Fetch any user by ID
- ✅ Reusable across different components
- ✅ Dynamic data loading
- ✅ Can display multiple users simultaneously


## Next Step

Make it even more generic to handle different types of data (not just users).

# Generic Resource Loader Container

## Creating ResourceLoader (Maximum Flexibility)

### File: `components/ResourceLoader.js`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const ResourceLoader = ({ resourceUrl, resourceName, children }) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(resourceUrl);
      setResource(response.data);
    })();
  }, [resourceUrl]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            [resourceName]: resource 
          });
        }
        return child;
      })}
    </>
  );
};
```


## Key Features

### 1. **Dynamic Props**

```jsx
// Dynamic prop name based on resourceName
{ [resourceName]: resource }

// Examples:
// resourceName="user" → { user: userData }
// resourceName="book" → { book: bookData }
```


### 2. **Flexible URL**

- Accepts any `resourceUrl`
- No hardcoded endpoints


### 3. **Generic State Management**

- Uses `resource` instead of specific data types
- Works with any data structure


## Usage Examples

### Loading Users

```jsx
<ResourceLoader 
  resourceUrl="/users/2" 
  resourceName="user"
>
  <UserInfo />
</ResourceLoader>
```


### Loading Books

```jsx
<ResourceLoader 
  resourceUrl="/books/1" 
  resourceName="book"
>
  <BookInfo />
</ResourceLoader>
```


### Multiple Resources

```jsx
{/* User data */}
<ResourceLoader resourceUrl="/users/2" resourceName="user">
  <UserInfo />
</ResourceLoader>

{/* Book data */}
<ResourceLoader resourceUrl="/books/1" resourceName="book">
  <BookInfo />
</ResourceLoader>
```


## Benefits

- ✅ **Single container** for all data types
- ✅ **No code duplication** across similar use cases
- ✅ **Reusable** for users, books, products, etc.
- ✅ **Dynamic prop naming** based on resource type
- ✅ **Flexible URL structure**


## Evolution Summary

1. **CurrentUserLoader** → Fixed current user only
2. **UserLoader** → Any user by ID
3. **ResourceLoader** → Any resource from any URL

## Next Step

Can we make it even more generic? Let's find out!

# Ultra-Generic DataSource Container

## Creating DataSource (Ultimate Flexibility)

### File: `components/DataSource.js`

```jsx
import React, { useState, useEffect } from 'react';

export const DataSource = ({ getData = () => {}, resourceName, children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await getData();
      setData(result);
    })();
  }, [getData]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            [resourceName]: data 
          });
        }
        return child;
      })}
    </>
  );
};
```


## Key Innovation: Function-Based Data Fetching

### 1. **No Built-in Data Source Knowledge**

- Doesn't know about Axios, fetch, or any specific API
- Receives `getData` function as prop
- Completely agnostic about data origin


### 2. **Clean Implementation Pattern**

```jsx
// Separate data fetching logic
const getDataFromServer = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

// Usage
<DataSource 
  getData={async () => await getDataFromServer('/users/2')}
  resourceName="user"
>
  <UserInfo />
</DataSource>
```


## Better Code Organization

### Extract Data Fetching Functions

```jsx
import axios from 'axios';

// Reusable data fetching functions
const getDataFromServer = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const getDataFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const getDataFromRedux = (selector) => {
  return useSelector(selector);
};
```


### Usage Examples

```jsx
// Server data
<DataSource 
  getData={() => getDataFromServer('/users/2')}
  resourceName="user"
>
  <UserInfo />
</DataSource>

// Local storage data  
<DataSource 
  getData={() => getDataFromLocalStorage('currentUser')}
  resourceName="user"
>
  <UserInfo />
</DataSource>
```


## Benefits Over Previous Patterns

- ✅ **Data source agnostic** - works with server, localStorage, Redux, etc.
- ✅ **Function injection** - complete control over data fetching
- ✅ **Clean separation** - data logic separate from container
- ✅ **Maximum reusability** - one container for all scenarios


## Evolution Summary

1. **CurrentUserLoader** → Fixed endpoint
2. **UserLoader** → Dynamic user ID
3. **ResourceLoader** → Any URL/resource
4. **DataSource** → Any data source via function injection

## Next Step

Demonstrate fetching from localStorage instead of server to show true flexibility.

# Container Components - Alternative Patterns

## Warning About React.cloneElement()

### ⚠️ **Use Sparingly**

- Don't use `React.cloneElement()` everywhere
- Can lead to **less maintainable code**
- May cause confusion: "Where is this data coming from?"
- **Only use in specific patterns** like containers


### ✅ **When It's Appropriate**

- Container components (like we've built)
- Clean separation of concerns
- Clear data flow patterns
- Obvious data collection and distribution


## Alternative: Render Props Pattern

### Traditional Children Approach

```jsx
<DataSource getData={getData} resourceName="user">
  <UserInfo />
</DataSource>
```


### Render Props Alternative

```jsx
<DataSource 
  getData={getData}
  render={(resource) => (
    <UserInfo user={resource} />
  )}
/>
```


## Implementation: DataSourceWithRender

### File: `components/DataSourceWithRender.js`

```jsx
import React, { useState, useEffect } from 'react';

export const DataSourceWithRender = ({ getData = () => {}, render }) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await getData();
      setResource(result);
    })();
  }, [getData]);

  return render(resource);
};
```


## Usage Comparison

### Children Pattern (Current)

```jsx
<DataSource getData={getData} resourceName="user">
  <UserInfo />
</DataSource>
```


### Render Props Pattern

```jsx
<DataSourceWithRender 
  getData={getData}
  render={(resource) => <UserInfo user={resource} />}
/>
```


## Key Differences

### Children Pattern

- Uses `React.Children.map()` and `React.cloneElement()`
- Automatically injects props
- More "magic" behavior
- Cleaner JSX syntax


### Render Props Pattern

- Explicit prop passing
- More transparent data flow
- Slightly more verbose
- Clear function interface


## Which to Choose?

### Depends on:

- **Team preference** and mental model
- **Codebase consistency**
- **Maintainability requirements**
- **Transparency needs**


### Both are valid:

- ✅ Clean and maintainable
- ✅ Clear separation of concerns
- ✅ Reusable patterns
- ✅ Well-established React patterns


## Next Chapter

These patterns will be used in **Controlled vs Uncontrolled Components** - you can practice converting between both approaches as an exercise.

# Container Components - LocalStorage Example

## Creating LocalStorage Data Fetcher

### Data Fetching Function

```jsx
const getDataFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};
```

**Key Points:**

- **Not async** - localStorage is synchronous
- Takes a `key` parameter
- Returns stored value directly


## Setting Up LocalStorage Data

### Browser DevTools Setup

1. Open **Developer Tools** → **Application** → **Local Storage**
2. Add key-value pair:
  - **Key:** `test`
  - **Value:** `I am from local storage`

## Display Component

### Simple Message Component

```jsx
const Message = ({ msg }) => {
  return <h1>{msg}</h1>;
};
```


## Usage with DataSource

### Complete Implementation

```jsx
<DataSource 
  getData={() => getDataFromLocalStorage('test')}
  resourceName="msg"
>
  <Message />
</DataSource>
```


## How It Works

### Data Flow

1. **DataSource** calls `getDataFromLocalStorage('test')`
2. Function retrieves `"I am from local storage"` from browser
3. Data gets stored in component state
4. **Message component** receives data via `msg` prop
5. Displays: **"I am from local storage"**

## Key Benefits

### Same Container, Different Sources

```jsx
// Server data
<DataSource getData={() => getDataFromServer('/users/1')} resourceName="user">
  <UserInfo />
</DataSource>

// LocalStorage data  
<DataSource getData={() => getDataFromLocalStorage('test')} resourceName="msg">
  <Message />
</DataSource>
```


## Demonstration Result

- **Browser displays:** "I am from local storage"
- **Same DataSource container** works for both server API and localStorage
- **True flexibility** - data source agnostic pattern

This proves the **DataSource pattern's versatility** - it can fetch from any source without modification to the container logic.

# Controlled vs Uncontrolled Components

## Definitions

### Uncontrolled Components

- **Component manages its own internal state**
- Data accessed only when specific events occur
- Example: Form values known only on submit


### Controlled Components

- **Parent component manages the state**
- State passed down as props
- Parent controls component behavior


## Code Structure Comparison

### Uncontrolled Component

```jsx
const UncontrolledComponent = ({ onSubmit }) => {
  const [value, setValue] = useState(''); // Internal state
  
  const handleSubmit = () => {
    onSubmit(value); // Pass data up only on submit
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

# Uncontrolled Form Implementation

## Creating Uncontrolled Form Component

### File: `components/UncontrolledForm.js`

```jsx
import React from 'react';

export const UncontrolledForm = () => {
  // Create refs for accessing DOM elements directly
  const nameInputRef = React.createRef();
  const ageInputRef = React.createRef();

  const submitHandler = (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Access values through refs (DOM access)
    console.log(nameInputRef.current.value);
    console.log(ageInputRef.current.value);
  };

  return (
    <form onSubmit={submitHandler}>
      <input 
        ref={nameInputRef}        // Attach ref
        name="name"
        type="text"
        placeholder="Enter your name"
      />
      
      <input 
        ref={ageInputRef}         // Attach ref
        name="age"
        type="number"
        placeholder="Enter your age"
      />
      
      <input 
        type="submit"
        value="Submit"
      />
    </form>
  );
};
```


## Key Characteristics

### 1. **No State Management**

- No `useState` hooks
- Component doesn't track input values
- Values only accessed when needed


### 2. **DOM-Based Access**

```jsx
// Direct DOM access via refs
nameInputRef.current.value  // Gets current input value
ageInputRef.current.value   // Gets current input value
```


### 3. **Event-Based Data Retrieval**

- Data only available during specific events (submit)
- Parent component can't access form values directly
- Form manages its own internal state internally


## Usage in App.js

```jsx
import { UncontrolledForm } from './components/UncontrolledForm';

function App() {
  return (
    <div>
      <UncontrolledForm />
    </div>
  );
}
```


## Testing the Form

1. **Input:** Name = "test", Age = 23
2. **Click Submit**
3. **Console Output:**

```
test
23
```


## Limitations of Uncontrolled Forms

### ❌ **Limited Access**

- Parent components can't read form values
- No real-time validation possible
- Can't prefill values easily
- Testing requires manual DOM manipulation


### ❌ **Indirect Access Required**

- Must use `createRef()` for DOM access
- Only accessible during events (submit, blur, etc.)
- No direct state management


## Next Step

Convert this uncontrolled form to a **controlled form** to see the differences and benefits of each approach.



### Controlled Component

```jsx
const ControlledComponent = ({ value, onChange, onSubmit }) => {
  // No internal state - receives everything as props
  
  return (
    <form onSubmit={onSubmit}>
      <input 
        value={value}           // From parent
        onChange={onChange}     // From parent
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```


## Key Differences

### Uncontrolled

- ✅ Uses `useState` internally
- ✅ Manages own state
- ✅ Only communicates via event callbacks
- ❌ Parent has limited control


### Controlled

- ✅ No internal state management
- ✅ Receives state as props
- ✅ Parent has full control
- ✅ Real-time data access


## Which to Choose?

### **Controlled Components Preferred** ✅

**Reasons:**

1. **More Reusable** - Can be used in different contexts
2. **Easier to Test** - Can set desired state directly
3. **Better Control** - Parent has full visibility and control
4. **No Manual Manipulation** - No need to trigger events for testing

### **When to Use Uncontrolled**

- Simple forms with minimal interaction
- Legacy code integration
- Performance-critical scenarios with many inputs


## Next Steps

We'll examine concrete examples of both patterns to see these concepts in action.

# Uncontrolled Form Implementation

## Creating Uncontrolled Form Component

### File: `components/UncontrolledForm.js`

```jsx
import React from 'react';

export const UncontrolledForm = () => {
  // Create refs for accessing DOM elements directly
  const nameInputRef = React.createRef();
  const ageInputRef = React.createRef();

  const submitHandler = (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Access values through refs (DOM access)
    console.log(nameInputRef.current.value);
    console.log(ageInputRef.current.value);
  };

  return (
    <form onSubmit={submitHandler}>
      <input 
        ref={nameInputRef}        // Attach ref
        name="name"
        type="text"
        placeholder="Enter your name"
      />
      
      <input 
        ref={ageInputRef}         // Attach ref
        name="age"
        type="number"
        placeholder="Enter your age"
      />
      
      <input 
        type="submit"
        value="Submit"
      />
    </form>
  );
};
```


## Key Characteristics

### 1. **No State Management**

- No `useState` hooks
- Component doesn't track input values
- Values only accessed when needed


### 2. **DOM-Based Access**

```jsx
// Direct DOM access via refs
nameInputRef.current.value  // Gets current input value
ageInputRef.current.value   // Gets current input value
```


### 3. **Event-Based Data Retrieval**

- Data only available during specific events (submit)
- Parent component can't access form values directly
- Form manages its own internal state internally


## Usage in App.js

```jsx
import { UncontrolledForm } from './components/UncontrolledForm';

function App() {
  return (
    <div>
      <UncontrolledForm />
    </div>
  );
}
```


## Testing the Form

1. **Input:** Name = "test", Age = 23
2. **Click Submit**
3. **Console Output:**

```
test
23
```


## Limitations of Uncontrolled Forms

### ❌ **Limited Access**

- Parent components can't read form values
- No real-time validation possible
- Can't prefill values easily
- Testing requires manual DOM manipulation


### ❌ **Indirect Access Required**

- Must use `createRef()` for DOM access
- Only accessible during events (submit, blur, etc.)
- No direct state management


## Next Step

Convert this uncontrolled form to a **controlled form** to see the differences and benefits of each approach.


# Controlled Form Implementation

## Creating Controlled Form Component

### File: `components/ControlledForm.js`

```jsx
import React, { useState, useEffect } from 'react';

export const ControlledForm = () => {
  // State for each input
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  // Real-time validation with useEffect
  useEffect(() => {
    if (name.length < 1) {
      setError('Name cannot be empty');
    } else {
      setError('');
    }
  }, [name]); // Runs whenever name changes

  return (
    <form>
      <input 
        value={name}                           // Controlled by state
        onChange={(e) => setName(e.target.value)}  // Updates state
        name="name"
        type="text"
        placeholder="Enter your name"
      />
      
      <input 
        value={age}                            // Controlled by state  
        onChange={(e) => setAge(e.target.value)}   // Updates state
        name="age"
        type="number"
        placeholder="Enter your age"
      />
      
      <button type="submit">Submit</button>

      {/* Real-time error display */}
      {error && <p>{error}</p>}
    </form>
  );
};
```


## Key Characteristics

### 1. **State Management**

```jsx
const [name, setName] = useState('');     // Track name input
const [age, setAge] = useState('');       // Track age input  
const [error, setError] = useState('');   // Track validation errors
```


### 2. **Controlled Inputs**

```jsx
// Input value controlled by React state
<input 
  value={name}                              // Current state value
  onChange={(e) => setName(e.target.value)} // Update state on change
/>
```


### 3. **Real-time Validation**

```jsx
useEffect(() => {
  if (name.length < 1) {
    setError('Name cannot be empty');
  } else {
    setError('');
  }
}, [name]); // Validates immediately when name changes
```


## Benefits Demonstrated

### ✅ **Real-time Validation**

- Validation occurs **as user types**
- No need to wait for submit
- Immediate feedback to user


### ✅ **State Accessibility**

- Parent components can access current values
- Easy to prefill forms
- Simple to reset or manipulate


### ✅ **Flexible Error Handling**

```jsx
{error && <p>{error}</p>}  // Conditional error display
```


## Testing the Validation

1. **Load page** → Shows "Name cannot be empty"
2. **Start typing** → Error disappears
3. **Clear input** → Error reappears immediately

## Comparison with Uncontrolled

### Uncontrolled Form

- ❌ No real-time validation
- ❌ Values only accessible on events
- ❌ Harder to implement complex features


### Controlled Form

- ✅ Real-time validation
- ✅ State always accessible
- ✅ Easy to add advanced features
- ✅ Better user experience


## Next Steps

This demonstrates why **controlled components are preferred** - they provide much more flexibility for building interactive and user-friendly forms.


# Converting Uncontrolled Modal to Controlled Modal

## The Problem with Uncontrolled Modal

### Uncontrolled Modal (Limited)

```jsx
const UncontrolledModal = ({ children }) => {
  const [show, setShow] = useState(false); // Internal state
  
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Hide Modal' : 'Show Modal'}
      </button>
      {show && (
        <div className="modal-backdrop" onClick={() => setShow(false)}>
          <div className="modal">{children}</div>
        </div>
      )}
    </>
  );
};
```

**Problem:** Parent component **cannot control** when modal shows/hides.

## Creating Controlled Modal

### File: `components/ControlledModal.js`

```jsx
import React from 'react';

export const ControlledModal = ({ shouldDisplay, onClose, children }) => {
  if (!shouldDisplay) return null;
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
```


## Using Controlled Modal in App

### App.js Implementation

```jsx
import React, { useState } from 'react';
import { ControlledModal } from './components/ControlledModal';

function App() {
  const [shouldDisplay, setShouldDisplay] = useState(false);

  return (
    <div>
      <button onClick={() => setShouldDisplay(!shouldDisplay)}>
        {shouldDisplay ? 'Hide Modal' : 'Display Modal'}
      </button>
      
      <ControlledModal 
        shouldDisplay={shouldDisplay}
        onClose={() => setShouldDisplay(false)}
      >
        <h3>I am the body of the modal</h3>
      </ControlledModal>
    </div>
  );
}
```


## Key Differences

### Uncontrolled Modal

- ❌ **Internal state management** (`useState` inside component)
- ❌ **Self-contained logic** (show/hide button built-in)
- ❌ **Limited parent control**
- ❌ **Less flexible**


### Controlled Modal

- ✅ **External state management** (state in parent)
- ✅ **Separation of concerns** (display logic separate from trigger)
- ✅ **Full parent control**
- ✅ **More flexible and reusable**


## Benefits of Controlled Modal

### 1. **Parent Control**

```jsx
// Parent can control modal from anywhere
const handleSpecialAction = () => {
  setShouldDisplay(true); // Show modal programmatically
};
```


### 2. **Multiple Triggers**

```jsx
// Multiple buttons can control same modal
<button onClick={() => setShouldDisplay(true)}>Show from Header</button>
<button onClick={() => setShouldDisplay(true)}>Show from Sidebar</button>
```


### 3. **Conditional Logic**

```jsx
// Complex conditions for showing modal
const showModal = userLoggedIn && hasPermission && dataLoaded;
```


## Testing the Implementation

1. **Click "Display Modal"** → Button text changes to "Hide Modal"
2. **Modal appears** with content
3. **Click outside or button** → Modal disappears
4. **Full parent control** over modal state

This demonstrates why **controlled components provide better flexibility** and reusability.


# Uncontrolled Onboarding Flow

## Creating Uncontrolled Flow Component

### File: `components/UncontrolledFlow.js`

```jsx
import React, { useState } from 'react';

export const UncontrolledFlow = ({ children, onDone }) => {
  // Internal state management
  const [data, setData] = useState({}); // Collect data from steps
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Track current step
  
  // Get current step component
  const currentChild = React.Children.toArray(children)[currentStepIndex];
  
  // Navigate to next step
  const goNext = () => {
    setCurrentStepIndex(currentStepIndex + 1);
  };
  
  // Pass goNext prop to current child
  if (React.isValidElement(currentChild)) {
    return React.cloneElement(currentChild, { goNext });
  }
  
  return currentChild;
};
```


## Creating Step Components

### Simple Step Components

```jsx
const StepOne = ({ goNext }) => (
  <>
    <h1>Hey, I am step number one</h1>
    <button onClick={goNext}>Next</button>
  </>
);

const StepTwo = ({ goNext }) => (
  <>
    <h1>Hey, I am step number two</h1>
    <button onClick={goNext}>Next</button>
  </>
);

const StepThree = ({ goNext }) => (
  <>
    <h1>Hey, I am step number three</h1>
    <button onClick={goNext}>Next</button>
  </>
);
```


## Usage in App.js

### App Implementation

```jsx
import React from 'react';
import { UncontrolledFlow } from './components/UncontrolledFlow';

function App() {
  return (
    <UncontrolledFlow>
      <StepOne />
      <StepTwo />
      <StepThree />
    </UncontrolledFlow>
  );
}
```


## How It Works

### 1. **Step Navigation**

- `currentStepIndex` starts at `0` (first step)
- `goNext()` increments index: `0 → 1 → 2`
- Current step displays based on index


### 2. **Children Management**

```jsx
// Convert children to array (handles single child case)
React.Children.toArray(children)[currentStepIndex]

// Clone element and inject goNext prop
React.cloneElement(currentChild, { goNext })
```


### 3. **State Management**

- `data` - Collects information from each step
- `currentStepIndex` - Tracks which step is active
- `onDone` - Callback when flow completes (not yet implemented)


## Key Features

### ✅ **Sequential Navigation**

- Click "Next" → Move to next step
- Step 1 → Step 2 → Step 3


### ✅ **Automatic Prop Injection**

- Each step automatically receives `goNext` function
- No manual prop passing required


## Current Limitations (Uncontrolled)

### ❌ **No External Control**

- Parent can't control which step is active
- Can't programmatically navigate steps
- No access to current step data


### ❌ **No Data Collection Yet**

- `data` state exists but not used
- No way to save step information
- `onDone` callback not triggered


## Next Steps

1. Add data collection between steps
2. Implement `onDone` callback
3. Convert to **controlled flow** for better flexibility

This demonstrates a basic **uncontrolled onboarding flow** where the component manages its own state internally.


# Enhancing Uncontrolled Flow with Data Collection

## Updated UncontrolledFlow Component

### Enhanced `goNext` Function

```jsx
export const UncontrolledFlow = ({ children, onDone }) => {
  const [data, setData] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const currentChild = React.Children.toArray(children)[currentStepIndex];
  
  const goNext = (dataFromStep) => {
    const nextStepIndex = currentStepIndex + 1;
    
    // Collect and merge data from current step
    const newData = {
      ...data,           // Existing data
      ...dataFromStep    // New data from current step
    };
    
    setData(newData);
    console.log(newData); // Track data collection
    
    // Check if we're at the final step
    if (nextStepIndex < children.length) {
      setCurrentStepIndex(nextStepIndex); // Go to next step
    } else {
      onDone(newData); // Flow completed
    }
  };
  
  if (React.isValidElement(currentChild)) {
    return React.cloneElement(currentChild, { goNext });
  }
  
  return currentChild;
};
```


## Updated Step Components with Data

### Steps That Collect Data

```jsx
const StepOne = ({ goNext }) => (
  <>
    <h1>Hey, I am step number one - Enter your name</h1>
    <button onClick={() => goNext({ name: "My Name" })}>
      Next
    </button>
  </>
);

const StepTwo = ({ goNext }) => (
  <>
    <h1>Hey, I am step number two - Enter your age</h1>
    <button onClick={() => goNext({ age: 23 })}>
      Next
    </button>
  </>
);

const StepThree = ({ goNext }) => (
  <>
    <h1>Hey, I am step number three - Enter your country</h1>
    <button onClick={() => goNext({ country: "Mars" })}>
      Next
    </button>
  </>
);
```


## App.js with Completion Handler

### Usage with Data Handler

```jsx
import React from 'react';
import { UncontrolledFlow } from './components/UncontrolledFlow';

function App() {
  const onDone = (data) => {
    console.log(data);
    alert("Yay, you made it to the final step!");
  };

  return (
    <UncontrolledFlow onDone={onDone}>
      <StepOne />
      <StepTwo />
      <StepThree />
    </UncontrolledFlow>
  );
}
```


## How Data Collection Works

### 1. **Step-by-Step Data Accumulation**

```
Step 1: {} → { name: "My Name" }
Step 2: { name: "My Name" } → { name: "My Name", age: 23 }
Step 3: { name: "My Name", age: 23 } → { name: "My Name", age: 23, country: "Mars" }
```


### 2. **Data Merging Logic**

```jsx
const newData = {
  ...data,           // Spread existing data
  ...dataFromStep    // Add new step data
};
```


### 3. **Flow Completion Check**

```jsx
if (nextStepIndex < children.length) {
  // More steps remaining
  setCurrentStepIndex(nextStepIndex);
} else {
  // Final step reached
  onDone(newData);
}
```


## Current Limitations (Still Uncontrolled)

### ❌ **No Conditional Step Logic**

```jsx
// Cannot do this easily:
// "If age > 25, show Step 3, otherwise skip it"
```


### ❌ **No External Access to Data**

- Parent can't access current step data
- Can't make decisions based on collected data
- No way to skip or modify steps programmatically


### ❌ **Limited Flexibility**

- All logic contained within component
- Parent has minimal control over flow behavior


## Console Output

```
{} // Initial
{ name: "My Name" } // After Step 1
{ name: "My Name", age: 23 } // After Step 2
{ name: "My Name", age: 23, country: "Mars" } // Final + Alert
```


## Next Step

Convert to **controlled flow** to enable:

- Conditional step display
- External data access
- Programmatic flow control
- Dynamic step management

This demonstrates the **limitations of uncontrolled components** when complex logic is needed.


# Converting to Controlled Onboarding Flow

## Creating Controlled Flow Component

### File: `components/ControlledFlow.js`

```jsx
import React from 'react';

export const ControlledFlow = ({ children, currentIndex, onNext }) => {
  const currentChild = React.Children.toArray(children)[currentIndex];
  
  const goNext = (dataFromStep) => {
    onNext(dataFromStep); // Pass data to parent
  };
  
  if (React.isValidElement(currentChild)) {
    return React.cloneElement(currentChild, { goNext });
  }
  
  return currentChild;
};
```


## Moving State to Parent (App.js)

### App.js - Full Control

```jsx
import React, { useState } from 'react';
import { ControlledFlow } from './components/ControlledFlow';

function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState({});

  const onNext = (dataFromStep) => {
    // Update collected data
    const newData = {
      ...data,
      ...dataFromStep
    };
    setData(newData);
    
    // Move to next step
    setCurrentStepIndex(currentStepIndex + 1);
  };

  return (
    <ControlledFlow 
      currentIndex={currentStepIndex}
      onNext={onNext}
    >
      <StepOne />
      <StepTwo />
      
      {/* Conditional Step - Only show if age >= 25 */}
      {data.age >= 25 ? (
        <StepThree />
      ) : null}
      
      <StepFour />
    </ControlledFlow>
  );
}
```


## Updated Step Components

### Steps with Data

```jsx
const StepOne = ({ goNext }) => (
  <>
    <h1>Step 1 - Enter your name</h1>
    <button onClick={() => goNext({ name: "My Name" })}>Next</button>
  </>
);

const StepTwo = ({ goNext }) => (
  <>
    <h1>Step 2 - Enter your age</h1>
    <button onClick={() => goNext({ age: 26 })}>Next</button>
  </>
);

const StepThree = ({ goNext }) => (
  <>
    <h1>Congratulations! You qualify for the gift!</h1>
    <button onClick={() => goNext({})}>Next</button>
  </>
);

const StepFour = ({ goNext }) => (
  <>
    <h1>Step 4 - Final step</h1>
    <button onClick={() => goNext({})}>Finish</button>
  </>
);
```


## Key Benefits of Controlled Flow

### ✅ **Conditional Step Logic**

```jsx
{/* Only show Step 3 if user is 25 or older */}
{data.age >= 25 ? <StepThree /> : null}
```


### ✅ **Full Data Access**

- Parent has **real-time access** to all collected data
- Can make decisions based on user input
- Dynamic flow modification


### ✅ **External Control**

```jsx
// Parent controls everything
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [data, setData] = useState({});
```


## Flow Behavior Examples

### Scenario 1: Age = 23 (< 25)

```
Step 1 → Step 2 → Step 4 (Skip Step 3)
```


### Scenario 2: Age = 26 (>= 25)

```
Step 1 → Step 2 → Step 3 → Step 4 (Show Step 3)
```


## Comparison: Uncontrolled vs Controlled

### Uncontrolled Flow

- ❌ **Internal state only** - no external access
- ❌ **Fixed step sequence** - can't skip steps
- ❌ **Limited flexibility** - hard to add conditions
- ❌ **Testing difficulty** - can't set specific states


### Controlled Flow ✅

- ✅ **External state management** - parent controls everything
- ✅ **Dynamic step logic** - conditional steps easily
- ✅ **Full data access** - real-time decision making
- ✅ **Easy testing** - can set any state


## Real-World Use Cases

### Conditional Steps

```jsx
{/* Show payment step only if cart has items */}
{data.cartItems?.length > 0 && <PaymentStep />}

{/* Show verification step for premium users */}
{data.userType === 'premium' && <VerificationStep />}

{/* Skip steps based on previous answers */}
{!data.hasExperience && <TutorialStep />}
```

This demonstrates why **controlled components provide superior flexibility** for complex business logic and dynamic user experiences.

# Higher Order Components (HOCs) Introduction

## What are Higher Order Components?

### Definition

**Higher Order Components (HOCs)** are components that **return other components** instead of directly returning JSX.

### Basic Concept

```jsx
// Regular Component - returns JSX
const RegularComponent = () => {
  return <div>Hello World</div>;
};

// Higher Order Component - returns a Component
const withSomething = (WrappedComponent) => {
  return function EnhancedComponent(props) {
    return <WrappedComponent {...props} />;
  };
};
```


## Mental Model: Component Factories

### Think of HOCs as Functions

- **HOCs are functions** that generate new components when called
- **Component factories** that create enhanced versions of existing components
- **Additional layer** between component definition and JSX rendering


### Structure

```
Regular:    Component → JSX
HOC:        Function → Component → JSX
```


## Why Use Higher Order Components?

### 1. **Share Behavior Among Components**

```jsx
// Similar to container components
// Multiple components can share same logic
const withDataLoading = (WrappedComponent) => {
  return function WithDataLoading(props) {
    // Shared loading logic here
    return <WrappedComponent {...props} />;
  };
};
```


### 2. **Add Extra Functionality**

```jsx
// Enhance existing components without modification
const withAuthentication = (WrappedComponent) => {
  return function WithAuth(props) {
    // Add authentication logic
    if (!user.isAuthenticated) {
      return <LoginPage />;
    }
    return <WrappedComponent {...props} />;
  };
};
```


### 3. **Legacy Code Enhancement**

- Improve existing components **without modifying original code**
- Add new capabilities to components developed by others
- Non-invasive component enhancement


## Key Benefits

### ✅ **Code Reusability**

- Share common logic across multiple components
- DRY principle (Don't Repeat Yourself)


### ✅ **Non-Invasive Enhancement**

- Add features without touching original component
- Maintain backward compatibility


### ✅ **Separation of Concerns**

- Keep business logic separate from presentation
- Modular and maintainable code


## Real-World Examples

### Authentication HOC

```jsx
const withAuth = (Component) => {
  return (props) => {
    if (!isAuthenticated) return <Login />;
    return <Component {...props} />;
  };
};
```


### Loading HOC

```jsx
const withLoading = (Component) => {
  return (props) => {
    if (props.isLoading) return <Spinner />;
    return <Component {...props} />;
  };
};
```


## Relationship to Container Components

### Similar Purpose

- Both share behavior among components
- Both provide reusable logic patterns


### Different Approach

- **Containers**: Wrap components with JSX
- **HOCs**: Return enhanced component functions


## Next Steps

We'll explore concrete examples showing how HOCs:

- Share logic between components
- Add functionality to existing components
- Provide elegant solutions to common patterns

This foundation will help you understand HOCs as **powerful tools for component composition and enhancement**.


# First HOC Example - Props Logging

## Creating a Props Logging HOC

### File: `components/logProps.js`

```jsx
export const logProps = (Component) => {
  return function LogPropsWrapper(props) {
    console.log(props); // Log all props before rendering
    return <Component {...props} />; // Pass through all original props
  };
};
```


## HOC Structure Breakdown

### 1. **Function that takes a Component**

```jsx
const logProps = (Component) => {
  // Component is the wrapped component (e.g., UserInfo)
}
```


### 2. **Returns a New Component**

```jsx
return function LogPropsWrapper(props) {
  // This is the enhanced component
  // props are the props passed to the wrapper
}
```


### 3. **Renders Original Component**

```jsx
return <Component {...props} />; 
// Spread operator passes all props to original component
```


## Usage Pattern

### Creating the Wrapper

```jsx
import { logProps } from './components/logProps';
import { UserInfo } from './components/UserInfo';

// Create enhanced version of UserInfo
const UserInfoWrapper = logProps(UserInfo);
```


### Using the Wrapper

```jsx
function App() {
  return (
    <UserInfoWrapper 
      testA="I am a test"
      testB="string" 
      testC={21}
    />
  );
}
```


## How It Works

### 1. **Props Flow**

```
App → UserInfoWrapper → logProps → UserInfo
    (passes props)   (logs props) (receives props)
```


### 2. **Console Output**

```javascript
{
  testA: "I am a test",
  testB: "string", 
  testC: 21
}
```


### 3. **Component Rendering**

- Props get logged first
- Then UserInfo renders with those props
- UserInfo shows "Loading..." (because no user prop provided)


## Key HOC Concepts

### ✅ **Component In, Component Out**

```jsx
// Input: UserInfo component
// Output: Enhanced UserInfo with logging
const Enhanced = logProps(UserInfo);
```


### ✅ **Non-Invasive Enhancement**

- Original UserInfo component **unchanged**
- Logging functionality **added externally**
- Props **passed through transparently**


### ✅ **Reusable Pattern**

```jsx
// Can wrap any component
const EnhancedButton = logProps(Button);
const EnhancedForm = logProps(Form);
const EnhancedModal = logProps(Modal);
```


## Convention Notes

### 1. **Lowercase HOC Names**

```jsx
// Convention: start with lowercase
const logProps = ...
const withAuth = ...
const withLoading = ...
```


### 2. **Wrapper Naming**

```jsx
// Pattern: [ComponentName]Wrapper
const UserInfoWrapper = logProps(UserInfo);
const ButtonWrapper = logProps(Button);
```


## Real-World Applications

### Beyond Logging

- **Props validation** - Check prop types/values
- **Props transformation** - Modify props before passing
- **Debugging** - Track component renders and props
- **Development tools** - Add dev-only features


## Next Steps

This basic example shows HOC fundamentals. Upcoming examples will demonstrate:

- More complex logic
- Practical use cases
- Advanced HOC patterns

The **core pattern remains the same**: function takes component → returns enhanced component.


# HOC for Data Fetching

## Creating Data Fetching HOC

### File: `components/includeUser.js`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const includeUser = (Component, userId) => {
  return function IncludeUserWrapper(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
      (async () => {
        const response = await axios.get(`/users/${userId}`);
        setUser(response.data);
      })();
    }, []); // Empty dependency array - fetch once

    // Return original component with additional user prop
    return <Component {...props} user={user} />;
  };
};
```


## Usage in App.js

### Creating Enhanced Component

```jsx
import { includeUser } from './components/includeUser';
import { UserInfo } from './components/UserInfo';

// Create enhanced UserInfo with user data
const UserInfoWithLoader = includeUser(UserInfo, 3); // Fetch user ID 3

function App() {
  return (
    <UserInfoWithLoader />
    // No need to pass user prop - HOC handles it
  );
}
```


## How It Works

### 1. **HOC Structure**

```jsx
// Takes component + userId parameter
includeUser(Component, userId)
  ↓
// Returns enhanced component
function IncludeUserWrapper(props)
  ↓  
// Fetches data and adds user prop
<Component {...props} user={userData} />
```


### 2. **Data Flow**

```
1. IncludeUserWrapper mounts
2. useEffect triggers axios.get(`/users/${userId}`)
3. Server returns user data  
4. setUser(response.data) updates state
5. Component re-renders with user prop
6. UserInfo displays user data
```


### 3. **Props Enhancement**

```jsx
// Original props passed through: {...props}
// Additional prop added: user={user}
<UserInfo {...originalProps} user={fetchedUser} />
```


## Key HOC Patterns

### ✅ **Data Fetching Logic Separation**

- UserInfo component **doesn't know** about data fetching
- HOC handles **all server communication**
- Clean separation of concerns


### ✅ **Reusable Data Pattern**

```jsx
// Same HOC can wrap different components
const UserProfileWithLoader = includeUser(UserProfile, 1);
const UserCardWithLoader = includeUser(UserCard, 2);
const UserDetailsWithLoader = includeUser(UserDetails, 3);
```


### ✅ **Non-Invasive Enhancement**

- Original UserInfo component **unchanged**
- Works with any component expecting `user` prop
- Legacy components can be enhanced easily


## Comparison with Container Components

### Similarities

- Both handle data fetching
- Both pass data to child components
- Both promote reusability


### Differences

```jsx
// Container Component (wraps with JSX)
<UserContainer>
  <UserInfo />
</UserContainer>

// HOC (creates new component)
const EnhancedUserInfo = includeUser(UserInfo, 3);
<EnhancedUserInfo />
```


## Required Setup

### 1. **Server Running**

```bash
node server.js  # Start backend server
npm start       # Start React app
```


### 2. **Server Endpoint**

```
GET /users/:id  # Returns user data for specified ID
```


## Result

- **UserInfo renders** with user data from server
- **Loading state** handled automatically (user starts as null)
- **No props needed** when using the enhanced component

This demonstrates how HOCs can **encapsulate complex data fetching logic** while keeping components simple and focused.

# Enhanced HOC for GET and POST Operations

## Creating Updatable User HOC

### File: `components/includeUpdatableUser.js`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const includeUpdatableUser = (Component, userId) => {
  return function IncludeUpdatableUserWrapper(props) {
    // Store original user data (for reset functionality)
    const [initialUser, setInitialUser] = useState(null);
    
    // Store current user state (for editing)
    const [user, setUser] = useState(null);

    // Fetch user data on component mount
    useEffect(() => {
      (async () => {
        const response = await axios.get(`/users/${userId}`);
        setInitialUser(response.data); // Store original
        setUser(response.data);        // Store current
      })();
    }, []);

    // Handle local user updates (form changes)
    const onChangeUser = (updates) => {
      setUser({
        ...user,    // Keep existing properties
        ...updates  // Apply updates
      });
    };

    // Save changes to server
    const onPostUser = async () => {
      const response = await axios.post(`/users/${userId}`, user);
      setInitialUser(response.data); // Update original with saved data
      setUser(response.data);        // Update current with saved data
    };

    // Reset to original values
    const onResetUser = () => {
      setUser(initialUser); // Revert to original fetched data
    };

    // Return enhanced component with additional props
    return (
      <Component 
        {...props}
        user={user}
        onChangeUser={onChangeUser}
        onPostUser={onPostUser}
        onResetUser={onResetUser}
      />
    );
  };
};
```


## Key Features

### 1. **Dual State Management**

```jsx
const [initialUser, setInitialUser] = useState(null); // Original data
const [user, setUser] = useState(null);               // Editable data
```

**Purpose:**

- `initialUser` - Backup for reset functionality
- `user` - Current state for editing


### 2. **Three Core Functions**

#### **onChangeUser** - Local Updates

```jsx
const onChangeUser = (updates) => {
  setUser({
    ...user,    // Preserve existing fields
    ...updates  // Apply new changes
  });
};

// Usage: onChangeUser({ name: "New Name" })
```


#### **onPostUser** - Save to Server

```jsx
const onPostUser = async () => {
  const response = await axios.post(`/users/${userId}`, user);
  setInitialUser(response.data); // Update backup
  setUser(response.data);        // Update current
};
```


#### **onResetUser** - Restore Original

```jsx
const onResetUser = () => {
  setUser(initialUser); // Revert all changes
};
```


### 3. **Enhanced Props Injection**

```jsx
<Component 
  {...props}              // Original props
  user={user}             // Current user data
  onChangeUser={...}      // Update function
  onPostUser={...}        // Save function  
  onResetUser={...}       // Reset function
/>
```


## Server Endpoint Required

### POST /users/:id

```javascript
// server.js
app.post('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  
  // Update user logic
  users[id] = updatedUser;
  
  res.json(updatedUser);
});
```


## Usage Flow

### 1. **Component Mounts**

- Fetches user data via GET request
- Sets both `initialUser` and `user` states


### 2. **User Edits Data**

- Component calls `onChangeUser({ field: newValue })`
- Updates only local `user` state
- Server data unchanged


### 3. **User Saves Changes**

- Component calls `onPostUser()`
- Sends POST request with current `user` data
- Updates both states with server response


### 4. **User Resets Changes**

- Component calls `onResetUser()`
- Reverts `user` to `initialUser` values
- Discards unsaved changes


## Benefits Over Simple Data Fetching HOC

### ✅ **Complete CRUD Operations**

- **Read**: Initial data fetching
- **Update**: Local and server updates
- **Reset**: Restore original values


### ✅ **Optimistic Updates**

- Local changes happen immediately
- Server sync happens separately
- Better user experience


### ✅ **Reset Functionality**

- Easy to discard changes
- Always have original data backup


## Next Step

Create a UserForm component that utilizes all these HOC capabilities:

- Display user data
- Edit user fields
- Save changes
- Reset to original

This HOC provides a **complete data management solution** for form-based components.

# Creating User Form with Updatable HOC

## Creating the User Form Component

### File: `components/UserInfoForm.js`

```jsx
import React from 'react';
import { includeUpdatableUser } from './includeUpdatableUser';

// Base form component
const UserForm = ({ user, onChangeUser, onPostUser, onResetUser }) => {
  // Destructure user data with fallback to empty object
  const { name, age } = user || {};

  // Show loading if user data not yet loaded
  if (!user) {
    return <h3>Loading...</h3>;
  }

  return (
    <form>
      {/* Name Input */}
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => onChangeUser({ name: e.target.value })}
      />

      {/* Age Input */}
      <label>Age</label>
      <input
        type="text"
        value={age}
        onChange={(e) => onChangeUser({ age: Number(e.target.value) })}
      />

      {/* Action Buttons */}
      <button type="button" onClick={onResetUser}>
        Reset
      </button>
      
      <button type="button" onClick={onPostUser}>
        Save
      </button>
    </form>
  );
};

// Export HOC-wrapped component
export const UserInfoForm = includeUpdatableUser(UserForm, 3);
```


## Alternative HOC Usage Pattern

### Method 1: Create Wrapper in App.js (Previous Examples)

```jsx
// In App.js
const UserInfoWrapper = includeUpdatableUser(UserInfo, 3);
```


### Method 2: Wrap During Export (Current Example)

```jsx
// In component file
export const UserInfoForm = includeUpdatableUser(UserForm, 3);
```

**Benefits of Method 2:**

- ✅ Component comes pre-wrapped
- ✅ Cleaner App.js usage
- ✅ Self-contained component definition


## How the Form Works

### 1. **Display Current Data**

```jsx
const { name, age } = user || {}; // Extract with fallback

<input value={name} ... />        // Show current name
<input value={age} ... />         // Show current age
```


### 2. **Handle Input Changes**

```jsx
// Update name locally
onChange={(e) => onChangeUser({ name: e.target.value })}

// Update age locally (convert to number)  
onChange={(e) => onChangeUser({ age: Number(e.target.value) })}
```


### 3. **Action Buttons**

```jsx
// Reset to original values
<button onClick={onResetUser}>Reset</button>

// Save changes to server
<button onClick={onPostUser}>Save</button>
```


## Usage in App.js

### Simple Import and Use

```jsx
import { UserInfoForm } from './components/UserInfoForm';

function App() {
  return (
    <div>
      <UserInfoForm />  {/* Already wrapped with HOC */}
    </div>
  );
}
```


## User Interaction Flow

### 1. **Form Loads**

- Shows "Loading..." initially
- HOC fetches user data (ID: 3)
- Form displays current name and age


### 2. **User Edits Fields**

- Type in name field → `onChangeUser({ name: newValue })`
- Type in age field → `onChangeUser({ age: Number(newValue) })`
- Changes are **local only** (not saved yet)


### 3. **Reset Changes**

- Click "Reset" → `onResetUser()`
- Form reverts to original fetched values
- Discards unsaved changes


### 4. **Save Changes**

- Click "Save" → `onPostUser()`
- POST request sends current data to server
- Server updates user record
- Form updates with server response


## Testing the Form

### Example Interaction

```
1. Form loads with: name="Long Name Person", age=25
2. User changes name to "Code Licks", age to 45
3. Click "Reset" → Reverts to "Long Name Person", 25
4. Change name to "Code Licks" again  
5. Click "Save" → Data saved to server
6. Refresh page → Shows "Code Licks" (persisted)
```


## Key Benefits

### ✅ **Complete Form Functionality**

- Load, edit, save, reset all handled
- No server communication code in component
- Clean separation of concerns


### ✅ **Reusable Pattern**

```jsx
// Can create forms for different entities
export const UserForm = includeUpdatableUser(BaseUserForm, userId);
export const ProductForm = includeUpdatableProduct(BaseProductForm, productId);
```


### ✅ **HOC Encapsulation**

- All CRUD logic contained in HOC
- Form component focuses only on UI
- Easy to test and maintain

This demonstrates a **complete data management solution** using HOCs for complex form interactions.


# Creating Generic Updatable Resource HOC

## Creating Generic Resource HOC

### File: `components/includeUpdatableResource.js`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const includeUpdatableResource = (Component, resourceUrl, resourceName) => {
  return function IncludeUpdatableResourceWrapper(props) {
    const [initialResource, setInitialResource] = useState(null);
    const [resource, setResource] = useState(null);

    useEffect(() => {
      (async () => {
        const response = await axios.get(resourceUrl);
        setInitialResource(response.data);
        setResource(response.data);
      })();
    }, []);

    const onChange = (updates) => {
      setResource({
        ...resource,
        ...updates
      });
    };

    const onPost = async () => {
      const response = await axios.post(resourceUrl, resource);
      setInitialResource(response.data);
      setResource(response.data);
    };

    const onReset = () => {
      setResource(initialResource);
    };

    // Helper function to capitalize first letter
    const toCapital = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Build dynamic props object
    const resourceProps = {
      [resourceName]: resource, // user: userData or book: bookData
      [`onChange${toCapital(resourceName)}`]: onChange,     // onChangeUser or onChangeBook
      [`onPost${toCapital(resourceName)}`]: onPost,         // onPostUser or onPostBook  
      [`onReset${toCapital(resourceName)}`]: onReset        // onResetUser or onResetBook
    };

    return <Component {...props} {...resourceProps} />;
  };
};
```


## Dynamic Props Generation

### The Problem

```jsx
// Different components need different prop names
// UserForm needs: onChangeUser, onPostUser, onResetUser
// BookForm needs: onChangeBook, onPostBook, onResetBook
```


### The Solution - Dynamic Object Keys

```jsx
const resourceProps = {
  [resourceName]: resource,                           // Dynamic key
  [`onChange${toCapital(resourceName)}`]: onChange,    // Template literal key
  [`onPost${toCapital(resourceName)}`]: onPost,
  [`onReset${toCapital(resourceName)}`]: onReset
};
```


### toCapital Helper Function

```jsx
const toCapital = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Examples:
// toCapital('user') → 'User'
// toCapital('book') → 'Book'
```


## Updated User Form Usage

### Modify UserInfoForm

```jsx
import { includeUpdatableResource } from './includeUpdatableResource';

const UserForm = ({ user, onChangeUser, onPostUser, onResetUser }) => {
  const { name, age } = user || {};

  if (!user) {
    return <h3>Loading...</h3>;
  }

  return (
    <form>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => onChangeUser({ name: e.target.value })}
      />

      <label>Age</label>
      <input
        type="text"
        value={age}
        onChange={(e) => onChangeUser({ age: Number(e.target.value) })}
      />

      <button type="button" onClick={onResetUser}>Reset</button>
      <button type="button" onClick={onPostUser}>Save</button>
    </form>
  );
};

// Updated export with generic HOC
export const UserInfoForm = includeUpdatableResource(
  UserForm, 
  '/users/2',  // resourceUrl
  'user'       // resourceName
);
```


## Benefits of Generic Version

### ✅ **Multi-Resource Support**

```jsx
// For users
const UserForm = includeUpdatableResource(BaseUserForm, '/users/1', 'user');

// For books  
const BookForm = includeUpdatableResource(BaseBookForm, '/books/1', 'book');

// For products
const ProductForm = includeUpdatableResource(BaseProductForm, '/products/1', 'product');
```


### ✅ **Proper Prop Naming**

```jsx
// UserForm receives: { user, onChangeUser, onPostUser, onResetUser }
// BookForm receives: { book, onChangeBook, onPostBook, onResetBook }
```


### ✅ **No Prop Conflicts**

```jsx
// Can use multiple HOCs together without naming conflicts
const ComplexForm = includeUpdatableResource(
  includeUpdatableResource(BaseForm, '/users/1', 'user'),
  '/books/1', 
  'book'
);
// Results in: { user, book, onChangeUser, onChangeBook, ... }
```


## Practice Challenge 🎯

### Create a Book Form

1. **Create BookForm component** similar to UserForm
2. **Use includeUpdatableResource HOC** to wrap it
3. **Handle book properties** (title, author, pages, etc.)
4. **Test CRUD operations** with books endpoint

### Example Book Form Structure

```jsx
const BookForm = ({ book, onChangeBook, onPostBook, onResetBook }) => {
  const { title, author, pages } = book || {};
  
  // Implement form with book-specific fields
  // Use onChangeBook, onPostBook, onResetBook functions
};

export const BookInfoForm = includeUpdatableResource(
  BookForm,
  '/books/1',
  'book'
);
```


## Key Takeaways

- **Generic HOCs** increase reusability across different data types
- **Dynamic prop naming** prevents conflicts in complex scenarios
- **Template literals** and **computed property names** enable flexible prop generation
- **Same functionality** can work with users, books, products, or any resource

This pattern creates a **truly reusable data management HOC** for any REST resource!

# Custom Hooks Introduction

## What are Custom Hooks?

### Definition

**Custom hooks are reusable functions that combine existing React hooks** (useState, useEffect, etc.) to create tailored functionality for specific use cases.

### Purpose

- **Encapsulate complex behavior** into reusable units
- **Avoid repeating logic** across multiple components
- **Abstract functionality** into clean, testable units


## Basic Example Concept

### Without Custom Hook (Repetitive)

```jsx
// Component A
const ComponentA = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);
  
  return <div>{/* render users */}</div>;
};

// Component B - Same logic repeated!
const ComponentB = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);
  
  return <div>{/* render users differently */}</div>;
};
```


# First Custom Hook - Current User

## Creating Current User Hook

### File: `components/currentUser.hook.js`

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get('/current-user');
      setUser(response.data);
    })();
  }, []); // Empty dependency array - run once

  return user; // Return the user data
};
```


## Using Custom Hook in Component

### Updated UserInfo Component

```jsx
import React from 'react';
import { useCurrentUser } from './currentUser.hook';

export const UserInfo = () => {
  // Use custom hook instead of receiving user as prop
  const user = useCurrentUser();

  const { name, age, country, books } = user || {};

  return user ? (
    <div className="user-info">
      <h2>{name}</h2>
      <p>Age: {age} years</p>
      <p>Country: {country}</p>
      <h3>Books:</h3>
      <ul>
        {books?.map(book => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};
```


## App.js Usage

### Simple Component Usage

```jsx
import React from 'react';
import { UserInfo } from './components/UserInfo';

function App() {
  return (
    <div>
      <UserInfo /> {/* No props needed - hook handles data */}
    </div>
  );
}
```


## Custom Hook Structure

### 1. **Naming Convention**

```jsx
// File: currentUser.hook.js (good convention for identification)
export const useCurrentUser = () => { ... };
//            ↑ Must start with "use"
```


### 2. **Hook Composition**

```jsx
const useCurrentUser = () => {
  const [user, setUser] = useState(null);  // State management
  
  useEffect(() => {                        // Side effect (data fetching)
    // Fetch data logic
  }, []); 
  
  return user;                             // Return value
};
```


### 3. **Data Fetching Pattern**

```jsx
useEffect(() => {
  (async () => {              // Immediately invoked async function
    const response = await axios.get('/current-user');
    setUser(response.data);
  })();
}, []); // Empty array = run only once
```


## How It Works

### 1. **Hook Execution Flow**

```
1. Component calls useCurrentUser()
2. Hook initializes user state as null
3. useEffect triggers on mount
4. Async function fetches data from /current-user
5. setUser updates state with response data
6. Component re-renders with user data
7. Hook returns current user state
```


### 2. **Component Benefits**

```jsx
// Before: Component needs user passed as prop
const UserInfo = ({ user }) => { ... };

// After: Component handles its own data
const UserInfo = () => {
  const user = useCurrentUser(); // Self-contained
  // ...
};
```


## Key Advantages

### ✅ **Encapsulation**

- Data fetching logic contained in hook
- Component focuses only on rendering
- Easy to modify data source


### ✅ **Reusability**

```jsx
// Multiple components can use same hook
const UserProfile = () => {
  const user = useCurrentUser();
  // Profile UI
};

const UserDashboard = () => {
  const user = useCurrentUser(); // Same data, different UI
  // Dashboard UI
};
```


### ✅ **Testability**

```jsx
// Can test hook independently
import { renderHook } from '@testing-library/react-hooks';
import { useCurrentUser } from './currentUser.hook';

test('fetches current user', async () => {
  const { result } = renderHook(() => useCurrentUser());
  // Test hook behavior
});
```


## Next Enhancement

In the next video, we'll make this hook more generic to:

- Fetch any user by ID
- Handle different endpoints
- Add loading states
- Error handling

This foundation shows how custom hooks provide **clean separation between data logic and UI rendering**.



### With Custom Hook (Reusable)

```jsx
// Custom Hook
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);
  
  return { users, loading };
};

// Component A - Clean and focused
const ComponentA = () => {
  const { users, loading } = useUsers();
  return <div>{/* render users */}</div>;
};

// Component B - Same functionality, no duplication
const ComponentB = () => {
  const { users, loading } = useUsers();
  return <div>{/* render users differently */}</div>;
};
```


## Key Characteristics

### ✅ **Must Start with "use"**

```jsx
// ✅ Correct naming
const useUsers = () => { ... };
const useCounter = () => { ... };
const useLocalStorage = () => { ... };

// ❌ Incorrect naming
const getUsers = () => { ... };      // Missing 'use'
const fetchData = () => { ... };     // Missing 'use'
```

**Why "use"?** React uses this naming convention to:

- Identify hooks for lint rules
- Apply hooks rules (can't call in loops, conditions, etc.)
- Enable proper React DevTools integration


### ✅ **Return Values**

```jsx
const useCounter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return { count, increment, decrement }; // Return object
};

// Or return array
const useToggle = () => {
  const [isOn, setIsOn] = useState(false);
  const toggle = () => setIsOn(!isOn);
  
  return [isOn, toggle]; // Return array
};
```


## Comparison with Other Patterns

### Similar Purpose - Different Approach

#### **Container Components**

- Wrap components with JSX
- Share logic through component composition
- More verbose for simple cases


#### **Higher Order Components**

- Return enhanced components
- Function takes component, returns component
- Can be complex for multiple enhancements


#### **Custom Hooks** ✅

- Share logic directly through function calls
- Clean, composable, easy to test
- Modern React preferred approach


## Benefits of Custom Hooks

### ✅ **Code Reusability**

- Write once, use everywhere
- DRY principle (Don't Repeat Yourself)


### ✅ **Separation of Concerns**

- Business logic separate from UI
- Components focus on rendering
- Hooks focus on state/behavior


### ✅ **Easy Testing**

- Test hooks in isolation
- No need for component rendering
- Pure function testing


### ✅ **Composability**

```jsx
// Hooks can use other hooks
const useApi = (url) => { ... };
const useUsers = () => useApi('/users');
const useProducts = () => useApi('/products');
```


## Next Steps

We'll explore creating practical custom hooks for:

- Data fetching patterns
- Form handling
- Local storage management
- Counter functionality
- And much more!

Custom hooks represent the **modern, preferred way** to share stateful logic in React applications.

# Enhanced User Hook with Dynamic ID

## Creating Enhanced User Hook

### File: `components/user.hook.js`

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUser = (userId) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`/users/${userId}`);
      setUser(response.data);
    })();
  }, [userId]); // Re-run when userId changes

  return user;
};
```


## Key Enhancement: Dynamic Parameters

### 1. **Accept Parameters**

```jsx
// Before: Fixed current user
export const useCurrentUser = () => { ... };

// After: Dynamic user ID
export const useUser = (userId) => { ... };
//                     ↑ Parameter for flexibility
```


### 2. **Dynamic URL Construction**

```jsx
// Before: Fixed endpoint
axios.get('/current-user')

// After: Dynamic endpoint  
axios.get(`/users/${userId}`)
```


### 3. **Dependency Array**

```jsx
useEffect(() => {
  // Fetch logic
}, [userId]); // Re-fetch when userId changes
```


## Updated UserInfo Component

### Component with User ID Prop

```jsx
import React from 'react';
import { useUser } from './user.hook';

export const UserInfo = ({ userId }) => {
  // Pass userId to custom hook
  const user = useUser(userId);

  const { name, age, country, books } = user || {};

  return user ? (
    <div className="user-info">
      <h2>{name}</h2>
      <p>Age: {age} years</p>
      <p>Country: {country}</p>
      <h3>Books:</h3>
      <ul>
        {books?.map(book => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};
```


## Usage in App.js

### Multiple Users with Different IDs

```jsx
import React from 'react';
import { UserInfo } from './components/UserInfo';

function App() {
  return (
    <div>
      <UserInfo userId={1} />  {/* Fetch user 1 */}
      <UserInfo userId={2} />  {/* Fetch user 2 */}
      <UserInfo userId={3} />  {/* Fetch user 3 */}
    </div>
  );
}
```


## How Dynamic Updates Work

### 1. **Initial Render**

```
1. <UserInfo userId={1} /> mounts
2. useUser(1) initializes with userId = 1
3. useEffect triggers with [1] dependency
4. Fetches /users/1
5. Updates user state
6. Component renders user 1 data
```


### 2. **Props Change**

```
1. Parent changes userId prop: 1 → 2
2. useUser(2) receives new userId parameter
3. useEffect detects dependency change: [1] → [2]
4. Re-runs fetch logic with /users/2
5. Updates user state with new data
6. Component re-renders with user 2 data
```


## Benefits of Enhanced Hook

### ✅ **Reusable Across Components**

```jsx
// User profile page
const UserProfile = ({ id }) => {
  const user = useUser(id);
  return <div>{/* Profile UI */}</div>;
};

// User card component
const UserCard = ({ userId }) => {
  const user = useUser(userId);
  return <div>{/* Card UI */}</div>;
};
```


### ✅ **Dynamic Data Loading**

```jsx
const [selectedUserId, setSelectedUserId] = useState(1);
const user = useUser(selectedUserId);

// Change user dynamically
<button onClick={() => setSelectedUserId(2)}>
  Load User 2
</button>
```


### ✅ **Multiple Instances**

```jsx
// Load multiple users simultaneously
const UserComparison = () => {
  const user1 = useUser(1);
  const user2 = useUser(2);
  
  return (
    <div>
      <div>User 1: {user1?.name}</div>
      <div>User 2: {user2?.name}</div>
    </div>
  );
};
```


## Browser Result

```
User 3: [Name from user 3]
User 2: [Name from user 2]  
User 1: [Name from user 1]
```


## Evolution Summary

### From Fixed to Dynamic

1. **useCurrentUser()** → Fixed current user endpoint
2. **useUser(userId)** → Dynamic user by ID
3. **Next**: Generic resource fetching for any data type

This demonstrates how custom hooks can evolve from **specific solutions to flexible, reusable patterns**.

# Generic Resource Hook

## Creating Generic Resource Hook

### File: `components/resource.hook.js`

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useResource = (resourceUrl) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(resourceUrl);
      setResource(response.data);
    })();
  }, [resourceUrl]); // Re-run when resourceUrl changes

  return resource;
};
```


## Key Changes from User Hook

### 1. **Generic Naming**

```jsx
// Before: User-specific
const [user, setUser] = useState(null);
return user;

// After: Generic resource
const [resource, setResource] = useState(null);
return resource;
```


### 2. **Flexible URL Parameter**

```jsx
// Before: Constructed URL
axios.get(`/users/${userId}`)

// After: Complete URL passed as parameter
axios.get(resourceUrl)
```


### 3. **Dynamic Dependency**

```jsx
useEffect(() => {
  // Fetch logic
}, [resourceUrl]); // Re-fetch when URL changes
```


## Using with User Data

### Updated UserInfo Component

```jsx
import React from 'react';
import { useResource } from './resource.hook';

export const UserInfo = ({ userId }) => {
  // Pass complete resource URL
  const user = useResource(`/users/${userId}`);

  const { name, age, country, books } = user || {};

  return user ? (
    <div className="user-info">
      <h2>{name}</h2>
      <p>Age: {age} years</p>
      <p>Country: {country}</p>
      <h3>Books:</h3>
      <ul>
        {books?.map(book => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};
```


## Using with Book Data

### BookInfo Component

```jsx
import React from 'react';
import { useResource } from './resource.hook';

export const BookInfo = ({ bookId }) => {
  // Same hook, different resource
  const book = useResource(`/books/${bookId}`);

  const { title, author, pages } = book || {};

  return book ? (
    <div className="book-info">
      <h2>{title}</h2>
      <p>Author: {author}</p>
      <p>Pages: {pages}</p>
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};
```


## App.js Usage

### Multiple Resource Types

```jsx
import React from 'react';
import { UserInfo } from './components/UserInfo';
import { BookInfo } from './components/BookInfo';

function App() {
  return (
    <div>
      <UserInfo userId={2} />   {/* Fetches /users/2 */}
      <BookInfo bookId={2} />   {/* Fetches /books/2 */}
    </div>
  );
}
```


## Versatility Examples

### Different Resource Types

```jsx
// Users
const user = useResource('/users/1');
const currentUser = useResource('/current-user');

// Books  
const book = useResource('/books/3');
const allBooks = useResource('/books');

// Products
const product = useResource('/products/5');
const categories = useResource('/categories');

// Any API endpoint
const stats = useResource('/dashboard/stats');
const settings = useResource('/user/settings');
```


## Benefits of Generic Hook

### ✅ **Single Hook for All Resources**

- No need for `useUser`, `useBook`, `useProduct` hooks
- One hook handles all GET requests
- Reduces code duplication


### ✅ **Flexible URL Construction**

```jsx
// Static URLs
const data = useResource('/api/data');

// Dynamic URLs
const user = useResource(`/users/${userId}`);
const posts = useResource(`/users/${userId}/posts`);

// Query parameters
const search = useResource(`/search?q=${query}&limit=10`);
```


### ✅ **Easy to Extend**

```jsx
// Can easily add features like:
// - Loading states
// - Error handling  
// - Caching
// - Retry logic
```


## Real-World Usage Patterns

### 1. **Dynamic Resource Loading**

```jsx
const [resourceType, setResourceType] = useState('users');
const [resourceId, setResourceId] = useState(1);

const data = useResource(`/${resourceType}/${resourceId}`);
```


### 2. **Conditional Loading**

```jsx
const ProductDetails = ({ productId, includeReviews }) => {
  const product = useResource(`/products/${productId}`);
  const reviews = useResource(
    includeReviews ? `/products/${productId}/reviews` : null
  );
  
  // Render logic
};
```


## Browser Result

```
[User 2 data displayed]
[Book 2 data displayed]
```


## Evolution Complete

### Pattern Evolution

1. **useCurrentUser()** → Fixed endpoint
2. **useUser(userId)** → Dynamic user by ID
3. **useResource(resourceUrl)** → Any resource, any endpoint

This creates a **truly universal data fetching hook** that can handle any REST API endpoint with consistent behavior and minimal code duplication.

# Ultimate Generic Data Source Hook

## Creating Data Source Hook

### File: `components/dataSource.hook.js`

```jsx
import { useState, useEffect } from 'react';

export const useDataSource = (getData) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getData();
      setResource(data);
    })();
  }, [getData]); // Re-run when getData function changes

  return resource;
};
```


## Key Evolution: Function Injection

### 1. **No More Hardcoded Data Sources**

```jsx
// Before: Hardcoded axios call
useEffect(() => {
  const response = await axios.get(resourceUrl);
  setResource(response.data);
}, [resourceUrl]);

// After: Injected function
useEffect(() => {
  const data = await getData();
  setResource(data);
}, [getData]);
```


### 2. **Complete Data Source Agnostic**

- Hook doesn't know about servers, localStorage, Redux, etc.
- Data fetching logic provided externally
- Maximum flexibility and reusability


## Usage Examples

### 1. **Server Data Fetching**

```jsx
import { useDataSource } from './dataSource.hook';
import axios from 'axios';

// Server fetching function
const fetchFromServer = async (resourceUrl) => {
  const response = await axios.get(resourceUrl);
  return response.data;
};

const UserInfo = ({ userId }) => {
  const user = useDataSource(() => fetchFromServer(`/users/${userId}`));
  
  // Component logic
};
```


### 2. **Local Storage Data**

```jsx
// Local storage function
const getDataFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

const Message = () => {
  const message = useDataSource(() => getDataFromLocalStorage('message'));
  
  return <p>{message}</p>;
};
```


### 3. **Multiple Data Sources**

```jsx
// Redux data (hypothetical)
const getFromRedux = (selector) => {
  return useSelector(selector);
};

// API with authentication
const fetchProtectedData = async (url, token) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```


## Complete UserInfo Example

### With Function Separation

```jsx
import React, { useCallback } from 'react';
import { useDataSource } from './dataSource.hook';
import axios from 'axios';

export const UserInfo = ({ userId }) => {
  // Separate fetch function with useCallback to prevent infinite renders
  const fetchUser = useCallback(async () => {
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  }, [userId]); // Only recreate when userId changes

  const user = useDataSource(fetchUser);

  const { name, age, country, books } = user || {};

  return user ? (
    <div className="user-info">
      <h2>{name}</h2>
      <p>Age: {age} years</p>
      <p>Country: {country}</p>
      <h3>Books:</h3>
      <ul>
        {books?.map(book => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};
```


## The Infinite Render Problem \& Solution

### ⚠️ **The Problem**

```jsx
// This causes infinite renders!
const UserInfo = ({ userId }) => {
  const fetchUser = async () => {          // New function instance every render
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  };
  
  const user = useDataSource(fetchUser);   // Triggers useEffect every time
  // Infinite loop: render → new function → useEffect → setState → render
};
```


### ✅ **The Solution: useCallback**

```jsx
import { useCallback } from 'react';

const UserInfo = ({ userId }) => {
  const fetchUser = useCallback(async () => {    // Memoized function
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  }, [userId]);  // Only recreate when userId changes
  
  const user = useDataSource(fetchUser);   // No infinite loop
};
```


## How useCallback Works

```jsx
const fetchUser = useCallback(
  async () => {
    // Function implementation
  },
  [userId]    // Dependencies: only recreate when these change
);

// Same as:
// If userId hasn't changed, return cached function
// If userId has changed, create new function with new userId value
```


## Evolution Summary

### Complete Hook Evolution

1. **useCurrentUser()** → Fixed current user
2. **useUser(userId)** → Dynamic user by ID
3. **useResource(resourceUrl)** → Any HTTP endpoint
4. **useDataSource(getData)** → Any data source via function injection

## Benefits of Final Version

### ✅ **Ultimate Flexibility**

```jsx
// Server, localStorage, Redux, IndexedDB, WebSockets, etc.
const data = useDataSource(anyAsyncFunction);
```


### ✅ **Testable**

```jsx
// Easy to mock data sources for testing
const mockGetData = jest.fn().mockResolvedValue(testData);
const { result } = renderHook(() => useDataSource(mockGetData));
```


### ✅ **Reusable Patterns**

```jsx
// Create specific hooks built on generic one
const useUser = (userId) => useDataSource(() => fetchUser(userId));
const useBook = (bookId) => useDataSource(() => fetchBook(bookId));
```

This represents the **ultimate generic data fetching pattern** - completely agnostic about data sources while maintaining clean, predictable behavior.

