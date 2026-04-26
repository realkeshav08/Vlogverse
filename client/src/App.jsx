import { useContext, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import RequireAuth from './auth/RequireAuth';
import PersistLogin from './auth/PersistLogin';
import RedirectIfAuth from './auth/RedirectIfAuth';

// Component Imports
import Layout from './components/layout/Layout';
import Unauthorized from './components/subcomponents/Unauthorized';
import Register from './components/subcomponents/Register';
import Login from './components/subcomponents/Login';
import ForgotPassword from './components/subcomponents/ForgotPassword';
import ResetPassword from './components/subcomponents/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import Posts from './components/posts/Posts';
import Network from './components/network/Network';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile'
import Jobs from './components/jobs/Jobs';
import NotFound from './components/subcomponents/NotFound';
import SplashScreen from './components/subcomponents/SplashScreen';

// Context Imports
import ThemeContext from './context/ThemeContext';
import useAuth from './auth/useAuth';
import { ProfileProvider } from './context/ProfileContext';

function App() {

  const { darkMode } = useContext(ThemeContext);
  const { auth, setAuth } = useAuth();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <SplashScreen />;
  }

  return (
    <main className='w-full min-h-screen bg-base-200' data-theme={darkMode ? "dim" : "nord"}>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path='*' element={<Navigate to='/' replace />} />
        <Route path='/unauthorized' element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          <Route element={<RedirectIfAuth />}>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={['owner', 'admin', 'moderator', 'user']} />}>
            <Route element={<Layout />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/profile' element={<Navigate to={`/profile/${auth?.username}`} />} />
              <Route path="/profile/:username" element={<ProfileProvider />}>
                <Route index element={<Profile />} />
                <Route path="edit" element={<EditProfile />} />
              </Route>
              <Route path='/blogs' element={<Posts auth={auth} setAuth={setAuth} />} />
              <Route path='/search' element={<div className="text-center py-20 text-2xl font-bold">Search coming soon...</div>} />
              <Route path='/jobs' element={<Jobs />} />
              <Route path='/network' element={<Network />} />
            </Route>
          </Route>
        </Route>
        {/* End Protected Routes */}

      </Routes>
    </main>
  )
}

export default App
