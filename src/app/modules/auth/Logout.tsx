import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './core/Auth'

export function Logout() {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Extract values before clearing
    const role = currentUser?.role_name
    const userId = currentUser?.id

    logout()

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('toast_shown_')) {
        localStorage.removeItem(key)
      }
    })

    // Role-based redirect
    if (userId === '7' || role === 'Super Admin') {
      navigate('/auth/superadmin/login')
    } else {
      navigate('/')
    }

    // Optional full reload
    setTimeout(() => {
      document.location.reload()
    }, 100)
  }, [logout, navigate, currentUser])

  return null
}
