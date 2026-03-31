import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import MaterialsSidebar from "../components/Materialsidebar";
import MaterialsHeader from "../components/MaterialHeader";
import ResourceMaterials, {
  type YouTubeLink,
} from "../components/ResourceMaterials";
import Practice from "../components/Practice";
import Tests from "../components/Tests";
import Notes, { type NoteData, type StudyMaterialItem } from "../components/Notes";
import ApiServices from "../../../services/ApiServices";
// import IconChat from "../../../assets/icon/chat2.svg";
import Chat from "../../auth/modal/chat";

interface ChapterItem {
  name: string;
  chapter_id?: number;
  topics?: TopicItem[];
}

interface TopicItem {
  name: string;
  topic_id?: number;
}

interface LocationState {
  boardName?: string;
  className?: string;
  sectionName?: string | string[];
  subjects?: string[];
  subjectWisePlan?: any[];
  stats?: any;
  academic?: any; // From LearningPlanner
  selectedChapterId?: number;
  activeResourceType?: string;
  selectedSubjectName?: string;
  selectedTopicIds?: number[];
  assignmentId?: number;
}

const StudentMaterials = () => {
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  const [activeSubject, setActiveSubject] = useState(
    locationState?.selectedSubjectName || locationState?.subjects?.[0] || "",
  );
  const [activeResourceType, setActiveResourceType] = useState(
    locationState?.activeResourceType || "",
  );

  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [coreTopics, setCoreTopics] = useState<TopicItem[]>([]);

  const [fetchedAssignmentContext, setFetchedAssignmentContext] = useState<{
    chapterId?: number;
    topicIds?: number[];
  } | null>(null);

  // ── Resource data from API ──
  const [youtubeLinks, setYoutubeLinks] = useState<YouTubeLink[]>([]);
  const [notesData, setNotesData] = useState<NoteData[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterialItem[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const resourceTypes = ["Videos", "Notes"];
  
  // ── Dynamic Plan Data ──
  const [subjectWisePlan, setSubjectWisePlan] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const planSource = useMemo(() => {
    return subjectWisePlan.length > 0
      ? subjectWisePlan
      : locationState?.subjectWisePlan || [];
  }, [subjectWisePlan, locationState?.subjectWisePlan]);

  // Prioritize nav state over locally fetched state to ensure richest data is used
  const statsSource = locationState?.academic || locationState?.stats || stats;
  
  // Ensure we extract a clean array of strings for the subjects
  const subjectsList = useMemo(() => {
    if (planSource.length > 0) {
      return planSource.map((s: any) => s.subject_name || s.name || "Unknown");
    }
    return locationState?.subjects || [];
  }, [planSource, locationState?.subjects]);

  // ✅ FIX: GUARANTEE SECTION IS AN ARRAY
  const safeSectionArray = useMemo(() => {
    const rawSection = 
      statsSource?.sections || 
      statsSource?.sections_name || 
      statsSource?.section_name || 
      locationState?.sectionName;

    if (!rawSection) return [];
    if (Array.isArray(rawSection)) return rawSection;
    
    // If it's a string with commas (e.g. "A, B"), split it. Otherwise, wrap the string in an array.
    if (typeof rawSection === "string" && rawSection.includes(",")) {
      return rawSection.split(",").map(s => s.trim());
    }
    
    return [rawSection];
  }, [statsSource, locationState?.sectionName]);

  // 1. Initial Data Fetch
  useEffect(() => {
    const loadInitData = async () => {
      setIsPageLoading(true);
      try {
        // CASE 1: Location State exists
        if (locationState?.subjectWisePlan && locationState.subjectWisePlan.length > 0) {
          setSubjectWisePlan(locationState.subjectWisePlan);
          setStats(locationState.stats || locationState.academic);

          if (!activeSubject) {
            setActiveSubject(
              locationState?.selectedSubjectName ||
              locationState.subjectWisePlan[0]?.subject_name ||
              locationState.subjectWisePlan[0]?.name ||
              ""
            );
          }
        } else {
          // CASE 2: Fetch from API
          const res = await ApiServices.getStudentPlannerDashboard();
          
          // Handle variations in API response wrapping
          const resultData = res.data?.status === 'success' ? res.data.data : res.data;

          if (resultData) {
            const fetchedPlan = resultData.subject_wise_plan || resultData.subjects || [];
            // Prioritize the 'academic' object as it's more complete
            const fetchedStats = resultData.academic || resultData.stats || null;

            setSubjectWisePlan(fetchedPlan);
            setStats(fetchedStats);

            if (!activeSubject && fetchedPlan.length > 0) {
              setActiveSubject(
                locationState?.selectedSubjectName ||
                fetchedPlan[0]?.subject_name ||
                fetchedPlan[0]?.name ||
                ""
              );
            }
          }
        }

        // Handle assignment ID if present, regardless of where plan came from
        if (locationState?.assignmentId) {
          const assessRes = await ApiServices.getStudentAssessments();
          if (assessRes.data?.status === "success") {
            const assess = assessRes.data.data?.find(
              (a: any) => a.assignment_id === locationState.assignmentId,
            );
            if (assess) {
              setFetchedAssignmentContext({
                chapterId: assess.chapter_ids?.[0],
                topicIds: assess.topic_ids || [],
              });
            }
          }
        }
      } catch (err) {
        // silent fail
      } finally {
        setIsPageLoading(false);
      }
    };

    loadInitData();
  }, [location.state]); // Re-run when navigation state changes

  // 2. Transform Chapters and Topics based on Active Subject
  useEffect(() => {
    if (!planSource || planSource.length === 0 || !activeSubject) {
      setChapters([]);
      setCoreTopics([]);
      setSelectedChapters([]);
      setSelectedTopics([]);
      return;
    }

    const selectedSubjectPlan = planSource.find(
      (plan: any) => (plan.subject_name || plan.name) === activeSubject,
    );

    if (!selectedSubjectPlan?.chapters || selectedSubjectPlan.chapters.length === 0) {
      setChapters([]);
      setCoreTopics([]);
      setSelectedChapters([]);
      setSelectedTopics([]);
      return;
    }

    // Step 1: Map Chapters
    const transformedChapters: ChapterItem[] = selectedSubjectPlan.chapters.map(
      (chapter: any) => ({
        name: chapter.chapter_name || chapter.name || chapter.chapter || "Unknown Chapter",
        chapter_id: chapter.chapter_id || chapter.id,
        topics: chapter.topics || [],
      }),
    );

    setChapters(transformedChapters);

    // Step 2: Auto-select initial chapter
    let chapterIndex = -1;
    const targetChapterId = fetchedAssignmentContext?.chapterId || locationState?.selectedChapterId;

    if (targetChapterId) {
      chapterIndex = transformedChapters.findIndex(
        (ch) => ch.chapter_id === targetChapterId,
      );

      if (chapterIndex !== -1) {
        setSelectedChapters([chapterIndex]);
      } else {
        setSelectedChapters([0]); 
        chapterIndex = 0;
      }
    } else {
      if (transformedChapters.length > 0) {
        setSelectedChapters([0]);
        chapterIndex = 0;
      } else {
        setSelectedChapters([]);
      }
    }

    // Step 3: Extract Core Topics
    let extractedTopics: TopicItem[] = [];
    if (chapterIndex !== -1 && selectedSubjectPlan.chapters[chapterIndex]) {
      const selectedChapter = selectedSubjectPlan.chapters[chapterIndex];

      extractedTopics =
        selectedChapter.topics?.map((topic: any) => ({
          name: topic.topic_name || topic.name || "Unknown Topic",
          topic_id: topic.topic_id || topic.id,
        })) || [];
    }

    setCoreTopics(extractedTopics);

    // Step 4: Auto-select topics
    const targetTopicIds = fetchedAssignmentContext?.topicIds || locationState?.selectedTopicIds;

    if (targetTopicIds && targetTopicIds.length > 0) {
      const topicIndexes = extractedTopics
        .map((topic, index) =>
          topic.topic_id !== undefined && targetTopicIds.includes(topic.topic_id)
            ? index
            : -1,
        )
        .filter((index) => index !== -1);

      setSelectedTopics(topicIndexes);
    } else {
      setSelectedTopics([]);
    }
  }, [
    activeSubject,
    planSource,
    locationState?.selectedChapterId,
    locationState?.selectedTopicIds,
    fetchedAssignmentContext,
  ]);

  // 3. Fetch Resources (Videos & Notes)
  useEffect(() => {
    const fetchResources = async () => {
      if (selectedChapters.length === 0) {
        setYoutubeLinks([]);
        setNotesData([]);
        return;
      }

      const selectedChapterIds = selectedChapters
        .map((index) => chapters[index]?.chapter_id)
        .filter((id) => id !== undefined) as number[];

      if (selectedChapterIds.length === 0) return;

      let topicIds: number[] = [];

      if (selectedTopics.length > 0 && selectedTopics.length < coreTopics.length) {
        topicIds = selectedTopics
          .map((topicIndex) => coreTopics[topicIndex]?.topic_id)
          .filter((id) => id !== undefined) as number[];
      } else {
        topicIds = selectedChapterIds.flatMap((chapterId) => {
          const chapter = chapters.find((ch) => ch.chapter_id === chapterId);
          return (
            chapter?.topics
              ?.filter((t) => t.topic_id !== undefined)
              .map((t) => t.topic_id as number) || []
          );
        });
      }

      if (topicIds.length === 0) return;

      const selectedSubjectPlan = planSource.find(
        (plan: any) => (plan.subject_name || plan.name) === activeSubject
      );
      
      const payload = {
        board_id: statsSource?.board_id || statsSource?.board,
        institute_id: statsSource?.institute_id || statsSource?.institute,
        class_id: statsSource?.class_id || statsSource?.class,
        subject_id: selectedSubjectPlan?.subject_id || selectedSubjectPlan?.id,
        chapter_ids: selectedChapterIds,
        topic_ids: topicIds,
      };

      setIsResourcesLoading(true);

      try {
        const response = await ApiServices.getChapterTopicResources(payload);
        const result = response.data;

        if (result.status === "success" && Array.isArray(result.data)) {
          const allLinks: YouTubeLink[] = result.data.flatMap(
            (item: any) => item.youtube_links || item.videos || [],
          );
          setYoutubeLinks(allLinks);

          const allNotes: NoteData[] = result.data
            .filter((item: any) => item.notes)
            .map((item: any) => {
              let parsedContent: any = item.notes;

              if (typeof item.notes === "string") {
                try {
                  parsedContent = JSON.parse(item.notes);
                } catch {
                  parsedContent = item.notes;
                }
              }

              return {
                topic_id: item.topic_id || item.id,
                topic_title:
                  item.topic_title || item.topic_name || item.name ||
                  (parsedContent && typeof parsedContent === "object" && !Array.isArray(parsedContent)
                    ? parsedContent.title || parsedContent.topic
                    : `Topic ${item.topic_id || item.id || ""}`),
                content: parsedContent,
              };
            });
          setNotesData(allNotes);
        } else {
            setYoutubeLinks([]);
            setNotesData([]);
        }
      } catch (error) {
        setYoutubeLinks([]);
        setNotesData([]);
      } finally {
        setIsResourcesLoading(false);
      }
    };

    fetchResources();
  }, [
    selectedChapters,
    selectedTopics,
    activeSubject,
    statsSource,
    planSource,
    chapters,
    coreTopics
  ]);

  // 4. Fetch Global Study Materials
  useEffect(() => {
    const fetchStudyMaterials = async () => {
      try {
        const res = await ApiServices.getStudyMaterial();
        if (res.data?.status === "success" && Array.isArray(res.data?.data)) {
          setStudyMaterials(res.data.data);
        } else {
          setStudyMaterials([]);
        }
      } catch (err) {
        setStudyMaterials([]);
      }
    };
    fetchStudyMaterials();
  }, []);

  // 5. Filter Global Study Materials by Active Subject
  const filteredStudyMaterials = useMemo(() => {
    if (!activeSubject) return studyMaterials;
    return studyMaterials.filter(
      (m) => m.subject_name?.toLowerCase() === activeSubject.toLowerCase()
    );
  }, [studyMaterials, activeSubject]);

  // Update Core Topics when chapters change manually
  useEffect(() => {
    if (!planSource || !activeSubject || chapters.length === 0) return;

    const selectedSubjectPlan = planSource.find(
      (plan: any) => (plan.subject_name || plan.name) === activeSubject,
    );

    if (!selectedSubjectPlan?.chapters) return;

    if (selectedChapters.length === 0) {
      if (coreTopics.length !== 0) setCoreTopics([]);
      return;
    }

    const selectedChapterIds = selectedChapters
      .map((index) => chapters[index]?.chapter_id)
      .filter((id) => id !== undefined);

    const topics = selectedSubjectPlan.chapters
      .filter((chapter: any) => selectedChapterIds.includes(chapter.chapter_id || chapter.id))
      .flatMap(
        (chapter: any) =>
          chapter.topics?.map((topic: any) => ({
            topic_id: topic.topic_id || topic.id,
            name: topic.topic_name || topic.name,
          })) || [],
      );

    const currentTopicIds = coreTopics.map((t) => t.topic_id).join(",");
    const newTopicIds = topics.map((t: { topic_id: any }) => t.topic_id).join(",");

    if (currentTopicIds !== newTopicIds) {
      setCoreTopics(topics);
    }
  }, [selectedChapters, activeSubject, chapters, planSource]);

  // Route Type Mapping
  useEffect(() => {
    const path = location.pathname.toLowerCase();

    if (locationState?.activeResourceType) {
      setActiveResourceType(locationState.activeResourceType);
    } else if (path.includes("tests")) setActiveResourceType("Tests");
    else if (path.includes("notes")) setActiveResourceType("Notes");
    else if (path.includes("practice")) setActiveResourceType("Practice");
    else setActiveResourceType("Videos"); 
  }, [location.pathname, locationState?.activeResourceType]);

  // Derived Values for Children Components
  const getSubjectId = () => {
    if (!planSource || !activeSubject) return undefined;
    const selectedSubjectPlan = planSource.find(
      (plan: any) => (plan.subject_name || plan.name) === activeSubject,
    );
    return selectedSubjectPlan?.subject_id || selectedSubjectPlan?.id;
  };

  const getSelectedChapterIds = () => {
    if (selectedChapters.length === 0) return [];
    return selectedChapters
      .map((index) => chapters[index]?.chapter_id)
      .filter((id) => id !== undefined) as number[];
  };

  const getSelectedChapterNames = () => {
    if (selectedChapters.length === 0) return [];
    return selectedChapters
      .map((index) => chapters[index]?.name)
      .filter((name) => name !== undefined) as string[];
  };

  const getAllTopics = () => {
    if (!planSource || !activeSubject) return [];
    const subject = planSource.find(
      (s: any) => (s.subject_name || s.name) === activeSubject,
    );
    if (!subject?.chapters) return [];

    return subject.chapters.flatMap((chapter: any) =>
      (chapter.topics || []).map((topic: any) => ({
        topic_id: topic.topic_id || topic.id,
        name: topic.topic_name || topic.name,
      })),
    );
  };

  return (
    <div className="min-h-screen relative">
      {isPageLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#BADA55] rounded-full animate-spin" />
            <span className="text-sm text-gray-400 font-medium tracking-wide">
              Loading materials...
            </span>
          </div>
        </div>
      )}

      <div
        className={`flex gap-6 transition-opacity duration-300 ${isPageLoading ? "opacity-0" : "opacity-100"
          }`}
      >
        <MaterialsSidebar
          board={statsSource?.board_name || statsSource?.board || locationState?.boardName || ""}
          className={statsSource?.class_name || statsSource?.class || locationState?.className || ""}
          sectionName={safeSectionArray} // ✅ GUARANTEED TO BE AN ARRAY
          subjects={subjectsList}
          activeSubject={activeSubject}
          setActiveSubject={setActiveSubject}
          chapters={chapters}
          coreTopics={coreTopics}
          selectedChapters={selectedChapters}
          setSelectedChapters={(newChapters) => {
            setSelectedChapters(newChapters);
            setSelectedTopics([]);
          }}
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
        />

        <div className="flex-1">
          <MaterialsHeader
            subjects={subjectsList} // Using the cleanly mapped array
            activeSubject={activeSubject}
            setActiveSubject={setActiveSubject}
            resourceTypes={resourceTypes}
            activeResourceType={activeResourceType}
            setActiveResourceType={setActiveResourceType}
          />

          {activeResourceType === "Videos" && (
            <ResourceMaterials
              youtubeLinks={youtubeLinks}
              externalLinks={filteredStudyMaterials.filter(
                (m) => m.file_type === "link"
              )}
              isLoading={isResourcesLoading}
            />
          )}
          {activeResourceType === "Practice" && <Practice />}
          {activeResourceType === "Tests" && (
            <Tests
              subjectId={getSubjectId()}
              subjectName={activeSubject}
              chapterIds={getSelectedChapterIds()}
              chapterNames={getSelectedChapterNames()}
              allChapters={chapters}
              allTopics={getAllTopics()}
              topicIds={selectedTopics
                .map((i) => coreTopics[i]?.topic_id)
                .filter((id): id is number => id !== undefined)}
              topicNames={selectedTopics
                .map((i) => coreTopics[i]?.name)
                .filter((name): name is string => name !== undefined)}
              autoStartTestId={locationState?.assignmentId}
            />
          )}
          {activeResourceType === "Notes" && (
            <Notes
              notes={notesData}
              studyMaterials={filteredStudyMaterials}
              isLoading={isResourcesLoading}
            />
          )}
        </div>
      </div>
      {/* <div className="fixed right-[1%] top-[80%] -translate-y-1/2 z-[100]">
        <button
          onClick={() => setIsChatOpen(true)}
          aria-label="Open chat"
          className="p-0 bg-transparent border-0 cursor-pointer"
        >
          <img src={IconChat} alt="Chat" className="w-[95px]" />
        </button>
      </div> */}
      {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};
export default StudentMaterials;