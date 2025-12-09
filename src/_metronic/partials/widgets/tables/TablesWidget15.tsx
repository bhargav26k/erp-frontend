import { FC, SetStateAction, useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";

type Props = {
  className: string;
};

const TablesWidget15: FC<Props> = ({ className }) => {
  const [activeTab, setActiveTab] = useState("Students");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTable = () => {
    switch (activeTab) {
      case "Students":
        return <StudentsTable />;
      case "Parents":
        return <ParentsTable />;
      case "Staff":
        return <StaffTable />;
      default:
        return null;
    }
  };

  const StudentsTable = () => {
    return (
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        {/* begin::Table head */}
        <thead>
          <tr className="fw-bold text-muted">
            <th className="max-w-60px   ">Adminssion No</th>
            <th className="min-w-50  0px">Student Name</th>
            <th className="min-w-50  0px">Username</th>
            <th className="min-w-50  0px">Class</th>
            <th className="min-w-50  0px">Father name</th>
            <th className="min-w-50  0px">Mobile Number</th>
            <th className="min-w-150px text-end text-gray-800">Action</th>
          </tr>
        </thead>
        {/* end::Table head */}
        {/* begin::Table body */}
        <tbody>
          <tr>
            <td>
              <div className="d-flex align-items-center ms-2">V0</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">PRIYANSH POLE</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">std1395</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">
                MI Vadodra Mi School(MI Junior KG)
              </div>
            </td>
            <td>
              <div className="d-flex align-items-start ">YOGEN</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">7990478263</div>
            </td>

            <td>
              <div className="d-flex justify-content-end ">
                <div className="form-check form-switch custom-switch">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    role="switch"
                    id="toggleLeft"
                    // checked={isChecked}
                    // onChange={handleToggle}
                    style={{ transition: "transform 0.3s ease-in-out" }}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        {/* end::Table body */}
      </table>
    );
  };

  const ParentsTable = () => {
    return (
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        {/* begin::Table head */}
        <thead>
          <tr className="fw-bold text-muted">
            <th className="max-w-60px">Guardian Name</th>
            <th className="min-w-50  0px">Guardian Phone</th>
            <th className="min-w-50  0px">Username</th>
            <th className="min-w-150px text-end text-gray-800">Action</th>
          </tr>
        </thead>
        {/* end::Table head */}
        {/* begin::Table body */}
        <tbody>
          <tr>
            <td>
              <div className="d-flex align-items-start ">Girish</div>
            </td>
            
            <td>
              <div className="d-flex align-items-start ">9921704477</div>
            </td>
           
            <td>
              <div className="d-flex align-items-start ">	parent52</div>
            </td>

            <td>
              <div className="d-flex justify-content-end ">
                <div className="form-check form-switch custom-switch">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    role="switch"
                    id="toggleLeft"
                    // checked={isChecked}
                    // onChange={handleToggle}
                    style={{ transition: "transform 0.3s ease-in-out" }}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        {/* end::Table body */}
      </table>
    );
  };

  const StaffTable = () => {
    return (
      <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
        {/* begin::Table head */}
        <thead>
          <tr className="fw-bold text-muted">
            <th className="max-w-60px">Staff id</th>
            <th className="min-w-50  0px">Name</th>
            <th className="min-w-50  0px">Email</th>
            <th className="min-w-50  0px">Role</th>
            <th className="min-w-50  0px">Designation</th>
            <th className="min-w-50  0px">Department  </th>
            <th className="min-w-50  0px">Phone</th>
            <th className="min-w-150px text-end text-gray-800">Action</th>
          </tr>
        </thead>
        {/* end::Table head */}
        {/* begin::Table body */}
        <tbody>
          <tr>
            <td>
              <div className="d-flex align-items-center ms-2">E121</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">DEEPALI</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">deepali.jadhav@innoveraschool.com</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">
              Teacher
              </div>
            </td>
            <td>
              <div className="d-flex align-items-start ">Teacher</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">SCIENCE/EVS</div>
            </td>
            <td>
              <div className="d-flex align-items-start ">7990478263</div>
            </td>

            <td>
              <div className="d-flex justify-content-end ">
                <div className="form-check form-switch custom-switch">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    role="switch"
                    id="toggleLeft"
                    // checked={isChecked}
                    // onChange={handleToggle}
                    style={{ transition: "transform 0.3s ease-in-out" }}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        {/* end::Table body */}
      </table>
    );
  };

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="d-flex justify-content-between">
        <div className="pt-10 ps-10">
          <h3 className="fs-2 text-gray-700">Users</h3>
        </div>
        <div className="pt-10 pe-10 d-flex">
          <a
            className={`btn btn-ghost fs-5 text-gray-700 me-2  ${activeTab === 'link-underline-primary' ? 'active' : ''}`}

            onClick={() => handleTabClick("Students")}
          >
            Students
          </a>
          <button
            className={`btn btn-ghost fs-5 text-gray-700 me-2 ${activeTab === 'Parents' ? 'active' : ''}`}
            onClick={() => handleTabClick("Parents")}
          >
            Parents
          </button>
          <button
            className={`btn btn-ghost fs-5 text-gray-700 ${activeTab === 'Staff' ? 'active' : ''}`}
            onClick={() => handleTabClick("Staff")}
          >
            Staff
          </button>
        </div>
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
          {renderTable()}
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

export { TablesWidget15 };
