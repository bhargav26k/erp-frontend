import { FC, useEffect, useState } from "react";
// import { FC} from "react";
// import { FC, useEffect} from "react";
// import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { useAuth } from "../../../../app/modules/auth";
// import { CreateAppModal } from "../../../partials";
import { CreateStudentFeesModal } from "../../modals/create-app-stepper/CreateStudentFeesModal";

import React from 'react';

type Props = {
  className: string;
};

const TablesWidget18: FC<Props> = ({ className }) => {
  const { currentUser } = useAuth();
  const [tableData, setTableData] = useState([]);
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);

  function lowercaseExceptFirst(inputString: string | undefined) {
    if (typeof inputString !== "string" || inputString.length === 0) {
      return inputString;
    }
    return (
      inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formattedFirstName = lowercaseExceptFirst(currentUser?.firstname);

  const handleModalClose = () => {
    setShowCreateAppModal(false);
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars
  const handlePrimaryButtonClick = () => {
    setShowCreateAppModal(true);
  };

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const session_id = currentUser?.student_session_id;
        // Assuming currentUser contains the session_id
        const response = await fetch(
          "https://erp.innoveraschool.com/site/student_fees",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any other necessary headers
            },
            body: JSON.stringify({ student_session_id: session_id }),
          }
        );

        const data = await response.json();

        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [currentUser]);

  return (
    <div className={`card ${className}`}>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted">
                <th className="min-w-30px text-start text-gray-800 text-center">
                  Sr.no
                </th>
                <th className="min-w-30px text-start text-gray-800 ">
                  Term Name
                </th>
                <th className="min-w-30px text-start text-gray-800">
                  Term Amount
                </th>
                <th className="min-w-30px text-start text-gray-800">
                  Due Date
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Administrative Charges
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, index) => (
                <React.Fragment key={index}>
                  {/* {rowData.term_fees_details.map((termDetail, termIndex) => (
                    <tr key={`term-${index}-${termIndex}`}>
                      <td>{index + 1}</td>
                      <td>{termDetail.type_name}</td>
                      <td>{termDetail.type_amount}</td>
                      <td>
                        {rowData.last_due_date === "NA"
                          ? "N/A"
                          : termDetail.term_due_date}
                      </td>
                      <td className="text-center">{"0"}</td>
                    </tr>
                  ))} */}
                </React.Fragment>
              ))}
            </tbody>
            <CreateStudentFeesModal
              show={showCreateAppModal}
              handleClose={handleModalClose}
            />
          </table>
        </div>
      </div>
    </div>
  );
};

export { TablesWidget18 };
