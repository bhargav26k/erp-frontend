// import {MenuItem} from './MenuItem'
// import {MenuInnerWithSub} from './MenuInnerWithSub'
// import {MegaMenu} from './MegaMenu'
import { toAbsoluteUrl } from "../../../../helpers";

interface MenuInnerProps {
  title: string; // Update the type definition
}

export function MenuInner({ title }: MenuInnerProps) {
  return (
    <div className="d-flex align-center justify-center my-auto gap-3">
      <div>
        <img
          alt="Logo"
          src={toAbsoluteUrl("media/logos/header-logo.png")}
          className="h-45px "
        />
      </div>
      <div className="my-auto ">
        {/* <span style={{fontSize:"30px", fontWeight:"500", lineHeight:"43.71px", color:"#000000", fontFamily:"Manrope,sans-serif"}}>{title}</span> */}
        <nav aria-label="breadcrumb">
          <ol
            className="breadcrumb"
            style={{
              fontSize: "30px",
              fontWeight: "500",
              lineHeight: "43.71px",
              color: "#000000",
              fontFamily: "Manrope",
            }}
          >
            {title}
          </ol>
        </nav>
      </div>
    </div>
  );
}
