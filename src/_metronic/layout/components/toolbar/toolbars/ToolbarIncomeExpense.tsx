import clsx from "clsx";
import { useState } from "react";
import { KTIcon } from "../../../../helpers";
import { CreateAppModal, Dropdown5 } from "../../../../partials";
import { useLayout } from "../../../core";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type Props = {
  toggleView: (isChecked: boolean) => void;
};

const ToolbarIncomeExpense = () => {
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
  const handleClick = () => {
    navigate("/lead-generation");
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleModalClose = () => {
    setShowCreateAppModal(false);
  };

  // const [isChecked, setIsChecked] = useState(true);
  // useEffect(() => {
  //   toggleView(isChecked);
  // }, [isChecked]);

  // const handleToggle = () => {
  //   setIsChecked(!isChecked);
  // };

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
        height: "50px",
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
            "justify-content-between": true,
            "align-items-start": true,
            "p-0": true,
            "m-0": true,
          }
        )}
      >
        <div>

        </div>
        {/* hello  */}
        {/* <div>
          <div className="d-flex justify-center mt-3">
            {!isChecked && (
              <label className="form-check-label me-2" htmlFor="toggleLeft">
                List View
              </label>
            )}
            <div className="form-check form-switch custom-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="toggleLeft"
                checked={isChecked}
                onChange={handleToggle}
              />
              <label className="form-check-label ms-2" htmlFor="toggleLeft">
                {isChecked ? "Chart View" : ""}
              </label>
            </div>
          </div>
        </div> */}
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <div className="d-flex align-items-center flex-shrink-0">
            {/* begin::Label */}
            <span className="fs-7 fw-bold text-gray-700 flex-shrink-0 pe-4 d-none d-md-block">
              Filter By:
            </span>
            {/* end::Label */}

            <div className="flex-shrink-0">
              <ul className="nav">
                <li className="nav-item rounded">
                  <a
                    className="nav-link btn btn-sm btn-color-muted btn-active-color-primary btn-active-light active fw-semibold fs-7 px-4 me-1"
                    data-bs-toggle="tab"
                    href="#"
                    onClick={handleClick}
                  >
                    3M
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link btn btn-sm btn-color-muted btn-active-color-primary btn-active-light fw-semibold fs-7 px-4 me-1"
                    data-bs-toggle="tab"
                    href=""
                  >
                    6M
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link btn btn-sm btn-color-muted btn-active-color-primary btn-active-light fw-semibold fs-7 px-4"
                    data-bs-toggle="tab"
                    href="#"
                  >
                    YTD
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="bullet bg-secondary h-35px w-1px mx-5"></div>

          {config.app?.toolbar?.primaryButton && (
            <a
              href="#"
              onClick={handlePrimaryButtonClick}
              className="btn btn-sm fw-bold btn-primary"
            >
              {selectedDate.toLocaleDateString()}{" "}
              <KTIcon iconName="calendar-8" className="fs-1 ms-2 me-0" />
            </a>
          )}
          <CreateAppModal
            show={showCreateAppModal}
            handleClose={handleModalClose}
            selectDate={handleDateChange}
          />
          {config.app?.toolbar?.filterButton && (
            <div className="m-0">
              <a
                href="#"
                className={clsx("btn btn-sm  fw-bold", settingsButtonClass)}
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
              >
                <KTIcon iconName="setting" className="fs-1" />
              </a>
              <Dropdown5 />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ToolbarIncomeExpense };
