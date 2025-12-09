import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

interface Student {
  id: number;
  admission_no: string;
  firstname: string;
  middlename: string;
  lastname: string;
  father_name: string;
  father_phone: string;
  admission_date: string;
}

interface Props {
  refresh: any; // Adjust type as per actual requirement
  csvData: (data: any) => void; // Adjust type as per actual requirement
}

const TablesWidget31: React.FC<Props> = ({ refresh, csvData }) => {
  const { currentUser } = useAuth();
  const [schoolModules, setSchoolModules] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const school_id = currentUser?.school_id || 0; // Ensure school_id has a default value

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-student/${school_id}`
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

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = schoolModules.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(schoolModules.length / rowsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
                  Student Id
                </th>
                <th className="p-0 min-w-100px" style={{ fontWeight: "bold" }}>
                  Student Name
                </th>
                <th className="p-0 min-w-50px" style={{ fontWeight: "bold" }}>
                  Father Name
                </th>
                <th className="p-0 min-w-50px" style={{ fontWeight: "bold" }}>
                  Father Number
                </th>
                <th className="p-0 min-w-50px" style={{ fontWeight: "bold" }}>
                  Admission date
                </th>
                <th className="p-0 min-w-50px" style={{ fontWeight: "bold" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((student) => (
                <tr key={student.id}>
                  <td className="p-0 w-150px">{student.admission_no}</td>
                  <td className="p-0 w-150px">
                    {student.firstname} {student.middlename} {student.lastname}
                  </td>
                  <td className="p-0 w-150px">{student.father_name}</td>
                  <td className="p-0 w-150px">{student.father_phone}</td>
                  <td className="p-0 w-150px">{student.admission_date}</td>
                  <td className="p-0 w-150px">Action button</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span className="mx-2">{currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget31 };
