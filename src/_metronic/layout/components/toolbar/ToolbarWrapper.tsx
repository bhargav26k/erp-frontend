import clsx from "clsx";
import { ToolbarType, useLayout } from "../../core";
import { Toolbar } from "./Toolbar";
import { PageTitleWrapper } from "./page-title";
import { useEffect, useState } from "react";
import { KTIcon } from "../../../helpers";

type Props = {
  toggleView: (isChecked: boolean) => void;
};

const ToolbarWrapper = () => {
  const { config, classes } = useLayout();
  if (!config.app?.toolbar?.display) {
    return null;
  }

  const isPageTitleVisible = showPageTitle(
    config.app?.toolbar?.layout,
    config.app?.pageTitle?.display
  );

  // const [isChecked, setIsChecked] = useState(true);
  // useEffect(() => {
  //   toggleView(isChecked);
  // }, [isChecked]);

  // const handleToggle = () => {
  //   setIsChecked(!isChecked);
  // };

  return (
    <div
      id="kt_app_toolbar"
      className={clsx(
        "app-toolbar mb-5",
        classes.toolbar.join(" "),
        config?.app?.toolbar?.class
      )}
      style={{
        height: "100px",
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
        {/* {isPageTitleVisible && <PageTitleWrapper />} */}
        <div>
            {/* <div className="mb-2">
              <span className="fs-2 text-gray-700 fw-bold">Select Criteria</span>
            </div> */}
          <div className="d-flex mb-3 align-middle">
            <div>
            <span className="fs-7 text-gray-700 fw-bold me-3 text-start">Select By:</span>
            </div>
            {/* <div className="me-3">
              <input type="radio" name="class" id="class" />{" "}
              <label className="mx-2">Class</label>
            </div> */}
            {/* <div className="me-3 ">
              <input type="radio" name="class" id="class" />{" "}
              <label className="mx-2">Payment Id</label>
            </div> */}
            {/* <div className="me-3 ">
              <input type="radio" name="class" id="class" />{" "}
              <label className="mx-2">Fee Group</label>
            </div> */}
            {/* <div>
              <input
                type="text"
                className="form-control form-control-sm form-control-solid w-200px ps-10 border border-black"
                name="Search Team"
                // value={search}
                // onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Team"
              />
            </div> */}
          </div>

          <div className="d-flex align-items-center">
            {/* begin::Input group */}
            <div className="me-3  rounded ">
              {/* begin::Select */}
              <select
                className="form-select form-select-sm form-select-solid border border-black"
                data-control="select2"
                data-placeholder="Latest"
                data-hide-search="true"
                // value={'0'}
                // onChange={(e) => setProgress(e.target.value)}
              >
                <option value="0">All Classes</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
              {/* end::Select */}
            </div>
            {/* end::Input group- */}

            {/* begin::Input group- */}
            <div className="m-0  rounded">
              {/* begin::Select */}
              <select
                className="form-select form-select-sm form-select-solid w-md-125px border border-black"
                data-control="select2"
                data-placeholder="Filters"
                data-hide-search="true"
                // value={"1"}
                // onChange={(e) => setFilter(e.target.value)}
              >
                <option value="0">All Sections</option>
                <option value="1">Section A</option>
                <option value="2">Section B</option>
                <option value="3">Section C</option>
              </select>
              {/* end::Content */}
            </div>
            {/* end::Input group- */}
          </div>
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
        <Toolbar />
      </div>
    </div>
  );
};

const showPageTitle = (
  appToolbarLayout?: ToolbarType,
  appPageTitleDisplay?: boolean
): boolean => {
  const viewsWithPageTitles = ["classic", "reports", "saas"];
  if (!appToolbarLayout || !appPageTitleDisplay) {
    return false;
  }

  return (
    appPageTitleDisplay &&
    viewsWithPageTitles.some((t) => t === appToolbarLayout)
  );
};

export { ToolbarWrapper };
