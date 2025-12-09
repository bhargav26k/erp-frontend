import React, { lazy, Suspense, useState } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useAuth, AuthPage, Logout } from "../modules/auth";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import Loader from "./Loader"; // Import the consolidated loader

// Lazy load PrivateRoutes so they aren't loaded on auth page
const PrivateRoutesLazy = lazy(() => import("./PrivateRoutes"));
const PayPortalPageLazy = lazy(
  () => import("../pages/StaffPages/FinancialManagement/PayPortalPage")
);
const FeesDetailPayPortalLazy = lazy(
  () => import("../pages/StaffPages/FinancialManagement/FeesDetailPayPortal")
);
const ParentPortalPageLazy = lazy(
  () => import("../pages/StaffPages/FinancialManagement/ParentPortalLogin")
);
const FeesDetailParentPortalLazy = lazy(
  () => import("../pages/StaffPages/FinancialManagement/ParentPortalPage")
);
const CollectFeesLinkLazy = lazy(
  () => import("../pages/StaffPages/FinancialManagement/CollectFeesLink")
);
const FeesReceiptLazy = lazy(
  () => import("../pages/StaffPages/FinancialManagement/FeesReceipt")
);
const AdmissionFormLazy = lazy(
  () => import("../pages/StaffPages/AdmissionsAndEnrollment/AdmissionForm")
);
const TransactionPageLazy = lazy(
  () => import("../pages/StaffPages/FinancialManagement/TransactionPage")
);
import { App } from "../App";
import "./App.css";

const { BASE_URL } = import.meta.env;

const AppRoutes: React.FC = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  
  return (
    <BrowserRouter basename={BASE_URL || ""}>
      <Suspense fallback={<Loader message="Loading application..." overlay={true} />}>
        <Routes>
          <Route element={<App />}>
            <Route
              path="/parent-portal/fees"
              element={<FeesDetailPayPortalLazy />}
            />
            <Route path="/parent-portal/userlogin" element={<ParentPortalPageLazy />} />
            <Route
              path="/parent-portal/home"
              element={<FeesDetailParentPortalLazy />}
            />
            <Route path="/fee-payment" element={<CollectFeesLinkLazy />} />
            <Route path="/fee-reciept" element={<FeesReceiptLazy />} />
            <Route path="/admission-form" element={<AdmissionFormLazy />} />
            <Route
              path="/fee-payment-response"
              element={<TransactionPageLazy />}
            />
          </Route>

          {/* Authentication paths */}
          {!auth && (
            <>
              <Route path="/auth/*" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}

          {/* Authenticated Private Routes */}
          {auth && (
            <>
              <Route element={<App />}>
                <Route
                  path="/*"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading routes..." overlay={true} />}
                    >
                      <PrivateRoutesLazy setLoading={setLoading} />
                    </Suspense>
                  }
                />
                <Route path="/logout" element={<Logout />} />
              </Route>
            </>
          )}

          <Route path="/error/*" element={<ErrorsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export { AppRoutes };