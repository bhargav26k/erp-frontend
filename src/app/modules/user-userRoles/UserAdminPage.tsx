import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {UserList} from './components/UserList'
import {UserRoles} from './components/UserRoles'

const wizardsBreadCrumbs: Array<PageLink> = [
  {
    title: 'User-Admin',
    path: '/admin/user-admin/user-list',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const UserAdminPage = () => (
  <Routes>
    <Route element={<Outlet />}>
      <Route
        path='user-list'
        element={
          <>
            <PageTitle breadcrumbs={wizardsBreadCrumbs}>User-List</PageTitle>
            <UserList />
          </>
        }
      />
      <Route
        path='user-roles'
        element={
          <>
            <PageTitle breadcrumbs={wizardsBreadCrumbs}>User-Roles</PageTitle>
            <UserRoles />
          </>
        }
      />
      <Route index element={<Navigate to='/admin/user-admin/user-list' />} />
    </Route>
  </Routes>
)

export default UserAdminPage
