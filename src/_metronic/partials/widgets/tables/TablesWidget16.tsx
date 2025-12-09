import { FC, SetStateAction, useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { useLayout } from "../../../layout/core";
import { CreateRoleModal } from "../../../partials/modals/create-app-stepper/CreateRoleModal";
import { CreateAssignPermissionModal } from "../../modals/create-app-stepper/CreateAssignPermissionModal";

type Props = {
  className: string;
};

const TablesWidget16: FC<Props> = ({ className }) => {
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const { config, classes } = useLayout();
  const [selectedDate, setSelectedDate] = useState(new Date());
  if (!config.app?.toolbar?.display) {
    return null;
  }
  const handlePrimaryButtonClick = () => {
    setShowCreateAppModal(true);
  };
  const handleModalClose = () => {
    setShowCreateAppModal(false);
  };
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="d-flex justify-content-between">
        <div className="pt-10 ps-10">
          <h3 className="fs-2 text-gray-700">Role List</h3>
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
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            {/* begin::Table head */}
            <thead>
              <tr className="fw-bold text-muted">
                <th className="max-w-60px   ">Role</th>
                <th className="min-w-50 ">Type</th>
                <th className="min-w-150px text-end text-gray-800">Action</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <div className="d-flex align-items-center ms-2">Admin</div>
                </td>
                <td>
                  <div className="d-flex align-items-start ">System</div>
                </td>
                <td>
                  <div className="d-flex justify-content-end ">
                    <div className="form-check form-switch custom-switch">
                    {config.app?.toolbar?.primaryButton && (
                      <a
                        href="#"
                        onClick={handlePrimaryButtonClick}
                        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                      >
                        <KTIcon
                          iconName="switch"
                          className="fs-3 text-gray-900"
                        />
                      </a>
                       )}
                      <a
                        href="#"
                        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                      >
                        <KTIcon
                          iconName="pencil"
                          className="fs-3 text-gray-900"
                        />
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <CreateAssignPermissionModal
            show={showCreateAppModal}
            handleClose={handleModalClose}
            selectDate={handleDateChange}
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

export { TablesWidget16 };
