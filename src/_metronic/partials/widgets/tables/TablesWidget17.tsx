import { FC, useEffect, useState } from "react";
import { KTIcon  } from "../../../helpers";
import { useAuth } from "../../../../app/modules/auth";
// import { CreateAppModal } from "../../../partials";
import { CreateStudentFeesModal } from "../../modals/create-app-stepper/CreateStudentFeesModal";

type Props = {
  className: string;
};

interface RowData {
  last_due_date: string;
  payment_status: string;
  total_installment_without_fine_discount:string;
  discount_value:string;
  final_discount_value:string;
  total_installment_amount_with_fine_discount:string;
  payment_link:string;


  // Add other properties as needed
}


const TablesWidget17: FC<Props> = ({ className }) => {
  const { currentUser } = useAuth();
  const [tableData, setTableData] = useState<RowData[]>([]);
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);

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
  };
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
      {/* begin::Header */}
      <div className="pt-10 ps-10">
        <h3 className="fs-2 text-gray-700">
          <span className="text-success">{formattedFirstName}'s</span>{" "}
          <span> Fees History</span>
        </h3>
      </div>
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
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Sr.no
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Due Date
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Due Date
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Status
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Amount
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Fee Rebate
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Fee Rebate
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Total Amount
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Paid Amount
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Balance Amount
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  Payment Due
                </th>
                <th className="min-w-30px text-end text-gray-800 text-center">
                  View Installments Details
                </th>

                <th className="min-w-30px text-end text-gray-800">Action</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {tableData.map((rowData, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{rowData.last_due_date}</td>  
                  <td>{rowData.last_due_date}</td>
                  <td>{rowData.payment_status}</td>
                  <td>
                    {rowData.total_installment_without_fine_discount ?? "0"}
                  </td>
                  <td>{"0"}</td>
                  <td>
                    {rowData.discount_value +
                      "% Off " +
                      "Rs." +
                      rowData.final_discount_value}
                  </td>
                  <td>
                    {rowData.total_installment_amount_with_fine_discount ?? "0"}
                  </td>
                  <td>
                    {rowData.payment_status !== "unpaid"
                      ? rowData.total_installment_amount_with_fine_discount
                      : "0"}
                  </td>
                  <td>
                    {rowData.total_installment_amount_with_fine_discount ?? "0"}
                  </td>
                  <td>
                    {rowData.payment_status !== "unpaid"
                      ? rowData.total_installment_amount_with_fine_discount
                      : "Not yet Paid"}
                  </td>
                  <td>
                    {/* Add a link/button to view installment details */}
                    <a
                      href="#"
                      onClick={handlePrimaryButtonClick}
                    >
                      View Details
                    </a>
                  </td>
                  <td>
                    {/* Add a link/button for actions */}
                    <a
                      href={rowData.payment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pay Now
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
              <CreateStudentFeesModal
                show={showCreateAppModal}
                handleClose={handleModalClose}
                
              />
              
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
            <li className="page-item">
              <a className="page-link" href="#">
                Previous
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export { TablesWidget17 };
