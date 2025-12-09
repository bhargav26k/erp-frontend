import { FC, useEffect, useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";

// import { CreateAppModal } from "../../../partials";
// import { CreateStudentFeesModal } from "../../modals/create-app-stepper/CreateStudentFeesModal";
// import { CreateStudentHomeWorkModal } from "../../modals/create-app-stepper/CreateStudentHomeWorkModal";
import { CreateApplyLeaveModal } from "../../modals/create-app-stepper/CreateApplyLeaveModal";
import { useAuth } from "../../../../app/modules/auth";

type Props = {
  className: string;
};

const TablesWidget21: FC<Props> = ({ className }) => {
  const { currentUser } = useAuth();
  
  const [tableData, setTableData] = useState([]);
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [reload,setreload] = useState(false);


  // console.log(tableData);

  function lowercaseExceptFirst(inputString: string | undefined) {
    if (typeof inputString !== "string" || inputString.length === 0) {
      return inputString;
    }
    return (
      inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
    );
  }
  const formattedFirstName = lowercaseExceptFirst(currentUser?.firstname);

  const handleModalClose = () => {
    setShowCreateAppModal(false);
    setreload(true);
  };
  const handlePrimaryButtonClick = () => {
    setShowCreateAppModal(true);
  };
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const session_id = currentUser?.student_session_id;
        // Assuming currentUser contains the session_id
        const response = await fetch(
          "https://erp.innoveraschool.com/site/get_leave_request_details",
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
  }, [currentUser,reload]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  // Get the current page's data
  const currentData = tableData.slice(startIndex, endIndex);

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="d-flex justify-content-between pt-10 p-10">
        <div className="">
          <h3 className="fs-2 text-gray-700">
            <span className="text-success">{formattedFirstName}'s</span>{" "}
            <span> Leave History</span>
          </h3>
        </div>
        <div className="">
          <button
            onClick={handlePrimaryButtonClick}
            className="btn btn-sm btn-primary"
          >
            +Apply Leave
          </button>
        </div>
      </div>
      <CreateApplyLeaveModal
        show={showCreateAppModal}
        handleClose={handleModalClose}
      />
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <div className="position-relative my-1">
            <input
              type="text"
              className="form-control form-control-sm form-control-solid w-350px border border-gray-500"
              name="Search..."
              // value={search}
              // onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </h3>
        <div
          className="card-toolbar"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-trigger="hover"
          title="Click to add a user"
        >
          <a
            href="#"
            className="btn btn-sm btn-icon btn-light-primary me-2"
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName="copy" className="fs-3 " />
          </a>
          <a
            href="#"
            className="btn btn-sm btn-icon btn-light-primary me-2"
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName="file" className="fs-3 " />
          </a>
          <a
            href="#"
            className="btn btn-sm btn-icon btn-light-primary me-2"
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName="file" className="fs-3 " />
          </a>
          <a
            href="#"
            className="btn btn-sm btn-icon btn-light-primary me-2"
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName="file" className="fs-3 " />
          </a>
          <a
            href="#"
            className="btn btn-sm btn-icon btn-light-primary"
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName="file" className="fs-3" />
          </a>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body py-3">
        {/* begin::Table container */}
        <div className="table-responsive">
          {/* begin::Table */}
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            {/* begin::Table head */}
            <thead>
              <tr className="fw-bold text-muted">
                <th className="min-w-30px text-start text-gray-800 ">Sr.no</th>
                <th className="min-w-30px text-start text-gray-800 ">
                  Apply Date
                </th>
                <th className="min-w-30px text-start text-gray-800 ">
                  From Date
                </th>
                <th className="min-w-30px text-start text-gray-800 ">
                  To Date
                </th>
                <th className="min-w-30px text-start text-gray-800 ">Status</th>
                <th className="min-w-30px text-end text-gray-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((rowData, index) => (
              <tr key={index}>
              <td>{startIndex + index + 1}</td>
                  {/* <td>{rowData.apply_date}</td>
                  <td>{rowData.from_date}</td>
                  <td>{rowData.to_date}</td>
                  <td>{rowData.status !== "0" ? "Accepted" : "Pending"}</td> */}

                  <td className="text-end">
                    <a href="#" onClick={handlePrimaryButtonClick}>
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* <CreateStudentFeesModal
              show={showCreateAppModal}
              handleClose={handleModalClose}
            /> */}

            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
      <div className="row justify-content-end my-5">
        <nav aria-label="Page navigation example">
        <ul className="pagination">
            {Array.from(
              { length: Math.ceil(tableData.length / PAGE_SIZE) },
              (_, i) => (
                <li
                  className={`page-item ${
                    i + 1 === currentPage ? "active" : ""
                  }`}
                  key={i}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => handlePageClick(i + 1)}
                  >
                    {i + 1}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export { TablesWidget21 };
