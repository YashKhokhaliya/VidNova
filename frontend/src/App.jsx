import AppRoutes from './routes/AppRoutes.jsx'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser } from './features/auth/authSlice.js'

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return (
    <>
    <AppRoutes />

    <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#181818',
            color: '#f1f1f1',
            border: '1px solid #303030',
          },
        }}
      />
    </>
  )
}

export default App