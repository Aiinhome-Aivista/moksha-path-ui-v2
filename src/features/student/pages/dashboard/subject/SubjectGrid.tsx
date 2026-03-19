import SubjectCard from "./SubjectCard";
import { subjects } from "../NewStudent";


const SubjectGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {subjects.map((sub, i) => (
        <SubjectCard key={i} {...sub} />
      ))}
    </div>
  );
};

export default SubjectGrid;