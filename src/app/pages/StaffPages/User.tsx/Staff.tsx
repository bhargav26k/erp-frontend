import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { TablesWidget30 } from "../../../../_metronic/partials/widgets/tables/TablesWidget30";
import { CreateStaff } from "../../../../_metronic/partials/modals/create-app-stepper/CreateStaff";
import * as XLSX from 'xlsx';
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";


const StaffPage: FC = () => {
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [refresh, setRefresh] = useState(false);
  const [csvData,setCsvData] =useState([]);

  const handleModalClose = () => {
    setShowCreateAppModal(false);
  };
// console.log(csvData);

  const exportToExcel = () => {
    if (csvData.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(csvData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Data");
      XLSX.writeFile(workbook, "staff_data.xlsx");
    } else {
      alert("No data available to export");
    }
  };


                      /* @ts-ignore */

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/import-staff`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setRefresh(true);
      console.log("File uploaded successfully:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const handlecreateStaff = () => {
    setShowCreateAppModal(true);
  };

  return (
    <div className="bg-body-secondary">
      {/* api = ${DOMAIN}/api/school/store-staff  to add staff*/}
      <Content>
        <div className="row g-5 g-xl-10 mb-6 mb-xl-5">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              gap:"10px"
            }}
          >
            <div>
              <button
                className="btn btn-primary"
                style={{
                  display: "flex",
                  margin: "10px",
                }}
                onClick={handlecreateStaff}
              >
                Add Staff
              </button>
            </div>
            <CreateStaff
              show={showCreateAppModal}
              handleClose={handleModalClose}
              refresh={setRefresh}
            />

            <div className="input-group" style={{ width: "10%" }}>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                id="inputGroupFile"
                aria-describedby="inputGroupFileAddon"
                aria-label="Choose file"
                placeholder="select file"
              />
              <button
                className="btn btn-primary"
                type="button"
                id="inputGroupFileAddon"
                onClick={uploadFile}
              >
                Upload
              </button>
            </div>
            <div>
            <button className="btn btn-primary"
              onClick={exportToExcel}
            >
          Export to Excel
        </button>
            </div>
          </div>
          <TablesWidget30 refresh={refresh} csvData={setCsvData}/>
        </div>
      </Content>
    </div>
  );
};

const Staff: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <HeaderWrapper toggleView={() => {}} />
      <StaffPage />
    </>
  );
};

export { Staff };
