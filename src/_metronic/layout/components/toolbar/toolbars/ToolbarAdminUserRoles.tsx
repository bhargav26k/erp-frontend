import clsx from "clsx";
import { useState } from "react";
import { KTIcon } from "../../../../helpers";
import { CreateAppModal, Dropdown4 } from "../../../../partials";
import { useLayout } from "../../../core";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CreateRoleModal } from "../../../../partials/modals/create-app-stepper/CreateRoleModal";

type Props = {
  toggleView: (isChecked: boolean) => void;
};

const ToolbarAdminUserRoles = () => {
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { config, classes } = useLayout();
  if (!config.app?.toolbar?.display) {
    return null;
  }

  const handlePrimaryButtonClick = () => {
    setShowCreateAppModal(true);
  };
//   const handleClick = () => {
//     navigate("/lead-generation");
//   };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleModalClose = () => {
    setShowCreateAppModal(false);
  };

  const settingsButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";

  return (
    <div
      id="kt_app_toolbar"
      className={clsx(
        "app-toolbar mb-5",
        // classes.toolbar.join(" "),
        config?.app?.toolbar?.class
      )}
      style={{
        height: "30px",
        // border: "1px solid black",
        alignItems: "baseline",
      }}
    >
      <div
        id="kt_app_toolbar_container"
        className={clsx(
          "app-container",
          classes.toolbarContainer.join(" "),
          config.app?.toolbar?.containerClass,
          config.app?.toolbar?.minimize?.enabled ? "app-toolbar-minimize" : "",

          {
            "container-fluid": config.app?.toolbar?.container === "fluid",
            "container-xxl": config.app?.toolbar?.container === "fixed",
            "d-flex": true,
            "justify-content-end": true,
            "align-items-start": true,
            "p-0": true,
            "m-0": true,
          }
        )}
      >
        
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <div className="bullet bg-secondary h-35px w-1px mx-5"></div>

          {config.app?.toolbar?.primaryButton && (
            <a
              href="#"
              onClick={handlePrimaryButtonClick}
              className="btn btn-sm fw-bold btn-primary d-flex align-items-center"
            >
              <KTIcon iconName="user" className="fs-1 ms-2 me-0" />
             + Add Role 
            </a>
          )}
          <CreateRoleModal
            show={showCreateAppModal}
            handleClose={handleModalClose}
            selectDate={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export { ToolbarAdminUserRoles };
