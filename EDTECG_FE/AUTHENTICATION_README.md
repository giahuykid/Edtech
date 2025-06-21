# Authentication System Documentation

## Overview

This React application includes a comprehensive authentication system with the following features:

- **Login/Register Forms**: Tabbed interface with form validation
- **Token-based Authentication**: JWT access and refresh tokens
- **Automatic Token Refresh**: Axios interceptors handle token refresh automatically
- **Protected Routes**: Route protection based on authentication status
- **Error Handling**: Comprehensive error handling and user feedback

## Components

### AuthForm Component (`src/components/AuthForm.tsx`)

A React functional component that provides:
- **Two tabs**: Login and Register
- **Form validation**: Client-side validation with error messages
- **Password visibility toggle**: Show/hide password functionality
- **Loading states**: Visual feedback during API calls
- **Success/Error messages**: User-friendly notifications

#### Login Form Fields:
- `username` (required)
- `password` (required)

#### Register Form Fields:
- `fullName` (required)
- `username` (required, minimum 3 characters)
- `password` (required, minimum 6 characters)
- `confirmPassword` (required, must match password)

### AuthService (`src/services/authService.ts`)

A singleton service that handles:
- **API calls**: Login, register, and token refresh
- **Token management**: Storage and retrieval from localStorage
- **Axios interceptors**: Automatic token attachment and refresh
- **Authentication state**: Check if user is authenticated

## API Endpoints

### Authentication Endpoints

1. **POST /api/auth/register**
   ```json
   {
     "fullName": "John Doe",
     "username": "johndoe",
     "password": "password123",
     "confirmPassword": "password123"
   }
   ```

2. **POST /api/auth/login**
   ```json
   {
     "username": "johndoe",
     "password": "password123"
   }
   ```

3. **POST /api/auth/refresh-token**
   ```json
   {
     "refreshToken": "refresh_token_here"
   }
   ```

### Response Format
All authentication endpoints return a `TokenPair`:
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

## Token Management

### Storage
- **Access Token**: Stored in `localStorage.accessToken`
- **Refresh Token**: Stored in `localStorage.refreshToken`

### Automatic Token Refresh
The system includes axios interceptors that:

1. **Request Interceptor**: Automatically attaches the access token to all requests
2. **Response Interceptor**: Handles 401 errors by:
   - Attempting to refresh the token
   - Retrying the original request
   - Redirecting to login if refresh fails

### Token Refresh Flow
```
1. Request fails with 401
2. Check if refresh token exists
3. Send refresh token request
4. If successful:
   - Update tokens in localStorage
   - Retry original request
   - Process queued requests
5. If failed:
   - Clear tokens
   - Redirect to login
```

## Route Protection

### ProtectedRoute Component
Wraps routes that require authentication:
```tsx
<ProtectedRoute>
  <Component />
</ProtectedRoute>
```

### Authentication Check
- Uses `authService.isAuthenticated()` to check token presence
- Redirects to `/login` if not authenticated
- All main application routes are protected

## Usage

### Basic Usage
1. Navigate to `/login`
2. Use the Register tab to create an account
3. Switch to Login tab and sign in
4. Access protected routes automatically

### Programmatic Usage
```typescript
import authService from './services/authService';

// Check authentication
const isAuth = authService.isAuthenticated();

// Logout
authService.logout();

// Get tokens
const accessToken = authService.getAccessToken();
const refreshToken = authService.getRefreshToken();
```

## Error Handling

### Form Validation
- **Client-side validation**: Real-time validation with error messages
- **Server-side validation**: API error responses displayed to user
- **Network errors**: Generic error messages for network issues

### Token Errors
- **Expired tokens**: Automatically refreshed
- **Invalid tokens**: User redirected to login
- **Network errors**: Graceful degradation

## Security Features

1. **Token-based authentication**: No session storage
2. **Automatic token refresh**: Seamless user experience
3. **Secure token storage**: localStorage (consider httpOnly cookies for production)
4. **Route protection**: Prevents unauthorized access
5. **Password validation**: Minimum length requirements
6. **Password confirmation**: Prevents typos during registration

## Dependencies

- **React**: 18.2.0
- **Material-UI**: 5.15.10
- **Axios**: 1.6.2
- **React Router**: 6.21.1

## Environment Configuration

The authentication system uses the API URL from environment configuration:
- **Development**: `http://localhost:8000`
- **Production**: Set via `REACT_APP_API_URL` environment variable

## Future Enhancements

1. **Remember Me**: Persistent login functionality
2. **Password Reset**: Forgot password flow
3. **Email Verification**: Account verification
4. **Social Login**: OAuth integration
5. **Two-Factor Authentication**: Enhanced security
6. **Session Management**: Multiple device handling 