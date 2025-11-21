# React 19.2 Features - FAQ & Troubleshooting

## ❓ Frequently Asked Questions

### Q1: Will useEffectEvent cause issues with my existing code?
**A**: No! useEffectEvent is imported as `experimental_useEffectEvent` and is only used for save operations. All existing functionality remains unchanged.

### Q2: Why is my search still slow?
**A**: Make sure you're:
1. Using `useDeferredValue` (it's implemented)
2. Not performing heavy operations synchronously
3. Checking DevTools Performance tab to identify bottlenecks

**Solution**: 
```javascript
// Verify useDeferredValue is being used
const deferredSearchQuery = useDeferredValue(searchQuery);
// Type to test - should remain responsive
```

### Q3: Error Boundary isn't catching my error?
**A**: Error Boundaries only catch:
- ✅ Rendering errors
- ✅ Lifecycle method errors
- ❌ Event handler errors
- ❌ Async code errors
- ❌ Server-side errors

**Solution**: Use try-catch for event handlers:
```javascript
const handleClick = () => {
  try {
    // your code
  } catch (error) {
    console.error(error);
  }
};
```

### Q4: Why is useEffectEvent not working?
**A**: Make sure:
1. It's imported correctly: `import { experimental_useEffectEvent as useEffectEvent }`
2. Used inside a component body, not conditionally
3. React version is 19.2+

**Verify:**
```bash
npm list react
# Should show: react@19.2.0 or higher
```

### Q5: Can I use Suspense with Redux/Zustand?
**A**: Yes, but with caveats:
- Suspense works best with promises
- Use `useSuspenseQuery` from React Query if integrating
- For Zustand, wrap async actions properly

### Q6: Does Error Boundary work with Hooks?
**A**: Error Boundaries are class components, but they catch errors from functional components with hooks.

---

## 🐛 Troubleshooting Guide

### Issue: "experimental_useEffectEvent is not exported from React"

**Cause**: React version < 19.2
**Solution**:
```bash
npm update react react-dom
npm list react  # Verify it shows 19.2.0+
```

### Issue: "Suspense doesn't seem to work"

**Cause**: Component might not be throwing a promise
**Solution**:
```javascript
// Wrap with proper error handling
<Suspense fallback={<Loading />}>
  <ErrorBoundary>
    <Component />
  </ErrorBoundary>
</Suspense>
```

### Issue: "useDeferredValue not improving search performance"

**Cause**: Issue might be in searchData function
**Solution**: Check if searchData is optimized:
```javascript
// Check if searchData is slow
console.time('search');
const results = searchData(query);
console.timeEnd('search');

// Optimize if needed
const searchData = useCallback((query) => {
  return data.filter(item => 
    item.toString().toLowerCase().includes(query.toLowerCase())
  );
}, [data]);
```

### Issue: "Error Boundary not showing custom message"

**Cause**: Need to check ErrorBoundary import
**Solution**:
```javascript
// Verify import
import ErrorBoundary from '../components/ErrorBoundary';

// Check component is working
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Issue: "Performance tracks not showing in DevTools"

**Cause**: 
1. Development mode not enabled
2. React DevTools not installed
3. Performance tab not recording properly

**Solution**:
1. Install React DevTools browser extension
2. Make sure app is in development (not production build)
3. Open DevTools → Performance → Record

---

## 🔍 Performance Debugging

### Check if useEffectEvent is working:
```javascript
// Add console.log in performSave
const performSave = useEffectEvent((filename, format) => {
  console.log('Save triggered:', filename, format);
  // ...
});

// Test: Make changes, should see log after 2 seconds
```

### Check if useDeferredValue is working:
```javascript
// Add console.log to see defer in action
const deferredSearchQuery = useDeferredValue(searchQuery);
console.log('Original:', searchQuery);
console.log('Deferred:', deferredSearchQuery);

// Should see original update immediately, deferred update after
```

### Monitor component renders:
```bash
# In Chrome DevTools
1. Open Performance tab
2. Record
3. Interact with app
4. Stop recording
5. Look for React component renders in timeline
```

---

## 🚨 Common Errors & Solutions

### Error: "Cannot call experimental_useEffectEvent outside of a component"
**Fix**: Make sure useEffectEvent is called inside a React component:
```javascript
// WRONG - outside component
const performSave = useEffectEvent(() => {});

// CORRECT - inside component
function MyComponent() {
  const performSave = useEffectEvent(() => {});
}
```

### Error: "useDeferredValue received non-serializable value"
**Fix**: Make sure the value is serializable:
```javascript
// WRONG
const deferred = useDeferredValue(functionRef);

// CORRECT
const deferred = useDeferredValue(stringQuery);
```

### Error: "Error Boundary did not catch error"
**Reason**: Error Boundaries don't catch:
- Event handler errors
- Async errors
- Server errors

**Use try-catch instead**:
```javascript
const handleSave = async () => {
  try {
    await save();
  } catch (error) {
    console.error(error);
  }
};
```

---

## 📈 Performance Tips

### 1. Optimize search with useDeferredValue + memo
```javascript
const SearchResults = memo(({ data, query }) => {
  return data.filter(item => item.includes(query)).map(...);
});

function App() {
  const deferred = useDeferredValue(query);
  return <SearchResults data={data} query={deferred} />;
}
```

### 2. Batch multiple saves
```javascript
const performSave = useEffectEvent((operations) => {
  // Save all operations at once
  operations.forEach(op => {
    localStorage.setItem(`save_${op.id}`, JSON.stringify(op));
  });
});
```

### 3. Use useCallback with Suspense
```javascript
const getData = useCallback(async () => {
  const data = await fetch(url);
  return data.json();
}, [url]);

return (
  <Suspense fallback={<Loading />}>
    <Component getData={getData} />
  </Suspense>
);
```

---

## 🔧 Configuration

### Enable React DevTools profiler:
```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeHook.onCommitFiberRoot = 
    (id, root, priorityLevel) => {
      console.log('React fiber updated:', id);
    };
}
```

### Disable console logs in production:
```javascript
// In production
const log = process.env.NODE_ENV === 'development' 
  ? console.log 
  : () => {};

log('Debug info');
```

---

## 📚 React 19.2 Version Checking

```bash
# Check installed version
npm list react
npm list react-dom

# Update to latest
npm update react react-dom

# Or specific version
npm install react@19.2.0 react-dom@19.2.0
```

---

## 🎯 Testing Checklist

- [ ] useEffectEvent saves work without infinite loops
- [ ] useDeferredValue keeps search responsive
- [ ] Error Boundary catches and displays errors
- [ ] Suspense shows loading state
- [ ] No warnings in console
- [ ] Performance improved vs before
- [ ] Mobile responsiveness maintained

---

## 💡 Best Practices

1. **Always wrap Suspense with ErrorBoundary**
   ```javascript
   <ErrorBoundary>
     <Suspense fallback={<Loading />}>
       <Component />
     </Suspense>
   </ErrorBoundary>
   ```

2. **Use useEffectEvent for all side effects**
   - Save operations
   - Analytics
   - External API calls

3. **Use useDeferredValue for expensive computations**
   - Search filtering
   - Data sorting
   - Large calculations

4. **Test error scenarios**
   - What if save fails?
   - What if search times out?
   - What if API is down?

---

## 🤝 Getting Help

If you encounter issues:

1. Check this FAQ first
2. Review [React 19.2 Docs](https://react.dev/blog/2025/10/01/react-19-2)
3. Check browser console for errors
4. Use React DevTools to inspect component state
5. Enable Performance profiling to find bottlenecks

---

**Last Updated**: December 2024
**React Version**: 19.2.0+
**CoSheet Version**: 1.0.0
