# Expo Router Production-Safe Checklist

## ✅ Critical Fixes Applied to Your Project

1. **Removed `unstable_settings`** - The `anchor` setting forces a specific route as initial, breaking intended navigation flow in production.

2. **Added proper `app/index.tsx`** - Entry point now redirects to onboarding using `<Redirect href="/(auth)/onboarding" />`.

3. **Added `app/(auth)/_layout.tsx`** - Every route group needs a `_layout.tsx` file with proper Stack/Tabs configuration.

4. **Fixed typo** - Renamed `onboading.tsx` → `onboarding.tsx`.

---

## Production-Safe Expo Router Checklist

### 1. Entry Point (`app/index.tsx`)
- [ ] Must exist and export a valid component
- [ ] Use `<Redirect href="/initial-route" />` for navigation-based apps
- [ ] Never leave empty

### 2. Layout Files
- [ ] Every route group `(groupName)` MUST have a `_layout.tsx`
- [ ] Root `_layout.tsx` should list all route groups in `<Stack.Screen name="(group)" />`
- [ ] Avoid `unstable_settings` unless absolutely necessary

### 3. Route Declarations (Root `_layout.tsx`)
```tsx
// ✅ CORRECT - explicitly declare all routes
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="(auth)" />
  <Stack.Screen name="(tabs)" />
</Stack>

// ❌ WRONG - using unstable_settings to force initial route
export const unstable_settings = {
  anchor: '(tabs)', // This overrides your index.tsx redirect!
};
```

### 4. Navigation
- [ ] Use `router.push()` or `router.replace()` from `expo-router`
- [ ] Use typed routes when `experiments.typedRoutes: true`
- [ ] Avoid mixing React Navigation APIs with Expo Router

### 5. File Naming
- [ ] Check for typos in route file names
- [ ] Route names are case-sensitive
- [ ] Use lowercase with hyphens for URLs (e.g., `my-route.tsx`)

### 6. Build Testing
```bash
# Always test in production mode before building APK
npx expo start --no-dev --minify

# Clear cache if issues persist
npx expo start -c
```

### 7. Common Production-Only Failures

| Issue | Cause | Fix |
|-------|-------|-----|
| Wrong initial screen | `unstable_settings.anchor` | Remove or use index.tsx redirect |
| Blank screen | Empty layout file | Add proper Stack/Tabs export |
| Navigation crash | Missing route declaration | Declare route in parent layout |
| 404 on reload | Static web output | Add fallback or use server output |

### 8. Recommended Project Structure
```
app/
├── _layout.tsx          # Root layout (Stack)
├── index.tsx            # Entry point with Redirect
├── (auth)/
│   ├── _layout.tsx      # Auth Stack layout
│   ├── onboarding.tsx
│   ├── Login.tsx
│   └── Registration.tsx
├── (tabs)/
│   ├── _layout.tsx      # Tab layout
│   ├── index.tsx
│   └── explore.tsx
└── (farmer)/
    └── _layout.tsx      # Feature Stack layout
```

---

## Quick Debug Commands

```bash
# Clear all caches
rm -rf node_modules/.cache
npx expo start -c

# Check for route issues
npx expo-doctor

# Verify typed routes
npx expo customize tsconfig.json
```
