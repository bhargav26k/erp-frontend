import React from "react";
import "./EngageWidget.css";

interface EngageWidgetProps {
  title: string;
  number: string | number;
  image: string;
  backgroundColor: string;
  titlecolor: string;
  textcolor: string;
}

const EngageWidget10: React.FC<EngageWidgetProps> = ({
  title,
  number,
  image,
  backgroundColor,
  titlecolor,
  textcolor,
}) => {
  return (
    // Use a responsive container (width: 100% and auto height)
    <div className="engage-widget-container">
      <div
        className="card mb-8 engage-widget-card"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="row g-0 d-flex align-items-center justify-content-center">
          <div className="col-auto engage-widget-img-col">
            <img
              src={`/media/product/${image}.png`}
              className="img-fluid rounded-start engage-widget-img"
              alt={title}
            />
          </div>
          <div className="col engage-widget-content-col">
            <div className="card-body p-2">
              <h5
                className="card-title engage-widget-title"
                style={{ color: titlecolor }}
              >
                {title}
              </h5>
              <p
                className="card-text engage-widget-number"
                style={{ color: textcolor }}
              >
                {number}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EngageWidget10 };
