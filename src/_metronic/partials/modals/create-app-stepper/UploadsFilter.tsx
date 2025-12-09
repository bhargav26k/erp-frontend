/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
// import { StepperComponent } from "../../../assets/ts/components";
// import { KTIcon } from "../../../helpers";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { TablesWidget18 } from "../../widgets/tables/TablesWidget18";
import { useAuth } from "../../../../app/modules/auth";
// import { useNavigate } from "react-router-dom";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Props = {
  show: boolean;
  handleClose: () => void;
  filterData: () => string[]; // Adjust the return type based on what your filterData function actually returns
};

interface FormData{
  className: string;
  classId?: number; // Optional if needed
  sectionName: string;
  sectionId?: number; // Optional if needed
  subjectName: string;
  subjectId?: number; // Optional if needed
  lessonName: string;
  lessonId?: number; // Optional if needed
  topicName: string;
  topicId?: number; // Optional if needed
  isPublic: boolean | ''; // Adjust based on what 'isPublic' represents
}

interface ClassItem {
  id: number;
  class: string;
}

interface SectionItem {
  class_section_id: any;
  id: number;
  name: string;
  section: string;
  class_secion : string;
}

interface SubjectItem {
  subject_id: number;
  subject_name: string;
  class_section_subject_id:string,
}

interface LessonItem {
  lesson_id: number;
  lesson_name: string;
  class_section_subject_lesson_id:string;
}

interface TopicItem {
  topic_id: number;
  topic_name: string;
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const UploadsFilter: React.FC<Props> = ({ show, handleClose, filterData }) => {

  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [getClasses, setClasses] = useState<ClassItem[]>([]);
  const [getSections, setSections] = useState<SectionItem[]>([]);
  const [getSubjects, setSubjects] = useState<SubjectItem[]>([]);
  const [getLessons, setLessons] = useState<LessonItem[]>([]);
  const [getTopics, setTopics] = useState<TopicItem[]>([]);

  
  const [formData, setFormData] = useState<FormData>({
    className: '',
    sectionName: '',
    subjectName: '',
    lessonName: '',
    topicName: '',
    isPublic: '', // Initialize with an appropriate value based on its type
  });

  
  
  const [selectedClass, setSelectedClass] = useState({ id: null, name: 'Select Class' });
  const [selectedSection, setSelectedSection] = useState({ id: null, name: 'Select Section', class_section_id:null });
  const [selectedSubjects, setSelectedSubjects] = useState({ id: null, name: 'Select Subject',class_section_subject_id:null });
  const [selectedLesson, setSelectedLesson] = useState({ id: null, name: 'Select Lesson',class_section_subject_lesson_id:null });
  const [selectedTopic, setSelectedTopic] = useState({ id: null, name: 'Select Topic'});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-allclasses/${school_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if(selectedClass.id !== null){
      const fetchSections = async () => {
        try {
          const response = await fetch(
            `${DOMAIN}/api/school/get-allsections/${school_id}/${selectedClass.id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setSections(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSections();
    }
    
  }, [selectedClass.id]);

  
  useEffect(() => {
    if(selectedSection.id !== null){
      const fetchSubjects = async () => {
        try {
          const class_section_id = selectedSection.class_section_id;
          const response = await fetch(
            `${DOMAIN}/api/school/get-allsubjects/${class_section_id}/${school_id}`
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
      
    }
    
  }, [selectedSection.id]);
  
  useEffect(() => {
    if(selectedSubjects.id !== null){
      const fetchLessons = async () => {
        try {
          const class_section_subject_id = selectedSubjects.class_section_subject_id;
          const response = await fetch(
            `${DOMAIN}/api/school/get-alllessons/${class_section_subject_id}/${school_id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setLessons(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchLessons();
      
    }
    
  }, [selectedSubjects.id]);

  useEffect(() => {
    if(selectedLesson.id !== null){
      const fetchTopics = async () => {
        try {
          const class_section_subject_lesson_id = selectedLesson.class_section_subject_lesson_id;
          const response = await fetch(
            `${DOMAIN}/api/school/get-alltopics/${class_section_subject_lesson_id}/${school_id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setTopics(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTopics();
      
    }
    
  }, [selectedLesson.id]);




  const handleSave = () => {
    handleClose();
    const dta = formData; 
     /* @ts-ignore */   
    filterData(dta)
  };

  const handleClassSelect = ({id, name}:any) => {
    setSelectedClass({ id, name });
    setFormData({
      ...formData,
      classId: id,
      className: name,
    });
  };

const handleSectionSelect = ({id, name,class_section_id}:any) =>{
  setSelectedSection({id,name,class_section_id});
  setFormData({
    ...formData,
    sectionId: id,
    sectionName: name,
  });
};

const handleSubjectSelect = ({id, name,class_section_subject_id}:any) =>{
  setSelectedSubjects({id,name,class_section_subject_id});
  setFormData({
    ...formData,
    subjectId: id,
    subjectName: name,
  });
  
};
const handleLessonSelect = ({id, name,class_section_subject_lesson_id}:any) =>{
  setSelectedLesson({id,name,class_section_subject_lesson_id});
  setFormData({
    ...formData,
    lessonId: id,
    lessonName: name,
  });
};

const handleTopicSelect = ({id, name}:any) =>{
  setSelectedTopic({id,name});
  setFormData({
    ...formData,
    topicId: id,
    topicName: name,
  });
};


  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-550px"
      show={show}
      onHide={handleClose}
      backdrop={true}
    >
      <div
        className="modal-content"
        style={{ padding: "23px 5px", borderRadius: "17px" }}
      >
        <div
          className="modal-header border-0"
          style={{ width: "100%", height: "17px" }}
        >
          <span
            className=""
            id="staticBackdropLabel"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "Manrope",
            }}
          >
            Filters :
          </span>
          <span
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
            style={{ cursor: "pointer" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#ECECEC" />
              <path
                d="M22.8572 9.14294L9.14288 22.8572M9.14288 9.14294L22.8572 22.8572"
                stroke="#464646"
                stroke-width="2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Select Class
            </label>

            <div className="dropdown" id="exampleFormControlInput1">
              <button
                className="btn btn-secondary dropdown-toggle"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                // onChange={handleClassChange}
              >
                {selectedClass.name}
              </button>
              <ul
                className="dropdown-menu"
                style={{
                  width: "100%",
                  maxHeight: "150px",
                  overflowY: "scroll",
                }}
              >
                {getClasses.map((item) => (
                  <li key={item.id}>
                    <button className="dropdown-item"  onClick={() => handleClassSelect({id: item.id, name: item.class})}>{item.class}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Select Section
            </label>

            <div className="dropdown" id="exampleFormControlInput1">
              <button
                className="btn btn-secondary dropdown-toggle"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                 {selectedSection.name}
              </button>
              <ul
                className="dropdown-menu"
                style={{
                  width: "100%",
                  maxHeight: "150px",
                  overflowY: "scroll",
                }}
              >
                {getSections.map((item) => (
                  <li key={item.id}>
                    <button className="dropdown-item" onClick={() => handleSectionSelect({id: item.id,name: item.section,class_section_id: item.class_section_id})}>{item.section}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Select Subject
            </label>

            <div className="dropdown" id="exampleFormControlInput1">
              <button
                className="btn btn-secondary dropdown-toggle"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                 {selectedSubjects.name}
              </button>
              <ul className="dropdown-menu" style={{ width: "100%" }}>
              {getSubjects.map((item) => (
                  <li key={item.subject_id}>
                    <button className="dropdown-item"  onClick={() => handleSubjectSelect({id:item.subject_id,name: item.subject_name,class_section_subject_id: item.class_section_subject_id})}>{item.subject_name}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Select Lesson
            </label>

            <div className="dropdown" id="exampleFormControlInput1">
              <button
                className="btn btn-secondary dropdown-toggle"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selectedLesson.name}
              </button>
              <ul className="dropdown-menu" style={{ width: "100%" }}>
              {getLessons.map((item) => (
                  <li key={item.lesson_id}>
                    <button className="dropdown-item"  onClick={() => handleLessonSelect({id:item.lesson_id,name: item.lesson_name, class_section_subject_lesson_id:item.class_section_subject_lesson_id })}>{item.lesson_name}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginBottom: "23px" }}>
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Select Topic
            </label>

            <div className="dropdown" id="exampleFormControlInput1">
              <button
                className="btn btn-secondary dropdown-toggle"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "1px solid #ECEDF1",
                  borderRadius: "8px",
                }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selectedTopic.name}
              </button>
              <ul className="dropdown-menu" style={{ width: "100%" }}>
              {getTopics.map((item) => (
                  <li key={item.topic_id}>
                    <button className="dropdown-item"  onClick={() => handleTopicSelect({id:item.topic_id, name:item.topic_name})}>{item.topic_name}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="">
            <label
              htmlFor="exampleFormControlInput1"
              className="form-label"
              style={{
                fontSize: "12px",
                color: "#434343",
                fontWeight: "500",
              }}
            >
              Is Public
            </label>
            <div
              style={{
                display: "flex",
                padding: "13px 12px",
                gap: "12px",
                border: "1px solid #ECEDF1",
                borderRadius: "8px",
              }}
            >
              <div
                className="form-check"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="gridRadios"
                  id="gridRadios1"
                  value="option1"
                  defaultChecked
                  style={{ width: "15px", height: "15px" }}
                />
                <label className="form-check-label" htmlFor="gridRadios1">
                  Yes
                </label>
              </div>
              <div
                className="form-check"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="gridRadios"
                  id="gridRadios1"
                  value="option1"
                  defaultChecked
                  style={{ width: "15px", height: "15px" }}
                />
                <label className="form-check-label" htmlFor="gridRadios1">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal-footer border-0"
          style={
            {
              // width: "100%",
              // height: "30px",
              // display: "flex",
              // justifyContent: "end",
              // padding: "0px 24px 21px 24px",
              // border: "1px solid",
            }
          }
        >
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            style={{
              width: "118px",
              height: "36px",
              padding: "8px 10px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexShrink: "0",
              backgroundColor: "rgba(39, 59, 99, 0.76)",
            }}
            onClick={handleSave}
          >
            <span
              style={{
                color: "#FFF",
                fontFamily: "Manrope",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              Apply
            </span>
          </button>
        </div>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { UploadsFilter };
