import React, { FC, useEffect, useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useAuth } from "../../../modules/auth/core/Auth";
import { useNavigate, useParams } from "react-router-dom";

interface Section {
  id: string;
  section: string;
  class_section_id: string;
  // Add other properties if needed
}

const SelectSections: FC = () => {
  const isAssignment = window.location.pathname.includes(
    "lms-Assigmnent-management"
  );
  const { currentUser } = useAuth();
  const Navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const school_id = currentUser?.school_id;
  const [getSections, setSections] = useState<Section[]>([]);

  const [entityNames, setEntityNames] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
      const fetchNames = async () => {
        try {
          const response = await fetch(
            `${DOMAIN}/api/school/get-entity-names/${school_id}?class_id=${classId}&section_id=${null}&subject_id=${null}&lesson_id=${null}`
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch entity names");
          }
  
          const data = await response.json();
          setEntityNames(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNames();
    }, [classId]);



  useEffect(() => {
    const fetchSections = async () => {
      if (!school_id || !classId) return;
      /* @ts-ignore */

      const teacher_id = currentUser?.id;

      try {
        let response;
        if (currentUser?.roleName === "Teacher") {
          response = await fetch(
            `${DOMAIN}/api/school/get-allteachersections/${school_id}/${teacher_id}/${classId}`
          );
        } else {
          response = await fetch(
            `${DOMAIN}/api/school/get-allsections/${school_id}/${classId}`
          );
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Section[] = await response.json();
        setSections(data);
      } catch (error) {
        console.log("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, [school_id, classId, currentUser]);

  const handleCheckSubjects = (
    classId: string,
    sectionId: string,
    class_section_id: string
  ) => {
    const queryParams = new URLSearchParams({
      class_section_id: class_section_id || "",
      class_id: classId,
      section_id: sectionId,
    }).toString();
    if (isAssignment) {
      Navigate(`/lms-Assigmnent-management/select-subjects?${queryParams}`);
    } else {
      Navigate(`/lms-course-management/select-subjects?${queryParams}`);
    }
  };

  // const handleCheckMaterials = (classId: string, sectionId: string) => {
  //   const queryParams = new URLSearchParams({
  //     class_id: classId,
  //     section_id: sectionId,
  //   }).toString();
  //   if (isAssignment) {
  //     Navigate(`/lms-Assigmnent-management/assignment-wise?${queryParams}`);
  //   } else {
  //     Navigate(`/lms-course-management/material-wise?${queryParams}`);
  //   }
  // };

  const handleBack = () => {
    Navigate(-1);
  };

  return (
    <div className="">
      <Content>
      <h3 style={{fontFamily:'Manrope', fontWeight:'500', fontSize:'16px', borderBottom:'1px solid lightgray', paddingBottom:'10px',width:'auto', marginTop:'10px', display:'flex', gap:'1%' ,alignItems:'center'
      }}>
       <div
            style={{border:'1px solid gray', borderRadius:'100%', padding:'5px 10px', cursor:'pointer'}}
            onClick={handleBack}
          >
            <i className="fas fa-arrow-left"></i>
          </div>/{entityNames?.class_name}
      </h3>
      <div className="row p-5" >
        <div className="container">
          <div style={{display:'flex',gap:'10px', alignItems:'center'}}>
          <h1
          style={{
            fontSize: "26px",
            fontWeight: "500",
            lineHeight: "21.86px",
            color: "#1C325B",
            fontFamily: "Manrope"
          }}
          >Select Sections :</h1>
          </div>
          <div className="row">
            {getSections.map((section) => (
              <div className="col-md-2" key={section.id}>
                <div className="card mb-4" style={{ boxShadow:" 0px 4px 10px rgba(0, 0, 0, 0.1)"}}>
                  <div
                    className="card-body"
                    style={{
                      background: "#F2F6FF",
                      justifyContent: "center",
                      display: "flex",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleCheckSubjects(
                        classId,
                        section.id,
                        section.class_section_id
                      )
                    }
                  >
                    <h5
                      className="card-title"
                      style={{
                        fontSize: "26px",
                        fontWeight: "500",
                        lineHeight: "21.86px",
                        color: "#1C325B",
                        fontFamily: "Manrope",
                      }}
                    >
                      {section.section}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </Content>
    </div>
  );
};

export default SelectSections;
