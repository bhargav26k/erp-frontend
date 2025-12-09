import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { DOMAIN,getDesignationModule,StoreDesignationPermission} from "../../../../app/routing/ApiEndpoints";
import { useAuth } from "../../../../app/modules/auth";

interface Module {
  module_name: string;
  module_id: number;
  module_checked: number;
  is_assigned: number;
}

interface Category {
  id: number;
  name: string;
  modules: Module[];
}
const TablesWidget66 = ({school_id, designation_id}:any) => {
  const {currentUser} = useAuth();
  
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const restrict = params.get("restrict");
    const [schoolModules, setSchoolModules] = useState<Category[]>([]);
    
    const [selectedIds, setSelectedIds] = useState<{ [key: string]: boolean }>(
      {}
    );
    const [initialSelectedIds, setInitialSelectedIds] = useState<{
      [key: string]: boolean;
    }>({});
  
  
    const [isEditingDisabled, setIsEditingDisabled] = useState(false);
  
    useEffect(() => {
      if (restrict === "true") {
        setIsEditingDisabled(true);
      }
    }, [restrict]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${DOMAIN}/${getDesignationModule}/${school_id}/${designation_id}`
          );
          if (!response.ok) {
            // Extract the status and error message from the response
            const errorData = await response.json();
            throw new Error(`Error ${errorData.status}: ${errorData.error || "Unknown error"}`);
          }
          const result = await response.json();
          setSchoolModules(result.data);
  
          // Initialize selectedIds based on fetched data
          const initialIds: { [key: string]: boolean } = {};
          result.data.forEach((category: any) => {
            category.modules.forEach((module : any) => {
              if (module.is_assigned === 1) {
                initialIds[`${category.id}:${module.module_id}`] = true;
              }
            });
          });
          setSelectedIds(initialIds);
          setInitialSelectedIds(initialIds);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error fetching Designation Module:", error.message);
          } else {
            console.error("An unexpected error occurred");
          }
        }
      };
  
      if (designation_id) {
        fetchData();
      }
    }, [designation_id]);
  
    const handleCheckboxClick = (module_id: number, parentId: number) => {
      const pairId = `${parentId}:${module_id}`;
      setSelectedIds((prevIds) => {
        const updatedIds = { ...prevIds };
        updatedIds[pairId] = !updatedIds[pairId]; // Toggle the value
        return updatedIds;
      });
    };
  
    const handleSubmit = async () => {
      try {
        const updatedPermissions = Object.entries(selectedIds)
          .filter(([pairId, isChecked]) => {
            return initialSelectedIds[pairId] !== isChecked; // Compare with initial state
          })
          .map(([pairId, isChecked]) => {
            const [parentId, moduleId] = pairId.split(":").map(Number);
            return {
              designation_id: designation_id,
              school_id: school_id,
              role_id: currentUser?.id,
              module_id: moduleId,
              module_checked: isChecked ? 1 : 0,
            };
          });
  
        if (updatedPermissions.length === 0) {
          console.log("No changes detected.");
          return;
        }
  
        const response = await fetch(
          `${DOMAIN}/${StoreDesignationPermission}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPermissions),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          toast.error("An error occurred!", { autoClose: 3000 });
          throw new Error(`Error ${errorData.status}: ${errorData.error || "Unknown error"}`);
        } else {
          toast.success("Data sent successfully.", { autoClose: 3000 });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error Storing Designation Permissions:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };
  
    return (
      <div
        className="card-style"
        style={{
          width: "100%",
          borderRadius: "16px",
          backgroundColor: "rgb(242, 246, 255)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          marginTop: "20px",
          padding: "20px",
        }}
      >
        <div
          className="card-header"
          style={{
            backgroundColor: "rgb(242, 246, 255)",
            padding: "16px 20px",
            borderBottom: "1px solid #E0E4F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1C335C",
              fontFamily: "Manrope",
            }}
          >
            Assign Modules For {designation_id} 
          </span>
        </div>
  
        <div
          style={{
            height: "600px", // Fixed height for the table container
            overflowY: "auto", // Enable vertical scrolling
            padding: "16px 0", // Optional: adds some padding around the table
          }}
        >
          <table
            className="table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
              backgroundColor: "#FFFFFF", // White background for the table
              borderRadius: "12px", // Round corners for the table
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Light shadow for the table
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "rgb(242, 246, 255)", // Header background color
                  borderBottom: "1px solid #E0E4F0",
                  fontFamily: "Manrope",
                  fontWeight: "600",
                  color: "#1C335C",
                  fontSize: "14px",
                }}
              >
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Module Name
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                  }}
                >
                  Module Feature
                </th>
                <th
                  style={{
                    padding: "12px 20px",
                    textAlign: "right",
                  }}
                >
                  Module Action
                </th>
              </tr>
            </thead>
            <tbody>
              {schoolModules && schoolModules.length > 0 && (
                <>
                  {schoolModules.map((item) => (
                    <React.Fragment key={item.id}>
                      {item.modules.map((module, moduleIndex) => (
                        <tr
                          key={module.module_id}
                          style={{
                            backgroundColor:
                              module.module_id % 2 === 0
                                ? "rgb(242, 246, 255)"
                                : "#FFFFFF",
                            borderBottom: "1px solid #E0E4F0",
                            fontFamily: "Manrope",
                            fontSize: "14px",
                            color: "#1C335C",
                          }}
                        >
                          {moduleIndex === 0 && (
                            <td
                              rowSpan={item.modules.length}
                              style={{
                                padding: "12px 20px",
                              }}
                            >
                              {item.name}
                            </td>
                          )}
                          <td
                            style={{
                              padding: "12px 20px",
                            }}
                          >
                            {module.module_name}
                          </td>
                          <td
                             style={{
                              display: "flex",
                              gap: "10px", // Adds space between the buttons
                              justifyContent: "end", // Aligns buttons horizontally in the center
                              alignItems: "center", // Vertically centers the buttons
                              padding: "12px 20px",
                            }}
                          >
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id={`flexSwitchCheck-${module.module_id}`}
                                onClick={() =>
                                  handleCheckboxClick(module.module_id, item.id)
                                }
                                /* @ts-ignore */
  
                                disabled={
                                  isEditingDisabled ||
                                  designation_id === "0" ||
                                  !designation_id 
                                }
                                checked={
                                  selectedIds[`${item.id}:${module.module_id}`]
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`flexSwitchCheck-${module.module_id}`}
                              ></label>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
          <div
            className="d-flex justify-content-end mt-5"
            style={{
              paddingRight: "30px",
              
            }}
          >
            <button
              className="btn btn-primary"
              style={{
                display: "flex",
                justifyContent: "end",
                backgroundColor: "#1C335C",
                fontFamily:'Manrope'
              }}
              onClick={handleSubmit}
              disabled={isEditingDisabled || !designation_id}
            >
              Submit
            </button>
          </div>
      </div>
    );
};

export { TablesWidget66 };
