import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  matchPath,
} from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import { useAuth } from "../../app/modules/auth/core/Auth";
import { useEffect, useState } from "react";
import { DOMAIN } from "../../app/routing/ApiEndpoints";
import { DashboardWrapper } from "../pages/dashboard/DashboardWrapper";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import Loader from "./Loader"; // Import the consolidated loader
import "./App.css";

interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
}

interface PrivateRoutesProps {
  setLoading?: (loading: boolean) => void;
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ setLoading: setParentLoading }) => {
  const { currentUser } = useAuth();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [routes, setRoutes] = useState<RouteConfig[]>([]);
  const [authorizedPaths, setAuthorizedPaths] = useState<string[]>([]);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const school_id = currentUser?.school_id;
  const role_id = currentUser?.role_id;
  const designation_id = currentUser?.designation_id;

  // Fetch User Role
  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role_name);
    }
  }, [currentUser]);

  // Fetch Subscription ID for School Admin
  useEffect(() => {
    const fetchSubscriptionId = async () => {
      if (
        school_id &&
        (userRole === "School Admin" || userRole === "School Master")
      ) {
        try {
          const response = await fetch(
            `${DOMAIN}/api/superadmin/get-subscription-id/${school_id}`
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data = await response.json();
          setSubscriptionId(data.result[0].subscription_id);
        } catch (err) {
          console.error("Error fetching subscription ID:", err);
        }
      }
    };

    fetchSubscriptionId();
  }, [school_id, userRole]);

  // Common function to fetch and set routes
  const fetchRoutes = async (url: string, basePath: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }
      const data = await response.json();

      let componentModule;
      const routesPromises = Object.keys(data).flatMap((group) =>
        data[group].map(async (module: any) => {
          try {
            if (module.component_name && module.path) {
              if (userRole === "Super Admin") {
                componentModule = await import(
                  /* @vite-ignore */ `${basePath}/${module.component_name}`
                );
              } else {
                componentModule = await import(
                  /* @vite-ignore */ `${basePath}${module.parent_module}/${module.component_name}`
                );
              }

              return {
                path: module.path,
                component: componentModule.default,
              };
            }
          } catch (err) {
            console.error(
              `Failed to import component ${module.component_name}`,
              err
            );
            return null;
          }
        })
      );

      const fetchedRoutes = (await Promise.all(routesPromises)).filter(Boolean);

      setRoutes(fetchedRoutes);
      setAuthorizedPaths((prevPaths) => [
        ...prevPaths,
        ...fetchedRoutes.map((route) => route.path),
      ]);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        // Also update parent loading state if provided
        if (setParentLoading) {
          setParentLoading(false);
        }
      }, 1000);
    }    
  };

  // Fetch routes based on user role
  useEffect(() => {
    if (userRole) {
      if (userRole === "Super Admin") {
        fetchRoutes(
          `${DOMAIN}/api/superadmin/get-modules`,
          "../pages/SuperAdminPages/"
        );
      } else if (
        (userRole === "School Admin" || userRole === "School Master") &&
        subscriptionId
      ) {
        fetchRoutes(
          `${DOMAIN}/api/superadmin/get-parent-module/${subscriptionId}`,
          "../pages/StaffPages/"
        );
      } else if (userRole === "School Staff" && designation_id) {
        fetchRoutes(
          `${DOMAIN}/api/school/get-modules/${school_id}/${role_id}/${designation_id}`,
          "../pages/StaffPages/"
        );
      }
    }
  }, [userRole, subscriptionId, designation_id, school_id, role_id]);

  // Redirect to unauthorized if the path is not in authorized paths
  const matchPath = (path: string, currentPath: string) => {
    const pathRegex = new RegExp(`^${path.replace(/:\w+/g, "[^/]+")}$`);
    return pathRegex.test(currentPath);
  };

  useEffect(() => {
    if (!loading && window.location.pathname) {
      const currentPath = window.location.pathname.split("?")[0];

      const pathIsAuthorized = authorizedPaths.some((path) =>
        matchPath(path, currentPath)
      );

      if (
        !pathIsAuthorized &&
        currentPath !== "/" &&
        currentPath !== "/unauthorized"
      ) {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [authorizedPaths, loading, navigate]);

  // Use the consolidated loader
  if (loading || routes.length === 0) {
    return <Loader message="Initializing application..." overlay={true} />;
  }
  
  const AuthRedirect = () => <Navigate to="/" />;

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="auth/*" element={<AuthRedirect />} />
        {routes.map(({ path, component: Component }) => {
          if (!Component) {
            console.error(`Component for path ${path} is undefined`);
            return null;
          }
          return <Route key={path} path={path} element={<Component />} />;
        })}
        <Route path="/" element={<DashboardWrapper />} />
        <Route path="/unauthorized" element={<ErrorsPage />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;