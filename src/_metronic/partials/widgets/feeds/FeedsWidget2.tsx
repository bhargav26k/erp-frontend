import React from "react";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { Dropdown1 } from "../../content/dropdown/Dropdown1";
import DOMPurify from "dompurify";

type Props = {
  className: string;
  title: string;
  date: string;
  message: string;
  created_by: string;
};

const FeedsWidget2: React.FC<Props> = ({
  className,
  title,
  date,
  message,
  created_by,
}) => {
  const DescriptionComponent = ({ description }: any) => {
    const sanitizedHTML = DOMPurify.sanitize(description);

    return <tbody dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
  };

  // Parse the date string into a Date object
  const dateObject = new Date(date);

  // Get the day, month, and year from the date object
  const day = dateObject.getDate().toString().padStart(2, "0");
  //const month= (dateObject.getMonth()+1).toString().padStart(2,"0");
  const year = dateObject.getFullYear();

  const MonthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = MonthNames[dateObject.getMonth()];

  const formatDate = `${day} ${monthName} ${year}`;
  // console.log('formatede date :',formatDate);

  return (
    <div>
      <div className="d-flex flex-column">
        <div className="text-right">
          <span
            className="fw-semibold"
            style={{
              font: "Manrope",
              fontSize: "24px",
              padding: "8px",
            }}
          >
            {" "}
            {formatDate}
          </span>
        </div>
      </div>

      <div
        className={`card  ${className}`}
        style={{ overflowY: "auto", width: "100%", background: "#F2F4F5" }}
      >
        <div className="card-body pb-0">
          <div className="d-flex mb-5 justify-content-between">
            <div className="d-flex flex-column" style={{ maxWidth: "150px" }}>
              <a
                href="#"
                className="text-gray-800 text-hover-primary fs-5 fw-bold"
                style={{ whiteSpace: "nowrap" }}
              >
                {title}
              </a>
              <span className="text-gray-500 fw-semibold">{created_by}</span>
            </div>
            <div className="d-flex justify-content-end">
              <a
                style={{
                  color: "#ED5578",
                }}
                href="#"
              >
                Important
              </a>
            </div>
          </div>
        </div>
        <div
          className="mb-5"
          style={{
            width: "300px",
          }}
        >
          <p
            className="text-gray-800 fw-normal mb-5 px-8 "
            style={{
              textAlign: "justify",
              overflowWrap: "break-word",
            }}
          >
            <DescriptionComponent description={message} />
          </p>
        </div>
      </div>
    </div>
  );
};

export { FeedsWidget2 };

{
  /*

import React from "react";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { Dropdown1 } from "../../content/dropdown/Dropdown1";
import DOMPurify from "dompurify";

type Props = {
  className: string;
  title: string;
  date: string;
  message: string;
  created_by: string;
};

const FeedsWidget2: React.FC<Props> = ({
  className,
  title,
  date,
  message,
  created_by,
}) => {
  const DescriptionComponent = ({ description }: any) => {
    const sanitizedHTML = DOMPurify.sanitize(description);

    return <tbody dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
  };
  return (
    <div
      className={`card  ${className}`}
      style={{ overflowY: "auto", maxHeight: "300px" }}
    >
      <div className="card-body pb-0 ">
        <div className="d-flex  mb-5 justify-content-between">
            <div className="d-flex flex-column" style={{ maxWidth: '150px' }}>
              <a
                href="#"
                className="text-gray-800 text-hover-primary fs-5 fw-bold"
              >
                {title}
              </a>
              <span className="text-gray-500 fw-semibold">{created_by}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-700 fs-9 fw-semibold">{date}</span>
            </div>
        </div>

        <div className="mb-5">
          <p className="text-gray-800 fw-normal mb-5">
            <DescriptionComponent description={message} />
          </p>

          <div className='d-flex align-items-center mb-5'>
            <a
              href='#'
              className='btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4'
            >
              <KTIcon iconName='message-text-2' className='fs-2' />
              120
            </a>

            <a
              href='#'
              className='btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2'
            >
              <KTIcon iconName='heart' className='fs-2' />
              15
            </a>
          </div>
        </div>

        
        <form className='position-relative mb-6'>
          <textarea
            className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
            rows={1}
            placeholder='Reply..'
          ></textarea>

          <div className='position-absolute top-0 end-0 me-n5'>
            <span className='btn btn-icon btn-sm btn-active-color-primary pe-0 me-2'>
              <KTIcon iconName='paper-clip' className='fs-3 mb-3' />
            </span>

            <span className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
              <KTIcon iconName='geolocation' className='fs-2 mb-3' />
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export { FeedsWidget2 };
*/
}
