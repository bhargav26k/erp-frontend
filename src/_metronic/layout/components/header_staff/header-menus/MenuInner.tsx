import React, { useEffect, useState } from "react";
import { DOMAIN } from "../../../../../app/routing/ApiEndpoints";
import { toAbsoluteUrl } from "../../../../helpers";
import { useAuth } from "../../../../../app/modules/auth/core/Auth";
import "./MenuInner.css";

export function MenuInner() {
  const { currentUser } = useAuth();
  const useRole = currentUser?.role_name;
  const schoolName = currentUser?.school_name;
  const schoollogopath = currentUser?.school_logo;
  const [logo, setLogo] = useState("");

  useEffect(() => {
    if (!schoollogopath) return;
    (async () => {
      try {
        const res = await fetch(
          `${DOMAIN}/api/school/get_school_logo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ school_logo: schoollogopath }),
          }
        );
        if (!res.ok) throw new Error("Fetch failed");
        const blob = await res.blob();
        setLogo(URL.createObjectURL(blob));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [schoollogopath]);

  return (
    <div className="d-flex align-items-center gap-3 menu-inner">
      <img
        alt="Logo"
        src={
          useRole === "Super Admin"
            ? toAbsoluteUrl("media/logos/superadmin.png")
            : logo
            ? logo
            : toAbsoluteUrl("media/logos/default.png")
        }
        style={{height:'30px'}}
      />
      <nav aria-label="breadcrumb">
        <ol style={{fontSize:'16px'}}>{schoolName || "Dexpert_Portal"}</ol>
      </nav>
    </div>
  );
}
