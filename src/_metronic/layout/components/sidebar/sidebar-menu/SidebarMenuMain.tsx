import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { useAuth } from "../../../../../app/modules/auth/core/Auth";
import { useEffect, useState } from "react";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";
import { SidebarMenuHome } from "./SidebarMenuHome";

// const SidebarMenuMain = () => {
//   const { currentUser } = useAuth();

//   const userRole = currentUser?.role_name;
//   const role_id = currentUser?.role_id;
//   const designation_id = currentUser?.designation_id;
//   const [modulesData, setModulesData] = useState([]);
//   console.log(modulesData);
  
//   const [subscriptionId, setSubscriptionId] = useState(null);
//   const school_id = currentUser?.school_id;
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const schoolId = school_id;
//     const fetchSubscriptionId = async () => {
//       try {
//         const response = await fetch(
//           `${DOMAIN}/api/superadmin/get-subscription-id/${schoolId}`
//         );
//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }
//         const data = await response.json();
//         setSubscriptionId(data.result[0]?.subscription_id);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (schoolId) {
//       fetchSubscriptionId();
//     } else {
//       setLoading(false);
//     }
//   }, [school_id]);

//   useEffect(() => {
//     if (!currentUser) return;

//     const fetchData = async () => {
//       try {
//         let apiUrl;
//         switch (userRole) {
//           case "Super Admin":
//             apiUrl = `${DOMAIN}/api/superadmin/get-modules`;
//             break;
//           case "School Admin":
//           case "School Master":
//             apiUrl = `${DOMAIN}/api/superadmin/get-parent-module/${subscriptionId}`;
//             break;
//           case "School Staff":
//             apiUrl = `${DOMAIN}/api/school/get-modules/${school_id}/${role_id}/${designation_id}`;
//             break;
//           case "student":
//             apiUrl = `${DOMAIN}/api/student/get-student-modules/${school_id}/${role_id}/${designation_id}`;
//             break;
//           default:
//             throw new Error("Invalid user role");
//         }

//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();

//         setModulesData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, [currentUser, subscriptionId, school_id, role_id, designation_id]);

//   const getPathForModule = (modulePath) => modulePath || "/";

//   const getIconPath = (moduleName) => `media/logos/${moduleName}.svg`;

//   return (
//     <>
//       <SidebarMenuHome to="/" icon="media/logos/home.svg" title="Home" />
//       {
//         // If user is Super Admin, render using modulesData directly
//         Object.keys(modulesData).length > 0 &&
//           Object.keys(modulesData).map((perm_group_name, index) => (
//             <SidebarMenuItemWithSub
//               key={index}
//               to="#"
//               icon={getIconPath(perm_group_name)}
//               menuPlacement="right-start"
//               menuTrigger="hover"
//               title={perm_group_name}
//             >
//               {/* <div
//                 style={{
//                   paddingBottom: "5px",
//                   borderBottom: "1px solid lightgray",
//                 }}
//               >
//                 <span
//                   className="menu-section"
//                   style={{
//                     color: "#000",
//                     fontFamily: "Manrope",
//                     fontSize: "16px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   {perm_group_name}
//                 </span>
//               </div> */}
//               <div>
//                 {modulesData[perm_group_name]
//                   .filter(({ sidebar_name }) => sidebar_name) // Filter out items with no sidebar_name
//                   .map(({ perm_cat_id, path, sidebar_name }, index) => (
//                     <SidebarMenuItem
//                       key={perm_cat_id} // Using perm_cat_id as the unique key
//                       icon=""
//                       to={getPathForModule(path)} // Mapping path to "to" property
//                       title={sidebar_name} // Mapping sidebar_name to title, display only if available
//                     />
//                   ))}
//               </div>
//             </SidebarMenuItemWithSub>
//           ))
//       }
//     </>
//   );
// };

// export { SidebarMenuMain };


const SidebarMenuMain = () => {
  const { currentUser } = useAuth();

  const userRole = currentUser?.role_name;
  const role_id = currentUser?.role_id;
  const designation_id = currentUser?.designation_id;
  const [modulesData, setModulesData] = useState([]);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const school_id = currentUser?.school_id;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the sequence for the sidebar sections
  const sidebarSequence = [
    "Front Office",
    "Admissions And Enrollment",
    "Academic Management",
    "Student Management",
    "Financial Management",
    "Analytics And Reporting",
    "Examination",
    "Library & Resource Management",
    "Facilities Management",
    "Transportation Management",
    "Hostel Management",
    "Communication And Collaboration",
    "Front CMS",
    "Human Resource",
    "Certificate",
    "Alumni Relations",
    "Dashboard and Widgets",
    "Extracurricular Activities",
    "Vendor & Supplier Management",
    "Attendance Management",
    "Learning Management System",
    "System Settings",
    "Manage Organisations",
    "ERP Settings",
    "Manage Subscriptions",
  ];
  

  useEffect(() => {
    const schoolId = school_id;
    const fetchSubscriptionId = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/superadmin/get-subscription-id/${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setSubscriptionId(data.result[0]?.subscription_id);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      fetchSubscriptionId();
    } else {
      setLoading(false);
    }
  }, [school_id]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        let apiUrl;
        switch (userRole) {
          case "Super Admin":
            apiUrl = `${DOMAIN}/api/superadmin/get-modules`;
            break;
          case "School Admin":
          case "School Master":
            apiUrl = `${DOMAIN}/api/superadmin/get-parent-module/${subscriptionId}`;
            break;
          case "School Staff":
            apiUrl = `${DOMAIN}/api/school/get-modules/${school_id}/${role_id}/${designation_id}`;
            break;
          case "student":
            apiUrl = `${DOMAIN}/api/student/get-student-modules/${school_id}/${role_id}/${designation_id}`;
            break;
          default:
            throw new Error("Invalid user role");
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        setModulesData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentUser, subscriptionId, school_id, role_id, designation_id]);

  const getPathForModule = (modulePath) => modulePath || "/";

  const getIconPath = (moduleName) => `media/logos/${moduleName}.svg`;

  // Sort modulesData based on the predefined sequence and ignore missing items
  const sortedModules = sidebarSequence.map((name) => ({
    name,
    items: modulesData[name] || [], // Fallback to an empty array if the module is missing
  }));

  return (
    <>
      <SidebarMenuHome to="/" icon="media/logos/home.svg" title="Home" />
      {sortedModules.map(({ name, items }, index) => (
        items.length > 0 && ( // Render only if items exist
          <SidebarMenuItemWithSub
            key={index}
            to="#"
            icon={getIconPath(name)}
            menuPlacement="right-start"
            menuTrigger="hover"
            title={name}
          >
            <div>
              {items
                .filter(({ sidebar_name }) => sidebar_name) // Filter out items with no sidebar_name
                .map(({ perm_cat_id, path, sidebar_name }) => (
                  <SidebarMenuItem
                    key={perm_cat_id} // Using perm_cat_id as the unique key
                    icon=""
                    to={getPathForModule(path)} // Mapping path to "to" property
                    title={sidebar_name} // Mapping sidebar_name to title, display only if available
                  />
                ))}
            </div>
          </SidebarMenuItemWithSub>
        )
      ))}
    </>
  );
};

export { SidebarMenuMain };
