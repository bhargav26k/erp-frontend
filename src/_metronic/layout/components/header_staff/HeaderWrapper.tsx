import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { LayoutSetup, useLayout } from "../../core";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Link } from "react-router-dom";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";

interface HeaderWrapperProps {
  toggleView?: (value: string) => void;
}

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

export function HeaderWrapper({ toggleView }: HeaderWrapperProps) {
  const { config, classes } = useLayout();
  const { currentUser } = useAuth();
  const isMobile = useMobile();

  const [subscriptionName, setSubscriptionName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const school_id = currentUser?.school_id;

  // Fetch subscription info only for non-students
  useEffect(() => {
    if (school_id) {
      const fetchSubscriptionId = async () => {
        try {
          const response = await fetch(
            `${DOMAIN}/api/superadmin/get-subscription-id/${school_id}`
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data = await response.json();
          setSubscriptionName(
            data.result[0]?.subscription_name || "Unlimited Access"
          );
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchSubscriptionId();
    }
  }, [school_id, currentUser]);

  if (config.app?.header?.default?.container === "fluid") {
    LayoutSetup.classes.headerContainer.push("container-fluid");
  } else {
    LayoutSetup.classes.headerContainer.push("container-xxl");
  }
  if (!config.app?.header?.display) {
    return null;
  }

  return (
    <div
      id="kt_app_header"
      className="app-header"
      style={{
        padding: !isMobile ? "10px 20px" : "10px 15px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        height:!isMobile ? "auto" : "105px" ,
      }}
    >
      <div
        id="kt_app_header_container"
        className={clsx(
          " d-flex align-items-center justify-content-between",
          classes.headerContainer.join(" "),
          config.app?.header?.default?.containerClass
        )}
        style={{ flexDirection:!isMobile ? "row" : "column"}}
      >
        <div style={{display:'flex'}}>
          {config.app.sidebar?.display && (
            <>
              {config.layoutType !== "dark-header" &&
              config.layoutType !== "light-header" ? (
                <div
                  className="d-flex align-items-center d-lg-none ms-n2 me-2"
                  title="Show sidebar menu"
                >
                  <div id="kt_app_sidebar_mobile_toggle">
                    <i
                      className="fas fa-align-left"
                      style={{ fontSize: "18px", cursor: "pointer" }}
                    />
                  </div>
                </div>
              ) : null}
            </>
          )}

          <div className="d-flex align-items-center gap-3">
            <Header />
          </div>
        </div>
        <div style={{width:"100%",padding:'0px', display:'flex', justifyContent:!isMobile ? "end" : "center"}}>
          <Navbar toggleView={toggleView} />
        </div>
        {/* Navbar */}
      </div>
    </div>
  );
}
