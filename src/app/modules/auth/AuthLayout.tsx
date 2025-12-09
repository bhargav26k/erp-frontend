import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) root.style.height = "100%";
    return () => {
      if (root) root.style.height = "auto";
    };
  }, []);

  return (
    <div
      className="d-flex flex-column flex-lg-row flex-column-fluid h-100vh"
      style={{ backgroundColor: "#fff" }}
    >
      {/* begin::Body */}
      <div
        className="d-flex flex-column flex-lg-row-fluid w-lg-100 p-3 p-lg-10 order-2 order-lg-1"
        style={{ backgroundColor: "#fff" }}
      >
        {/* begin::Form */}
        <div
          className="d-flex flex-column flex-lg-row-fluid justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          {/* begin::Wrapper */}
          <div
            className="bg-white rounded-3 shadow-sm mx-auto w-100"
            style={{
              maxWidth: "560px",
              padding: "1rem", // fallback, will be overridden by the classes below
            }}
          >
            {/* responsive padding: 1rem on xs–md, 2.5rem on lg+ */}
            <div className="p-4 p-lg-10">
              <Outlet />
            </div>
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Form */}
      </div>
    </div>
  );
};

export default AuthLayout;
