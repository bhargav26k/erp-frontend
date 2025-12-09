import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

interface Staff {
  id: number;
  employee_id: string;
  name: string;
  surname: string;
  role_name: string;
  email: string;
  contact_no: string;
}

interface Props {
  refresh: any; // Adjust type as per actual requirement
  csvData: (data: any) => void; // Adjust type as per actual requirement
}

const TablesWidget30: React.FC<Props> = ({ refresh, csvData }) => {
  const { currentUser } = useAuth();
  const [schoolModules, setSchoolModules] = useState<Staff[]>([]);
  const school_id = currentUser?.school_id || 0; // Ensure school_id has a default value

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-staff/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSchoolModules(data);
      } catch (error) {
        console.error("Error fetching school details:", error);
      }
    };

    fetchData();
  }, [school_id, refresh]);

  useEffect(() => {
    if (schoolModules.length > 0) {
      csvData(schoolModules);
    }
  }, [schoolModules, csvData]);

  return (
    <div className={`card`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">School Module</span>
        </h3>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-5">
            <thead>
              <tr>
                <th className="p-0 w-150px" style={{ fontWeight: "bold" }}>
                  Staff Id
                </th>
                <th className="p-0 min-w-100px" style={{ fontWeight: "bold" }}>
                  Staff Name
                </th>
                <th className="p-0 min-w-50px" style={{ fontWeight: "bold" }}>
                  Role
                </th>
                <th className="p-0 min-w-50px" style={{ fontWeight: "bold" }}>
                  Email
                </th>
                <th className="p-0 min-w-50px" style={{ fontWeight: "bold" }}>
                  Phone
                </th>
                <th className="p-0 min-w-50px" style={{ fontWeight: "bold" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {schoolModules.map((staff) => (
                <tr key={staff.id}>
                  <td className="p-0 w-150px">{staff.employee_id}</td>
                  <td className="p-0 w-150px">
                    {staff.name} {staff.surname}
                  </td>
                  <td className="p-0 w-150px">{staff.role_name}</td>
                  <td className="p-0 w-150px">{staff.email}</td>
                  <td className="p-0 w-150px">{staff.contact_no}</td>
                  <td className="p-0 w-150px">Action button</td>{" "}
                  {/* You can replace this with your action button */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget30 };
