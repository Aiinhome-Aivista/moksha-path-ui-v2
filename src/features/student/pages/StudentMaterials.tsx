import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import MaterialsSidebar from "../components/Materialsidebar";
import MaterialsHeader from "../components/MaterialHeader";
import ResourceMaterials, {
  type YouTubeLink,
} from "../components/ResourceMaterials";
import Practice from "../components/Practice";
import Tests from "../components/Tests";
import Notes, { type NoteData } from "../components/Notes";
import ApiServices from "../../../services/ApiServices";
import IconChat from "../../../assets/icon/chat2.svg";
import Chat from "../../auth/modal/chat";

// import { Loader2 } from "lucide-react";

interface ChapterItem {
  name: string;
  chapter_id?: number;
  topics?: TopicItem[];
}

interface TopicItem {
  name: string;
  topic_id?: number;
}

const StudentMaterials = () => {
  const location = useLocation();
  // const { type } = useParams();
  // Get data from location state (passed from LearningPlanner)
  const locationState = location.state as {
    boardName?: string;
    className?: string;
    subjects?: string[];
    subjectWisePlan?: any[];
    stats?: any;
    selectedChapterId?: number;
    activeResourceType?: string;
    selectedSubjectName?: string;
    selectedTopicIds?: number[];
    assignmentId?: number;
  } | null;

  // Initialize state with values from location state or fallbacks
  const [board] = useState(locationState?.boardName || "");
  const [className] = useState(locationState?.className || "");

  // const [activeSubject, setActiveSubject] = useState(
  //     locationState?.subjects?.[0] || "Math",
  // );

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

  // To hold dynamic chapter/topic data when coming from Notifications
  const [fetchedAssignmentContext, setFetchedAssignmentContext] = useState<{
    chapterId?: number;
    topicIds?: number[];
  } | null>(null);

  // ── Resource data from API ──
  const [youtubeLinks, setYoutubeLinks] = useState<YouTubeLink[]>([]);
  const [notesData, setNotesData] = useState<NoteData[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Use subjects from location state or fallback to default
  // const subjects = locationState?.subjects || [
  //   "Math",
  //   "Science",
  //   "History",
  //   "Civics",
  //   "Geography",
  //   "English Literature",
  //   "English Grammar",
  //   "Hindi Sahitya",
  // ];

  const resourceTypes = ["Videos", "Practice", "Tests", "Notes"];
  const [subjectWisePlan, setSubjectWisePlan] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  // const [isPageLoading, setIsPageLoading] = useState(true);
  // const [isInitLoading, setIsInitLoading] = useState(true);
  // const planSource =
  //   subjectWisePlan.length > 0
  //     ? subjectWisePlan
  //     : locationState?.subjectWisePlan || [];
  const planSource = useMemo(() => {
    return subjectWisePlan.length > 0
      ? subjectWisePlan
      : locationState?.subjectWisePlan || [];
  }, [subjectWisePlan, locationState?.subjectWisePlan]);
  const statsSource = stats || locationState?.stats;
  const subjects =
    subjectWisePlan.length > 0
      ? subjectWisePlan.map((s) => s.subject_name)
      : locationState?.subjects || [];
  useEffect(() => {
    const loadInitData = async () => {
      // setIsPageLoading(true);
      // CASE 1: LearningPlanner navigation (location.state exists)
      if (locationState?.subjectWisePlan) {
        setSubjectWisePlan(locationState.subjectWisePlan);
        setStats(locationState.stats);

        setActiveSubject(
          locationState.selectedSubjectName ||
          locationState.subjectWisePlan[0]?.subject_name ||
          "",
        );

        // setIsInitLoading(false);
        return;
      }

      // CASE 2: Sidebar navigation / Direct URL / Refresh
      try {
        const res = await ApiServices.getStudentLearningPlanner();

        if (res.data?.status === "success") {
          setSubjectWisePlan(res.data.data.subject_wise_plan);
          setStats(res.data.data.stats);

          setActiveSubject(
            locationState?.selectedSubjectName ||
            res.data.data.subject_wise_plan[0]?.subject_name ||
            "",
          );
        }

        // Handle assignmentId logic
        if (locationState?.assignmentId) {
          const assessRes = await ApiServices.getStudentAssessments();
          if (assessRes.data?.status === "success") {
            const assess = assessRes.data.data?.find(
              (a: any) => a.assignment_id === locationState.assignmentId,
            );
            if (assess) {
              setFetchedAssignmentContext({
                chapterId: assess.chapter_ids?.[0], // Focus first chapter
                topicIds: assess.topic_ids || [],
              });
            }
          }
        }
      } catch (err) {
        // console.error("Init load failed", err);
      } finally {
        // setIsInitLoading(false);
        // setIsPageLoading(false);
      }
    };

    loadInitData();
  }, []);
  // ── Update chapters and topics dynamically based on active subject ──
  // useEffect(() => {
  //   if (
  //     locationState?.subjectWisePlan &&
  //     Array.isArray(locationState.subjectWisePlan) &&
  //     activeSubject
  //   ) {
  //     const selectedSubjectPlan = locationState.subjectWisePlan.find(
  //       (plan: any) => plan.subject_name === activeSubject,
  //     );

  //     if (
  //       selectedSubjectPlan?.chapters &&
  //       Array.isArray(selectedSubjectPlan.chapters)
  //     ) {
  //       const transformedChapters: ChapterItem[] =
  //         selectedSubjectPlan.chapters.map((chapter: any) => ({
  //           name: chapter.chapter_name,
  //           chapter_id: chapter.chapter_id,
  //           topics:
  //             chapter.topics?.map((topic: any) => ({
  //               name: topic.topic_name,
  //               topic_id: topic.topic_id,
  //             })) || [],
  //         }));
  //       setChapters(transformedChapters);

  //       // Set initially selected chapter if passed from LearningPlanner
  //       if (locationState?.selectedChapterId) {
  //         const chapterIndex = transformedChapters.findIndex(
  //           (ch) => ch.chapter_id === locationState.selectedChapterId,
  //         );
  //         if (chapterIndex !== -1) {
  //           setSelectedChapters([chapterIndex]);
  //         }
  //       } else {
  //         setSelectedChapters([]);
  //       }

  //       // Extract all topics from all chapters
  //       const allTopics: TopicItem[] = selectedSubjectPlan.chapters.flatMap(
  //         (chapter: any) =>
  //           chapter.topics && Array.isArray(chapter.topics)
  //             ? chapter.topics.map((topic: any) => ({
  //                 name: topic.topic_name,
  //                 topic_id: topic.topic_id,
  //               }))
  //             : [],
  //       );
  //       setCoreTopics(allTopics);

  //       // Initialize all topics as selected by default
  //       // setSelectedTopics(allTopics.map((_, index) => index));

  //     } else {
  //       setChapters([]);
  //       setCoreTopics([]);
  //     }
  //   } else if (!locationState?.subjectWisePlan) {
  //     // Fallback to default chapters if no API data provided
  //     setChapters([
  //       { name: "Matter" },
  //       { name: "Physical Quantities & Measurement" },
  //       { name: "Physical Changes" },
  //       { name: "Least Count" },
  //       { name: "Errors" },
  //     ]);
  //     setCoreTopics([
  //       { name: "States" },
  //       { name: "Interconversion" },
  //       { name: "Physical Changes" },
  //       { name: "Least Count" },
  //       { name: "Errors" },
  //     ]);
  //   }
  // }, [activeSubject, locationState?.subjectWisePlan]);
  useEffect(() => {
    if (
      // !locationState?.subjectWisePlan ||
      // !Array.isArray(locationState.subjectWisePlan) ||
      // !activeSubject
      !planSource ||
      !Array.isArray(planSource) ||
      !activeSubject
    ) {
      setChapters([]);
      setCoreTopics([]);
      setSelectedChapters([]);
      setSelectedTopics([]);
      return;
    }

    const selectedSubjectPlan = planSource.find(
      (plan: any) => plan.subject_name === activeSubject,
    );

    if (!selectedSubjectPlan?.chapters) {
      setChapters([]);
      setCoreTopics([]);
      setSelectedChapters([]);
      setSelectedTopics([]);
      return;
    }

    // ----------------------------
    // STEP 1: Transform Chapters
    // ----------------------------

    const transformedChapters: ChapterItem[] = selectedSubjectPlan.chapters.map(
      (chapter: any) => ({
        name: chapter.chapter_name,
        chapter_id: chapter.chapter_id,
        topics: chapter.topics || [],
      }),
    );

    setChapters(transformedChapters);

    // ----------------------------
    // STEP 2: Select Chapter
    // ----------------------------

    // let chapterIndex = -1;

    // if (locationState?.selectedChapterId) {
    //   chapterIndex = transformedChapters.findIndex(
    //     (ch) => ch.chapter_id === locationState.selectedChapterId,
    //   );

    //   if (chapterIndex !== -1) {
    //     setSelectedChapters([chapterIndex]);
    //   } else {
    //     setSelectedChapters([]);
    //   }
    // } else {
    //   setSelectedChapters([]);
    // }
    // ----------------------------
    // STEP 2: Select Chapter (FIXED)
    // ----------------------------

    let chapterIndex = -1;

    const targetChapterId =
      fetchedAssignmentContext?.chapterId || locationState?.selectedChapterId;

    if (targetChapterId) {
      // LearningPlanner/Notification থেকে এলে
      chapterIndex = transformedChapters.findIndex(
        (ch) => ch.chapter_id === targetChapterId,
      );

      if (chapterIndex !== -1) {
        setSelectedChapters([chapterIndex]);
      } else {
        setSelectedChapters([0]); // fallback first chapter
        chapterIndex = 0;
      }
    } else {
      // Direct URL / Refresh / Sidebar case
      if (transformedChapters.length > 0) {
        setSelectedChapters([0]);
        chapterIndex = 0;
      } else {
        setSelectedChapters([]);
      }
    }
    // ----------------------------
    // STEP 3: Extract ONLY Selected Chapter Topics
    // ----------------------------

    let extractedTopics: TopicItem[] = [];

    // if (chapterIndex !== -1) {
    //   const selectedChapter = selectedSubjectPlan.chapters[chapterIndex];

    //   extractedTopics =
    //     selectedChapter?.topics?.map((topic: any) => ({
    //       name: topic.topic_name,
    //       topic_id: topic.topic_id,
    //     })) || [];
    // }

    if (chapterIndex !== -1 && selectedSubjectPlan.chapters[chapterIndex]) {
      const selectedChapter = selectedSubjectPlan.chapters[chapterIndex];

      extractedTopics =
        selectedChapter.topics?.map((topic: any) => ({
          name: topic.topic_name,
          topic_id: topic.topic_id,
        })) || [];
    }

    setCoreTopics(extractedTopics);

    // ----------------------------
    // STEP 4: Select Topics (Exact Sync)
    // ----------------------------

    const targetTopicIds =
      fetchedAssignmentContext?.topicIds || locationState?.selectedTopicIds;

    if (targetTopicIds && targetTopicIds.length > 0) {
      const topicIndexes = extractedTopics
        .map((topic, index) =>
          topic.topic_id !== undefined &&
            targetTopicIds.includes(topic.topic_id)
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
    subjectWisePlan,
    // planSource,
    locationState?.selectedChapterId,
    locationState?.selectedTopicIds,
    fetchedAssignmentContext,
  ]);

  // ── Fetch resources when chapter & topic are selected ──
  useEffect(() => {
    const fetchResources = async () => {
      // We need at least one selected chapter
      if (selectedChapters.length === 0) {
        // Clear resources when no chapters are selected
        setYoutubeLinks([]);
        setNotesData([]);
        return;
      }

      // Get all selected chapter IDs
      const selectedChapterIds = selectedChapters
        .map((index) => chapters[index]?.chapter_id)
        .filter((id) => id !== undefined) as number[];

      if (selectedChapterIds.length === 0) return;

      // Collect topic IDs: if specific topics are selected use those,
      // otherwise use all topics from selected chapters
      let topicIds: number[] = [];

      if (
        selectedTopics.length > 0 &&
        selectedTopics.length < coreTopics.length
      ) {
        // Specific core topics are selected (not all)
        topicIds = selectedTopics
          .map((topicIndex) => coreTopics[topicIndex]?.topic_id)
          .filter((id) => id !== undefined) as number[];
      } else {
        // Use all topics from selected chapters
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

      // Build payload
      // const stats = locationState?.stats;
      // const selectedSubjectPlan = locationState?.subjectWisePlan?.find(
      //   (plan: any) => plan.subject_name === activeSubject,
      // );

      // const payload = {
      //   board_id: stats?.board_id,
      //   institute_id: stats?.institute_id,
      //   class_id: stats?.class_id,
      //   subject_id: selectedSubjectPlan?.subject_id,
      //   chapter_ids: selectedChapterIds,
      //   topic_ids: topicIds,
      // };
      // const selectedSubjectPlan = planSource.find(
      //   (plan: any) => plan.subject_name === activeSubject,
      // );
      const selectedSubjectPlan = (
        subjectWisePlan.length > 0
          ? subjectWisePlan
          : locationState?.subjectWisePlan || []
      ).find((plan: any) => plan.subject_name === activeSubject);
      const payload = {
        board_id: statsSource?.board_id,
        institute_id: statsSource?.institute_id,
        class_id: statsSource?.class_id,
        subject_id: selectedSubjectPlan?.subject_id,
        chapter_ids: selectedChapterIds,
        topic_ids: topicIds,
      };
      // console.log("RESOURCE PAYLOAD:", payload);

      setIsResourcesLoading(true);

      try {
        const response = await ApiServices.getChapterTopicResources(payload);
        const result = response.data;

        if (result.status === "success" && Array.isArray(result.data)) {
          // Flatten all youtube_links or videos from all topics
          const allLinks: YouTubeLink[] = result.data.flatMap(
            (item: any) => item.youtube_links || item.videos || [],
          );
          setYoutubeLinks(allLinks);

          // Parse notes for each topic
          const allNotes: NoteData[] = result.data
            .filter((item: any) => item.notes)
            .map((item: any) => {
              let parsedContent: any = item.notes;

              // If it's a string, try to parse it, otherwise keep as is
              if (typeof item.notes === "string") {
                try {
                  parsedContent = JSON.parse(item.notes);
                } catch {
                  parsedContent = item.notes;
                }
              }

              // Normalize content structure if it's an object with a 'content' field
              // but we want to be flexible as the API might return direct array or obj

              return {
                topic_id: item.topic_id,
                topic_title:
                  item.topic_title ||
                  (parsedContent &&
                    typeof parsedContent === "object" &&
                    !Array.isArray(parsedContent)
                    ? parsedContent.title || parsedContent.topic
                    : `Topic ${item.topic_id}`),
                content: parsedContent,
              };
            });
          setNotesData(allNotes);
        }
      } catch (error) {
        // console.error("Failed to fetch resources:", error);
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
    // chapters,
    // coreTopics,
    activeSubject,
    statsSource,
    // planSource,
  ]);

  useEffect(() => {
    if (!planSource || !activeSubject || chapters.length === 0) return;

    const selectedSubjectPlan = planSource.find(
      (plan: any) => plan.subject_name === activeSubject,
    );

    if (!selectedSubjectPlan?.chapters) return;

    if (selectedChapters.length === 0) {
      if (coreTopics.length !== 0) {
        setCoreTopics([]);
      }
      return;
    }

    const selectedChapterIds = selectedChapters
      .map((index) => chapters[index]?.chapter_id)
      .filter((id) => id !== undefined);

    const topics = selectedSubjectPlan.chapters
      .filter((chapter: any) => selectedChapterIds.includes(chapter.chapter_id))
      .flatMap(
        (chapter: any) =>
          chapter.topics?.map((topic: any) => ({
            topic_id: topic.topic_id,
            name: topic.topic_name,
          })) || [],
      );

    const currentTopicIds = coreTopics.map((t) => t.topic_id).join(",");
    const newTopicIds = topics
      .map((t: { topic_id: any }) => t.topic_id)
      .join(",");

    if (currentTopicIds !== newTopicIds) {
      setCoreTopics(topics);
    }
  }, [selectedChapters, activeSubject, chapters]);

  useEffect(() => {
    const path = location.pathname.toLowerCase();

    //   if (path.includes("tests")) setActiveResourceType("Tests");
    //   else if (path.includes("notes")) setActiveResourceType("Notes");
    //   else if (path.includes("practice")) setActiveResourceType("Practice");
    //   else setActiveResourceType("Videos"); // default
    // }, [location.pathname]);
    if (locationState?.activeResourceType) {
      setActiveResourceType(locationState.activeResourceType);
    } else if (path.includes("tests")) setActiveResourceType("Tests");
    else if (path.includes("notes")) setActiveResourceType("Notes");
    else if (path.includes("practice")) setActiveResourceType("Practice");
    else setActiveResourceType("Videos"); // default
  }, [location.pathname]);

  // Get subject_id and chapter_ids for Tests component
  // const getSubjectId = () => {
  //   if (!locationState?.subjectWisePlan || !activeSubject) return undefined;
  //   const selectedSubjectPlan = planSource.find(
  //     (plan: any) => plan.subject_name === activeSubject,
  //   );
  //   return selectedSubjectPlan?.subject_id;
  // };
  const getSubjectId = () => {
    if (!planSource || !activeSubject) return undefined;

    const selectedSubjectPlan = planSource.find(
      (plan: any) => plan.subject_name === activeSubject,
    );

    return selectedSubjectPlan?.subject_id;
  };
  const getSelectedChapterIds = () => {
    if (selectedChapters.length === 0) return [];
    const chapterIds = selectedChapters
      .map((index) => chapters[index]?.chapter_id)
      .filter((id) => id !== undefined) as number[];
    return chapterIds;
  };

  const getSelectedChapterNames = () => {
    if (selectedChapters.length === 0) return [];
    return selectedChapters
      .map((index) => chapters[index]?.name)
      .filter((name) => name !== undefined) as string[];
  };
  // const getAllTopics = () => {
  //   if (!locationState?.subjectWisePlan || !activeSubject) return [];

  //   const subject = locationState.subjectWisePlan.find(
  //     (s: any) => s.subject_name === activeSubject,
  //   );

  //   if (!subject?.chapters) return [];

  //   return subject.chapters.flatMap((chapter: any) =>
  //     chapter.topics.map((topic: any) => ({
  //       topic_id: topic.topic_id,
  //       name: topic.topic_name,
  //     })),
  //   );
  // };

  const getAllTopics = () => {
    if (!planSource || !activeSubject) return [];

    const subject = planSource.find(
      (s: any) => s.subject_name === activeSubject,
    );

    if (!subject?.chapters) return [];

    return subject.chapters.flatMap((chapter: any) =>
      chapter.topics.map((topic: any) => ({
        topic_id: topic.topic_id,
        name: topic.topic_name,
      })),
    );
  };


  // if (isInitLoading) {
  //   return (
  //     <div className="p-6 text-center text-lg font-medium">
  //       Loading materials...
  //     </div>
  //   );
  // }

  // if (isPageLoading || isResourcesLoading) {
  //   return (
  //     <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
  //       <div className="flex flex-col items-center gap-3">
  //         <div className="w-10 h-10 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
  //         <span className="text-sm text-gray-500 font-medium">
  //           Loading student materials...
  //         </span>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="min-h-screen">
      <div className="flex gap-6">
        <MaterialsSidebar
          board={board || statsSource?.board_name || ""}
          className={className || statsSource?.class_name || ""}
          activeSubject={activeSubject}
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
            subjects={subjects}
            activeSubject={activeSubject}
            setActiveSubject={setActiveSubject}
            resourceTypes={resourceTypes}
            activeResourceType={activeResourceType}
            setActiveResourceType={setActiveResourceType}
          />

          {activeResourceType === "Videos" && (
            <ResourceMaterials
              youtubeLinks={youtubeLinks}
              isLoading={isResourcesLoading}
            // isLoading={false}
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
            <Notes notes={notesData} isLoading={isResourcesLoading} />
          )}
        </div>
      </div>
      <div className="fixed right-[1%] top-[80%] -translate-y-1/2 z-[100]">
        <button
          onClick={() => setIsChatOpen(true)}
          aria-label="Open chat"
          className="p-0 bg-transparent border-0 cursor-pointer"
        >
          <img src={IconChat} alt="Chat" className="w-[95px]" />
        </button>
      </div>
      {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};
export default StudentMaterials;
