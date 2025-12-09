import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Content } from "../../../../_metronic/layout/components/content";
import { HeaderWrapper } from "../../../../_metronic/layout/components/header_staff";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { useAuth } from "../../../modules/auth/core/Auth";
import { useNavigate } from "react-router-dom";

const CourseContentPage: FC = () => {
  const { currentUser } = useAuth();
  const classId = (currentUser as any)?.class_id;
  const school_id = (currentUser as any)?.school_id;
  const section_id = (currentUser as any)?.section_id;
  const [getData, setData] = useState<any[]>([]);
  const [getSubjects, setSubjects] = useState<any[]>([]);
  const Navigate = useNavigate();
  
  

  useEffect(() => {
    const fetchFiles = async () => {
      if (!school_id || !classId || !section_id) return;

      try {
        const response = await fetch(
          `${DOMAIN}/api/student/get-overall-uploads/${school_id}/${classId}/${section_id}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFiles();
  }, [school_id, classId, section_id]);



  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/student/get-allsubjects/${school_id}/${classId}/${section_id}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setSubjects(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubjects();
  }, [classId, section_id, school_id]);



  const handleFileClick = (file: any) => {

    if (!file || !file.fileName) {
      return null;
    }

    const fileUrl = `${DOMAIN}/uploads/Lms/Materials/${file.fileName}`;

    window.open(fileUrl, "_blank"); // Open file in new tab
  };



  const renderFileIcon = (file: any) => {
    if (!file || !file.fileName) {
      return <p>No file details available</p>;
    }

    const fileExtension = file.fileName.split(".").pop()?.toLowerCase();

    const getIconForFileType = (extension: string) => {
      switch (extension) {
        case "pdf":
          return (
            <img
              src="/media/svg/file-icons/pdf-icon.svg"
              alt="PDF File"
              width={100}
            />
          );
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          return (
            <img
              src="/media/svg/file-icons/png-icon.svg"
              alt="Image File"
              width={100}
            />
          );
        case "mp4":
        case "avi":
        case "mov":
          return <img src="/path/to/video-icon.svg" alt="Video File" />;
        case "doc":
        case "docx":
          return <img src="/path/to/doc-icon.svg" alt="Document File" />;
        default:
          return <p>Unsupported file type</p>;
      }
    };

    return (
      <div style={{ marginBottom: "10px" }}>
        {getIconForFileType(fileExtension)}
      </div>
    );
  };

  const handleCheckLessons = (subjectId: string | null,class_section_subject_id: string | null) => {
    const queryParams = new URLSearchParams({
      subject_id:subjectId || '',
      class_section_subject_id:class_section_subject_id || ''
    }).toString();
    
      Navigate(`/course-content/lessons?${queryParams}`);
   
  };  
  

  return (
    <div className="">
      <HeaderWrapper toggleView={() => {}} />

      <Content>
        <div className="container-fluid">
          <div className="col">
            <h1>Common Contents:</h1>
            <div
              className="row mb-8"
              style={{
                height: "420px",
                overflowY: "auto",
                maxHeight: "340px",
                borderBottom: "1px solid lightgray",
              }}
            >
              {getData.map((file) => (
                <div key={file.id} className="col-md-1 mb-5">
                  <div
                    className="card"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleFileClick(file.file)}
                  >
                    <div className="card-body p-3">
                      {/* Render preview conditionally */}
                      {renderFileIcon(file.file)}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          width: "100%",
                          alignItems: "center",
                          padding: "5px",
                          height: "auto",
                        }}
                      >
                        <h5
                          className="card-title"
                          style={{
                            width: "100%",
                            overflow: "hidden",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          {file.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h1>Select Subjects:</h1>
            <div
              className="row"
              style={{
                height: "420px",
                overflowY: "auto",
                maxHeight: "400px",
                padding: "10px",
              }}
            >
              {getSubjects.map((key) => (
                <div
                  key={key.subject_id}
                  className="col-md-3"
                  style={{ height: "100px" }}
                >
                  <div
                    className="card"
                    style={{
                      cursor: "pointer",
                      height: "100%",
                      border: "1px solid lightgray",
                    }}
                    onClick={() => handleCheckLessons(key.subject_id,key.class_section_subject_id)}
                  >
                    <div
                      className="card-body"
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      <h5
                        className="card-title fs-1"
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          textAlign: "center",
                        }}
                      >
                        {key.subject_name}
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

const CourseContent: FC = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.HOMEWORK" })}
      </PageTitle>

      <CourseContentPage />
    </>
  );
};

export { CourseContent };
