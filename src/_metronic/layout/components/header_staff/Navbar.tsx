import clsx from "clsx";
import {
  HeaderSettings,
  HeaderUserMenu,
  HeaderViewMenu,
} from "../../../partials";
import { useLayout } from "../../core";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { HeaderSchoolChange } from "../../../partials/layout/header-menus/HeaderSchoolChange";
import { HeaderSessionChange } from "../../../partials/layout/header-menus/HeaderSessionChange";

const itemClass = "ms-1 ms-md-4";

type Props = {
  toggleView?: (isChecked: string) => void; // Make toggleView optional
};

const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

const Navbar = ({ toggleView = () => {} }: Props) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role;
  const masterRole = currentUser?.role_name;
  const multipleSchools = currentUser?.multiple_schools;
  const isMobile = useMobile();
  const location = useLocation();
  const { config } = useLayout();
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("chart");
  const [schoolName, setSchoolName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState(0);
  const pathname = location.pathname;
  const pathParts = pathname.split("/").filter((part) => part !== "");
  const handleToggle = (newOption: string) => {
    setSelectedOption(newOption);
    toggleView(newOption);
  };

  const handleButtonClick = () => {
    setIsClicked(!isClicked);
  };

  const handleClickOutside = (event: React.MouseEvent | MouseEvent) => {
    if (
      buttonRef.current &&
      event.target &&
      "contains" in buttonRef.current &&
      !(buttonRef.current as HTMLElement).contains(event.target as Node)
    ) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="app-navbar flex-shrink-0"
      style={{
        width: "max-content",
        justifyContent: "end",
        alignItems: "center",
      }}
    >
      {!isMobile && (
        <div className="mt-5">
          <h1
            style={{
              fontFamily: "Manrope",
              fontSize: "16px",
              fontWeight: "400",
            }}
          >
            Welcome back!{" "}
            <span style={{ fontWeight: "600" }}>
              {currentUser?.designation}
            </span>{" "}
          </h1>
        </div>
      )}
      {isMobile && (
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 0,
            backgroundColor: "lightgray", // green
            color: "#2C3E50",
            padding: "4px 8px",
            borderRadius: "12px 0px 0px 12px",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 600,
            fontSize: "10px",
            whiteSpace: "nowrap",
            zIndex: 9,
          }}
        >
          {currentUser?.designation}
        </div>
      )}
      {userRole === "staff" || userRole === "admin" ? (
        pathParts.toString() === "" || pathParts.toString() === "user-roles" ? (
          <>
            <div className={clsx("app-navbar-item", itemClass)}>
              <div
                ref={buttonRef}
                className={clsx(
                  "cursor-pointer symbol d-flex flex-row h-36px  btn btn-active-light"
                )}
                data-kt-menu-trigger="{default: 'click'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
                style={{
                  // background: "#F3F3F3",
                  width: "64px",
                  gap: "10px",
                  padding: "8px 10px 8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #1C274C",
                }}
                onClick={handleButtonClick}
              >
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="10.1666"
                      cy="10"
                      r="2.5"
                      stroke="#1C274C"
                      stroke-width="1.5"
                    />
                    <path
                      d="M11.6378 1.79352C11.3315 1.66666 10.9432 1.66666 10.1667 1.66666C9.39009 1.66666 9.0018 1.66666 8.69552 1.79352C8.28714 1.96268 7.96268 2.28714 7.79352 2.69552C7.71631 2.88194 7.68609 3.09874 7.67426 3.41498C7.65688 3.87972 7.41855 4.3099 7.01579 4.54243C6.61303 4.77496 6.12132 4.76627 5.71016 4.54896C5.43037 4.40107 5.2275 4.31884 5.02745 4.2925C4.5892 4.23481 4.14598 4.35357 3.7953 4.62266C3.53229 4.82447 3.33814 5.16074 2.94986 5.83327C2.56158 6.5058 2.36743 6.84206 2.32416 7.17074C2.26646 7.60899 2.38522 8.05221 2.65431 8.40289C2.77714 8.56295 2.94975 8.69751 3.21766 8.86584C3.6115 9.11331 3.86491 9.53487 3.86488 10C3.86486 10.4651 3.61146 10.8866 3.21765 11.134C2.94971 11.3024 2.77707 11.437 2.65423 11.597C2.38514 11.9477 2.26638 12.3909 2.32408 12.8292C2.36735 13.1579 2.56149 13.4941 2.94978 14.1667C3.33806 14.8392 3.53221 15.1755 3.79522 15.3773C4.1459 15.6464 4.58912 15.7651 5.02736 15.7074C5.22741 15.6811 5.43027 15.5989 5.71003 15.451C6.12123 15.2337 6.61297 15.225 7.01575 15.4575C7.41853 15.6901 7.65688 16.1203 7.67426 16.585C7.68609 16.9013 7.71631 17.118 7.79352 17.3045C7.96268 17.7128 8.28714 18.0373 8.69552 18.2065C9.0018 18.3333 9.39009 18.3333 10.1667 18.3333C10.9432 18.3333 11.3315 18.3333 11.6378 18.2065C12.0462 18.0373 12.3706 17.7128 12.5398 17.3045C12.617 17.118 12.6472 16.9012 12.6591 16.585C12.6764 16.1202 12.9147 15.6901 13.3175 15.4575C13.7203 15.2249 14.212 15.2336 14.6232 15.451C14.903 15.5988 15.1058 15.681 15.3059 15.7074C15.7441 15.7651 16.1873 15.6463 16.538 15.3772C16.801 15.1754 16.9952 14.8391 17.3835 14.1666C17.7717 13.4941 17.9659 13.1578 18.0092 12.8291C18.0668 12.3909 17.9481 11.9477 17.679 11.597C17.5562 11.4369 17.3835 11.3023 17.1156 11.134C16.7218 10.8865 16.4684 10.465 16.4684 9.99992C16.4685 9.53486 16.7218 9.11339 17.1156 8.86598C17.3836 8.69761 17.5562 8.56304 17.6791 8.40295C17.9482 8.05226 18.0669 7.60905 18.0092 7.1708C17.966 6.84212 17.7718 6.50585 17.3835 5.83332C16.9952 5.16079 16.8011 4.82453 16.5381 4.62271C16.1874 4.35362 15.7442 4.23486 15.3059 4.29256C15.1059 4.3189 14.903 4.40112 14.6233 4.54899C14.2121 4.76632 13.7203 4.77501 13.3176 4.54246C12.9148 4.30991 12.6764 3.87971 12.6591 3.41494C12.6472 3.09872 12.617 2.88193 12.5398 2.69552C12.3706 2.28714 12.0462 1.96268 11.6378 1.79352Z"
                      stroke="#1C274C"
                      stroke-width="1.5"
                    />
                  </svg>
                </div>

                <div>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[8.17px] h-[
                3.5px]"
                  >
                    <path
                      d="M9.24992 1.25L5.16659 4.75L1.08325 1.25"
                      stroke="#1C274C"
                      stroke-linecap="square"
                    />
                  </svg>
                </div>
              </div>
              <HeaderSettings />
            </div>
          </>
        ) : (
          <div style={{ display: "flex" }}>
            <div
              className={clsx("app-navbar-item", itemClass)}
              style={{ width: "140px", justifyContent: "center" }}
            >
              <div
                ref={buttonRef}
                className={clsx(
                  "cursor-pointer symbol d-flex flex-row h-36px  btn btn-active-light"
                )}
                data-kt-menu-trigger="{default: 'click'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
                style={{
                  background: "transparent",
                  // border:'1px solid #1F3259',
                  width: "132x`px",
                  gap: "10px",
                  padding: "8px 10px 8px 10px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #1C274C",
                }}
                // onClick={handleToggle}
              >
                <div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_58_877)">
                      <path
                        d="M1.66675 9.99999C1.66675 6.07162 1.66675 4.10743 2.88714 2.88704C4.10752 1.66666 6.07171 1.66666 10.0001 1.66666C13.9285 1.66666 15.8926 1.66666 17.113 2.88704C18.3334 4.10743 18.3334 6.07162 18.3334 9.99999C18.3334 13.9284 18.3334 15.8925 17.113 17.1129C15.8926 18.3333 13.9285 18.3333 10.0001 18.3333C6.07171 18.3333 4.10752 18.3333 2.88714 17.1129C1.66675 15.8925 1.66675 13.9284 1.66675 9.99999Z"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      />
                      <path
                        d="M5.83325 15L5.83325 12.5"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M10 15V10"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M14.1667 15V7.5"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_58_877">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                <div>
                  <span style={{ fontFamily: "Manrope", fontSize: "12px" }}>
                    {selectedOption.charAt(0).toUpperCase() +
                      selectedOption.slice(1)}{" "}
                    View
                  </span>
                </div>
                <div>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[8.17px] h-[
                3.5px]"
                  >
                    <path
                      d="M9.24992 1.25L5.16659 4.75L1.08325 1.25"
                      stroke="#1C274C"
                      stroke-linecap="square"
                    />
                  </svg>
                </div>
              </div>
              <HeaderViewMenu onToggle={handleToggle} />
            </div>
            <div
              style={{
                display: "flex",
                padding: "0px",
                width: "150px",
                justifyContent: "center",
              }}
            >
              <div className={clsx("app-navbar-item", itemClass)}>
                <div
                  ref={buttonRef}
                  className={clsx(
                    "cursor-pointer symbol d-flex flex-row h-32px  btn btn-active-light"
                  )}
                  data-kt-menu-trigger="{default: 'click'}"
                  data-kt-menu-attach="parent"
                  // data-kt-menu-placement="bottom-end"
                  style={{
                    border: "1px solid #1C274C",
                    width: "64px",
                    gap: "10px",
                    padding: "8px 10px 8px 10px",
                    borderRadius: "8px",
                    // border: isClicked ? "1px solid #000000" : "none",
                  }}
                  onClick={handleButtonClick}
                >
                  <div>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 22L2 22"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M21 22V6C21 4.11438 21 3.17157 20.4142 2.58579C19.8284 2 18.8856 2 17 2H15C13.1144 2 12.1716 2 11.5858 2.58579C11.1142 3.05733 11.0223 3.76022 11.0043 5"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      />
                      <path
                        d="M15 22V9C15 7.11438 15 6.17157 14.4142 5.58579C13.8284 5 12.8856 5 11 5H7C5.11438 5 4.17157 5 3.58579 5.58579C3 6.17157 3 7.11438 3 9V22"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      />
                      <path
                        d="M9 22V19"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M6 8H12"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M6 11H12"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M6 14H12"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[8.17px] h-[
                3.5px]"
                    >
                      <path
                        d="M9.24992 1.25L5.16659 4.75L1.08325 1.25"
                        stroke="#1C274C"
                        stroke-linecap="square"
                      />
                    </svg>
                  </div>
                </div>
                <HeaderUserMenu />
              </div>
              <div className={clsx("app-navbar-item", itemClass)}>
                <div
                  ref={buttonRef}
                  className={clsx(
                    "cursor-pointer symbol d-flex flex-row h-36px  btn btn-active-light"
                  )}
                  data-kt-menu-trigger="{default: 'click'}"
                  data-kt-menu-attach="parent"
                  data-kt-menu-placement="bottom-end"
                  style={{
                    border: "1px solid #1C274C",
                    width: "64px",
                    gap: "10px",
                    padding: "8px 10px 8px 10px",
                    borderRadius: "8px",
                    // border: isClicked ? "1px solid #000000" : "none",
                  }}
                  onClick={handleButtonClick}
                >
                  <div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10.1666"
                        cy="10"
                        r="2.5"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      />
                      <path
                        d="M11.6378 1.79352C11.3315 1.66666 10.9432 1.66666 10.1667 1.66666C9.39009 1.66666 9.0018 1.66666 8.69552 1.79352C8.28714 1.96268 7.96268 2.28714 7.79352 2.69552C7.71631 2.88194 7.68609 3.09874 7.67426 3.41498C7.65688 3.87972 7.41855 4.3099 7.01579 4.54243C6.61303 4.77496 6.12132 4.76627 5.71016 4.54896C5.43037 4.40107 5.2275 4.31884 5.02745 4.2925C4.5892 4.23481 4.14598 4.35357 3.7953 4.62266C3.53229 4.82447 3.33814 5.16074 2.94986 5.83327C2.56158 6.5058 2.36743 6.84206 2.32416 7.17074C2.26646 7.60899 2.38522 8.05221 2.65431 8.40289C2.77714 8.56295 2.94975 8.69751 3.21766 8.86584C3.6115 9.11331 3.86491 9.53487 3.86488 10C3.86486 10.4651 3.61146 10.8866 3.21765 11.134C2.94971 11.3024 2.77707 11.437 2.65423 11.597C2.38514 11.9477 2.26638 12.3909 2.32408 12.8292C2.36735 13.1579 2.56149 13.4941 2.94978 14.1667C3.33806 14.8392 3.53221 15.1755 3.79522 15.3773C4.1459 15.6464 4.58912 15.7651 5.02736 15.7074C5.22741 15.6811 5.43027 15.5989 5.71003 15.451C6.12123 15.2337 6.61297 15.225 7.01575 15.4575C7.41853 15.6901 7.65688 16.1203 7.67426 16.585C7.68609 16.9013 7.71631 17.118 7.79352 17.3045C7.96268 17.7128 8.28714 18.0373 8.69552 18.2065C9.0018 18.3333 9.39009 18.3333 10.1667 18.3333C10.9432 18.3333 11.3315 18.3333 11.6378 18.2065C12.0462 18.0373 12.3706 17.7128 12.5398 17.3045C12.617 17.118 12.6472 16.9012 12.6591 16.585C12.6764 16.1202 12.9147 15.6901 13.3175 15.4575C13.7203 15.2249 14.212 15.2336 14.6232 15.451C14.903 15.5988 15.1058 15.681 15.3059 15.7074C15.7441 15.7651 16.1873 15.6463 16.538 15.3772C16.801 15.1754 16.9952 14.8391 17.3835 14.1666C17.7717 13.4941 17.9659 13.1578 18.0092 12.8291C18.0668 12.3909 17.9481 11.9477 17.679 11.597C17.5562 11.4369 17.3835 11.3023 17.1156 11.134C16.7218 10.8865 16.4684 10.465 16.4684 9.99992C16.4685 9.53486 16.7218 9.11339 17.1156 8.86598C17.3836 8.69761 17.5562 8.56304 17.6791 8.40295C17.9482 8.05226 18.0669 7.60905 18.0092 7.1708C17.966 6.84212 17.7718 6.50585 17.3835 5.83332C16.9952 5.16079 16.8011 4.82453 16.5381 4.62271C16.1874 4.35362 15.7442 4.23486 15.3059 4.29256C15.1059 4.3189 14.903 4.40112 14.6233 4.54899C14.2121 4.76632 13.7203 4.77501 13.3176 4.54246C12.9148 4.30991 12.6764 3.87971 12.6591 3.41494C12.6472 3.09872 12.617 2.88193 12.5398 2.69552C12.3706 2.28714 12.0462 1.96268 11.6378 1.79352Z"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[8.17px] h-[
                3.5px]"
                    >
                      <path
                        d="M9.24992 1.25L5.16659 4.75L1.08325 1.25"
                        stroke="#1C274C"
                        stroke-linecap="square"
                      />
                    </svg>
                  </div>
                </div>
                <HeaderSettings />
              </div>
            </div>
            {config.app?.header?.default?.menu?.display && (
              <div
                className="app-navbar-item d-lg-none ms-2 me-n3"
                title="Show header menu"
              >
                <div
                  className="btn btn-icon btn-active-color-primary w-35px h-35px"
                  id="kt_app_header_menu_toggle"
                ></div>
              </div>
            )}
          </div>
        )
      ) : (
        <>
          {(masterRole === "School Master" || multipleSchools === "yes") && (
            <div className={clsx("app-navbar-item", itemClass)}>
              <div
                ref={buttonRef}
                className={clsx(
                  "cursor-pointer symbol d-flex flex-row h-36px  btn btn-active-light"
                )}
                data-kt-menu-trigger="{default: 'click'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
                style={{
                  background: "#F3F3F3",
                  width: isMobile ? "120px" : "max-content",
                  gap: "10px",
                  padding: "8px 10px 8px 10px",
                  borderRadius: "8px",
                  overflow: !isMobile ? "auto" : "auto",
                  // border: isClicked ? "1px solid #000000" : "none",
                }}
                onClick={handleButtonClick}
              >
                <div>
                  <i className="fas fa-school" style={{ color: "#000" }}></i>
                </div>
                <span
                  style={{
                    /* text styling */
                    fontSize: isMobile ? 12 : 14,

                    /* turn this into a flex child that can shrink */
                    flex: isMobile ? 1 : undefined,
                    minWidth: 0,

                    /* the magic: single line + ellipsis */
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {schoolName}
                </span>
                <div>
                  <i
                    className="fas fa-chevron-down"
                    style={{ color: "#1C274C", fontSize: "10px" }}
                  />
                </div>
              </div>
              <HeaderSchoolChange
                setSchoolName={setSchoolName}
                currentSessionId={currentSessionId}
              />
            </div>
          )}
          {masterRole !== "Super Admin" && (
            <div className={clsx("app-navbar-item", itemClass)}>
              <div
                ref={buttonRef}
                className={clsx(
                  "cursor-pointer symbol d-flex flex-row h-36px  btn btn-active-light"
                )}
                data-kt-menu-trigger="{default: 'click'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
                style={{
                  background: "#F3F3F3",
                  width: "max-content",
                  gap: !isMobile ? "10px" : "5px",
                  padding: "8px 10px 8px 10px",
                  borderRadius: "8px",
                  // border: isClicked ? "1px solid #000000" : "none",
                }}
                onClick={handleButtonClick}
              >
                <div>
                  <i className="fas fa-clock" style={{ color: "#000" }}></i>
                </div>
                <span style={{ fontSize: !isMobile ? "14px" : "12" }}>
                  {sessionName}
                </span>
                <div>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[8.17px] h-[
                3.5px]"
                  >
                    <path
                      d="M9.24992 1.25L5.16659 4.75L1.08325 1.25"
                      stroke="#1C274C"
                      stroke-linecap="square"
                    />
                  </svg>
                </div>
              </div>
              <HeaderSessionChange
                setSessionName={setSessionName}
                setCurrentSessionId={setCurrentSessionId}
              />
            </div>
          )}
          <div className={clsx("app-navbar-item", itemClass)}>
            <div
              ref={buttonRef}
              className={clsx(
                "cursor-pointer symbol d-flex flex-row h-36px  btn btn-active-light"
              )}
              data-kt-menu-trigger="{default: 'click'}"
              data-kt-menu-attach="parent"
              data-kt-menu-placement="bottom-end"
              style={{
                background: "#F3F3F3",
                width: "max-content",
                gap:!isMobile ? "10px" : "5px",
                padding: "8px 10px 8px 10px",
                borderRadius: "8px",
                // border: isClicked ? "1px solid #000000" : "none",
              }}
              onClick={handleButtonClick}
            >
              <div>
                <svg
                  width={!isMobile ? "20" : "18"}
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="10.1666"
                    cy="10"
                    r="2.5"
                    stroke="#1C274C"
                    stroke-width="1.5"
                  />
                  <path
                    d="M11.6378 1.79352C11.3315 1.66666 10.9432 1.66666 10.1667 1.66666C9.39009 1.66666 9.0018 1.66666 8.69552 1.79352C8.28714 1.96268 7.96268 2.28714 7.79352 2.69552C7.71631 2.88194 7.68609 3.09874 7.67426 3.41498C7.65688 3.87972 7.41855 4.3099 7.01579 4.54243C6.61303 4.77496 6.12132 4.76627 5.71016 4.54896C5.43037 4.40107 5.2275 4.31884 5.02745 4.2925C4.5892 4.23481 4.14598 4.35357 3.7953 4.62266C3.53229 4.82447 3.33814 5.16074 2.94986 5.83327C2.56158 6.5058 2.36743 6.84206 2.32416 7.17074C2.26646 7.60899 2.38522 8.05221 2.65431 8.40289C2.77714 8.56295 2.94975 8.69751 3.21766 8.86584C3.6115 9.11331 3.86491 9.53487 3.86488 10C3.86486 10.4651 3.61146 10.8866 3.21765 11.134C2.94971 11.3024 2.77707 11.437 2.65423 11.597C2.38514 11.9477 2.26638 12.3909 2.32408 12.8292C2.36735 13.1579 2.56149 13.4941 2.94978 14.1667C3.33806 14.8392 3.53221 15.1755 3.79522 15.3773C4.1459 15.6464 4.58912 15.7651 5.02736 15.7074C5.22741 15.6811 5.43027 15.5989 5.71003 15.451C6.12123 15.2337 6.61297 15.225 7.01575 15.4575C7.41853 15.6901 7.65688 16.1203 7.67426 16.585C7.68609 16.9013 7.71631 17.118 7.79352 17.3045C7.96268 17.7128 8.28714 18.0373 8.69552 18.2065C9.0018 18.3333 9.39009 18.3333 10.1667 18.3333C10.9432 18.3333 11.3315 18.3333 11.6378 18.2065C12.0462 18.0373 12.3706 17.7128 12.5398 17.3045C12.617 17.118 12.6472 16.9012 12.6591 16.585C12.6764 16.1202 12.9147 15.6901 13.3175 15.4575C13.7203 15.2249 14.212 15.2336 14.6232 15.451C14.903 15.5988 15.1058 15.681 15.3059 15.7074C15.7441 15.7651 16.1873 15.6463 16.538 15.3772C16.801 15.1754 16.9952 14.8391 17.3835 14.1666C17.7717 13.4941 17.9659 13.1578 18.0092 12.8291C18.0668 12.3909 17.9481 11.9477 17.679 11.597C17.5562 11.4369 17.3835 11.3023 17.1156 11.134C16.7218 10.8865 16.4684 10.465 16.4684 9.99992C16.4685 9.53486 16.7218 9.11339 17.1156 8.86598C17.3836 8.69761 17.5562 8.56304 17.6791 8.40295C17.9482 8.05226 18.0669 7.60905 18.0092 7.1708C17.966 6.84212 17.7718 6.50585 17.3835 5.83332C16.9952 5.16079 16.8011 4.82453 16.5381 4.62271C16.1874 4.35362 15.7442 4.23486 15.3059 4.29256C15.1059 4.3189 14.903 4.40112 14.6233 4.54899C14.2121 4.76632 13.7203 4.77501 13.3176 4.54246C12.9148 4.30991 12.6764 3.87971 12.6591 3.41494C12.6472 3.09872 12.617 2.88193 12.5398 2.69552C12.3706 2.28714 12.0462 1.96268 11.6378 1.79352Z"
                    stroke="#1C274C"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
              <div>
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[8.17px] h-[
                3.5px]"
                >
                  <path
                    d="M9.24992 1.25L5.16659 4.75L1.08325 1.25"
                    stroke="#1C274C"
                    stroke-linecap="square"
                  />
                </svg>
              </div>
            </div>
            <HeaderSettings />
          </div>
        </>
      )}
    </div>
  );
};

export { Navbar };
