import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout.jsx'
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import WatchPage from '../pages/WatchPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import UploadVideoPage from '../pages/UploadVideoPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import ChannelPage from '../pages/ChannelPage.jsx'
import PlaylistPage from '../pages/PlaylistPage.jsx'
import HistoryPage from '../pages/HistoryPage.jsx'
import LikedVideosPage from '../pages/LikedVideosPage.jsx'
import SubscriptionsPage from '../pages/SubscriptionsPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch/:videoId" element={<WatchPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadVideoPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/channel/:username" element={<ChannelPage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistPage />}/>
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/liked-videos" element={<LikedVideosPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes