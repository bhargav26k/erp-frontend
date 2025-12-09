import {Suspense, useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import {ThemeModeProvider} from '../_metronic/partials/indexex'
import { ToastContainer } from 'react-toastify'

const App = () => {
  // 🟡 Activity tracking effect
  useEffect(() => {
    const updateActivityTime = () => {
      const lsValue = localStorage.getItem('kt-auth-react-v')
      if (!lsValue) return

      try {
        const auth = JSON.parse(lsValue)
        auth.last_activity_time = new Date().toISOString()
        localStorage.setItem('kt-auth-react-v', JSON.stringify(auth))
      } catch (error) {
        console.error('Failed to update activity time:', error)
      }
    }

    // Add global listeners
    window.addEventListener('mousemove', updateActivityTime)
    window.addEventListener('keydown', updateActivityTime)
    window.addEventListener('click', updateActivityTime)

    // Clean up on unmount
    return () => {
      window.removeEventListener('mousemove', updateActivityTime)
      window.removeEventListener('keydown', updateActivityTime)
      window.removeEventListener('click', updateActivityTime)
    }
  }, [])

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <MasterInit />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
