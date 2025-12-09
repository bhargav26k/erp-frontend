import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Module = {
  id: number;
  module_name: string;
  // Add more fields as per your module structure
};

type SchoolModule = {
  id: number;
  name: string;
  modules: Module[];
};

type Props = {
  className: string;
  school_id?: number;
};

const TablesWidget27: React.FC<Props> = ({ className, school_id }) => {
  const { auth } = useAuth();
  const [schoolModules, setSchoolModules] = useState<SchoolModule[]>([]);
  const [selectedIds, setSelectedIds] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${DOMAIN}/api/superadmin/permission-modules`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: SchoolModule[] = await response.json();
        setSchoolModules(data);
      } catch (error) {
        console.error("Error fetching school modules:", error);
      }
    };

    fetchData();
  }, [school_id]);

  const handleSubmit = async () => {
    try {
      const response = {
        school_id: school_id,
        super_admin_id: auth?.id,
        permissions: permissions,
      };

      const sendData = await fetch(`${DOMAIN}/api/superadmin/store-permission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(response), // Convert response object to JSON string
      });

      if (!sendData.ok) {
        console.log('Error occurred while sending data.');
        // Handle error scenario
      } else {
        console.log('Data sent successfully.');
        // Handle success scenario
      }

    } catch (err) {
      console.error('Error while sending data:', err);
      // Handle error
    }
  };

  const handleCheckboxClick = (module_id: number, parentId: number) => {
    const pairId = `${parentId}:${module_id}`;

    setSelectedIds(prevIds => {
      if (prevIds[pairId]) {
        const updatedIds = { ...prevIds };
        delete updatedIds[pairId];
        return updatedIds;
      } else {
        return {
          ...prevIds,
          [pairId]: true,
        };
      }
    });
  };

  const permissions = Object.entries(selectedIds).map(([pairId]) => {
    const [parentId, moduleId] = pairId.split(':').map(Number);
    return [parentId, moduleId];
  });

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">School Module</span>
        </h3>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-5">
            <thead>
              <tr style={{ borderBottom: '1px solid black' }}>
                <th className="p-0 w-100px">Module Name</th>
                <th className="p-0 min-w-100px">Module Feature</th>
                <th className="p-0 min-w-50px">Module Action</th>
              </tr>
            </thead>
            <tbody style={{ width: "100%" }}>
              {schoolModules && schoolModules.length > 0 && (
                <>
                  {schoolModules.map((item, index) => (
                    item.modules.map((module, moduleIndex) => (
                      <tr key={module.id} style={{ width: '100%' }}>
                        {/* Module Name */}
                        {moduleIndex === 0 && (
                          <td
                            rowSpan={item.modules.length}
                            className="py-2 px-4 w-100px"
                            style={{ borderBottom: '1px solid black', textAlign: 'start', justifyContent: 'flex-start' }}
                          >
                            <span style={{ fontFamily: 'Manrope', fontSize: '14px', fontWeight: '500' }}>
                              {item.name} {/* Only render once */}
                            </span>
                          </td>
                        )}
                        <td className="p-3 m-6 min-w-100px" style={{ paddingLeft: "0px" }}>
                          <span style={{ fontFamily: 'Manrope', fontSize: '12px', fontWeight: '500' }}>{module.module_name}</span>
                        </td>
                        {/* Action */}
                        <td className="py-2 px-4">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id={`flexSwitchCheck-${module.id}`}
                              onClick={() => handleCheckboxClick(module.id, item.id)}
                              disabled={school_id === 0 || !school_id}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`flexSwitchCheck-${module.id}`}
                            ></label>
                          </div>
                        </td>
                      </tr>
                    ))
                  ))}
                </>
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-end" style={{ paddingRight: '30px' }}>
            <button
              className="btn btn-primary"
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
              onClick={handleSubmit}
              disabled={school_id === 0 || !school_id || permissions.length === 0}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget27 };
