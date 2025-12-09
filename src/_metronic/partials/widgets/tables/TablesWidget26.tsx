import React, { useState, useEffect } from "react";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type SchoolDetail = {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  password: string;
  // Add more fields as per your API response
};

type Props = {
  className: string;
  school_id?: number | null;
};

const TablesWidget26: React.FC<Props> = ({ className, school_id }) => {
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetail[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/superadmin/get_admin/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: SchoolDetail[] = await response.json();
        setSchoolDetails(data);
      } catch (error) {
        console.error("Error fetching school details:", error);
      }
    };

    if (school_id) {
      fetchData();
    } else {
      setSchoolDetails([]);
    }
  }, [school_id]);

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">School Admin</span>
        </h3>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-5">
            <thead>
              <tr style={{ borderBottom: "1px solid black" }}>
                <th className="p-0 w-50px">Id</th>
                <th className="p-0 min-w-100px">Name</th>
                <th className="p-0 min-w-100px">Email</th>
                <th className="p-0 min-w-100px">Contact No.</th>
                <th className="p-0 min-w-40px">Password</th>
              </tr>
            </thead>
            <tbody>
              {school_id ? (
                schoolDetails.length > 0 ? (
                  schoolDetails.map((schoolDetail, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{schoolDetail.name}</td>
                      <td>{schoolDetail.email}</td>
                      <td>{schoolDetail.contact_no || "-"}</td>
                      <td>{schoolDetail.password}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                     /* @ts-ignore */
                     colSpan="5">
                      <div className="alert alert-warning" role="alert">
                        No schools found.
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td
                  /* @ts-ignore */
                   colSpan="5">No schools selected</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget26 };
