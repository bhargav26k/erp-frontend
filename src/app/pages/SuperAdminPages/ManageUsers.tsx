import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { Content } from "../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../_metronic/layout/components/header_staff";
import { TablesWidget26 } from "../../../_metronic/partials/widgets/tables/TablesWidget26";
import { CreateAdminModal } from "../../../_metronic/partials/modals/create-app-stepper/CreateAdminModal";
import { DOMAIN } from "../../routing/ApiEndpoints";

interface School {
  id: number;
  name: string;
  // Add other properties as needed
}

export const ManageUserPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${DOMAIN}/api/superadmin/get_schools`);
        if (!response.ok) {
          throw new Error("Failed to fetch schools");
        }
        const data: School[] = await response.json();
        setSchools(data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []);

  const handleSelect = (school: School) => {
    setSelectedSchool(school);
    setSchoolId(school.id);
  };

  const handleAddSuperAdmin = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Content>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div className="dropdown" style={{ width: '60%' }}>
            <button
              className="btn btn-secondary w-50"
              style={{ textAlign: "left", fontFamily: 'Manrope' }}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="true"
            >
              {selectedSchool ? selectedSchool.name : "Select School"}
            </button>
            <ul className="dropdown-menu w-50">
              {schools.map((school) => (
                <li key={school.id}>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSelect(school)}
                    style={{ fontFamily: 'Manrope' }}
                  >
                    {school.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <button
              className="btn btn-primary ms-2"
              onClick={handleAddSuperAdmin}
              disabled={!schoolId}
              style={{ fontFamily: 'Manrope' }}
            >
              Add Admin
            </button>
          </div>

        </div>

        <div className="row gy-5 gx-xl-8">
          <div className="col-xl-12 p-6">
            <TablesWidget26
              className="card-xxl-stretch mb-5 mb-xl-8"
              school_id={schoolId}
            />
          </div>
        </div>

        <div>
          <CreateAdminModal
            show={showModal}
            onHide={handleCloseModal}
            schoolId={schoolId}
          />
        </div>

      </Content>
    </div>
  );
};

const ManageUsers = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <HeaderWrapper toggleView={() => {}} />
      <ManageUserPage />
    </>
  );
};

export default ManageUsers;
