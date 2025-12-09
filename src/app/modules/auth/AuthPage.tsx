import {Route, Routes, useParams} from 'react-router-dom'
// import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {StaffLogin} from './components/StaffLogin'
import {SuperAdminLogin} from './components/SuperAdminLogin'
import AuthLayout from './AuthLayout'
import { StudentLogin } from './components/StudentLogin'
import { FC } from 'react'

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='userlogin' element={<StudentLogin />} />
      <Route path='/' element={<StaffLogin />} />
      <Route path='superadmin/login' element={<SuperAdminLogin />} />
      <Route path="forgot-password/:role" element={<ForgotPasswordWrapper />} />
      <Route index element={<StaffLogin />} />
    </Route>
  </Routes>
)
const ForgotPasswordWrapper: FC = () => {
  const { role } = useParams();
  return <ForgotPassword role={role} />;
};


export {AuthPage}
