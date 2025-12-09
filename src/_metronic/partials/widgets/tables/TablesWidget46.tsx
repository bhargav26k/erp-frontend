import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";


interface Role {
  role_id: number;
  role_name: string;
  is_active: number | null;
  checked: number;
}

interface Props {
  school_id?: number;
}

const TablesWidget46: React.FC<Props> = ({ school_id }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1); // Equivalent to history.goBack()
  };

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedIds, setSelectedIds] = useState<{ [key: string]: boolean }>({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/superadmin/get-school/roles-by-id/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const rolesData: Role[] = await response.json();
        setRoles(rolesData);

        // Initialize selectedIds based on fetched data
        const initialSelectedIds: { [key: string]: boolean } = {};
        rolesData.forEach((role) => {
          if (role.checked === 1) {
            initialSelectedIds[`role:${role.role_id}`] = true;
          }
        });
        setSelectedIds(initialSelectedIds);
      } catch (error) {
        console.error("Error fetching school details:", error);
      }
    };

    if (school_id) {
      fetchData();
    }
  }, [school_id,refresh]);

  const handleCheckboxClick = (id: string) => {
    setSelectedIds((prevIds) => {
      const updatedIds = { ...prevIds };
      updatedIds[id] = !updatedIds[id]; // Toggle the checkbox state
      return updatedIds;
    });
  };

  const handleSubmit = async () => {
    try {
      const updatedPermissions = Object.entries(selectedIds)
        .map(([pairId, isChecked]) => {
          const [type, id] = pairId.split(":");
          if (type === "role") {
            const originalRole = roles.find(role => role.role_id === Number(id));
            if (originalRole) {
              const hasChanged = (originalRole.checked === 1) !== isChecked;
              if (hasChanged) {
                return {
                  school_id: school_id,
                  super_admin_id: auth?.id,
                  role_id: Number(id),
                  is_active: isChecked ? 1 : 0,
                };
              }
            }
          }
          return null;
        })
        .filter(permission => permission !== null);

      if (updatedPermissions.length === 0) {
        console.log("No changes detected.");
        return;
      }


      const response = await fetch(
        `${DOMAIN}/api/superadmin/store-roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPermissions),
        }
      );

      if (!response.ok) {
        console.log("Error occurred while sending data.");
        toast.error("An error occurred!", { autoClose: 3000 });
      } else {
        toast.success("Data sent successfully.", { autoClose: 3000 });
        setRefresh(true);
        console.log("Data sent successfully.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to communicate with server!", { autoClose: 3000 });
    }
  };

  return (
    <div>
      <div onClick={handleClick} style={{ padding: "10px", cursor: "pointer" }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 12C22 13.9778 21.4135 15.9112 20.3147 17.5557C19.2159 19.2002 17.6541 20.4819 15.8268 21.2388C13.9996 21.9957 11.9889 22.1937 10.0491 21.8079C8.10929 21.422 6.32746 20.4696 4.92893 19.0711C3.53041 17.6725 2.578 15.8907 2.19215 13.9509C1.80629 12.0111 2.00433 10.0004 2.7612 8.17317C3.51808 6.3459 4.79981 4.78412 6.4443 3.6853C8.08879 2.58649 10.0222 2 12 2"
            stroke="#1C274C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M15 12L9 12M9 12L12 9M9 12L12 15"
            stroke="#1C274C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14.5 2.31494C18.014 3.21939 20.7805 5.98588 21.685 9.4999"
            stroke="#1C274C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        style={{
          backgroundColor: "#F2F6FF",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-5">
            <thead>
              <tr style={{ borderBottom: "1px solid lightgray" }}>
                <th
                  className="p-0 w-100px"
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Roles Name
                </th>
                <th
                  className="p-0 min-w-50px "
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Is Active
                </th>
                <th
                  className="p-0 min-w-50px "
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.role_id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td className="py-2 px-4 w-100px" style={{ textAlign: "start", justifyContent: "flex-start", borderBottom: "none" }}>
                    <span style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: "500" }}>{role.role_name}</span>
                  </td>
                  <td className="p-3 m-6 min-w-100px" style={{ paddingLeft: "0px" }}>
                    {role.is_active !== null ? (
                      <span
                        style={{
                          fontFamily: "Manrope",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {role.is_active ? "Active" : "Inactive"}
                      </span>
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`flexSwitchCheck-role-${role.role_id}`}
                        onChange={() => handleCheckboxClick(`role:${role.role_id}`)}
                        checked={selectedIds[`role:${role.role_id}`] || false}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`flexSwitchCheck-role-${role.role_id}`}
                      ></label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className="d-flex justify-content-end"
            style={{
              paddingRight: "30px",
            }}
          >
            <button
              className="btn btn-primary"
              style={{
                display: "flex",
                justifyContent: "end",
              }}
              onClick={handleSubmit}
              disabled={school_id === 0 || !school_id}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget46 };
