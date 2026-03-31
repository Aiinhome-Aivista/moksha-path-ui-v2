import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import MaterialsSidebar from "../components/Materialsidebar";
import MaterialsHeader from "../components/MaterialHeader";
import ResourceMaterials from "../components/Videos";
// import Tests from "../components/TeacherTests";
import Notes from "../components/Notes";
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

const TeacherMaterials = () => {
  const location = useLocation();

  // Get data from location state (passed from LearningPlanner)
  const locationState = location.state as {
    boardName?: string;
    className?: string;
    sectionName?: string;
    subjects?: string[];
    subjectWisePlan?: any[];
    stats?: any;
    selectedChapterId?: number;
    activeResourceType?: string;
    selectedSubjectName?: string;
    selectedTopicIds?: number[];
  } | null;

  const [board, setBoard] = useState(locationState?.boardName || "");
  const [className, setClassName] = useState(locationState?.className || "");
  const [section, setSection] = useState(locationState?.sectionName || "");

  // initial options (will be populated from API filters)
  const [boardOptions, setBoardOptions] = useState<string[]>([]);
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [sectionOptions, setSectionOptions] = useState<string[]>([]);


  // const [activeSubject, setActiveSubject] = useState(
  //     locationState?.subjects?.[0] || "Math",
  // );

  const [activeSubject, setActiveSubject] = useState(
    locationState?.selectedSubjectName || locationState?.subjects?.[0] || "",
  );
  const [activeResourceType, setActiveResourceType] = useState(
    locationState?.activeResourceType || "Videos",
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [coreTopics, setCoreTopics] = useState<TopicItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  // ── Resource data from API ──
  const [allMaterials, setAllMaterials] = useState<any[]>([]);
  const [availableFilters, setAvailableFilters] = useState<any>(null);
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(false);

  const resourceTypes = ["Videos", /* "Tests", */ "Notes"];
  const effectiveSubjectWisePlan = locationState?.subjectWisePlan || null;


  useEffect(() => {
    if (location.pathname.includes("teacher-videos")) {
      setActiveResourceType("Videos");
    } else if (location.pathname.includes("teacher-tests")) {
      setActiveResourceType("Tests");
    } else if (location.pathname.includes("teacher-notes")) {
      setActiveResourceType("Notes");
    }
  }, [location.pathname]);


  // Derive subjects list: prefer explicit `subjects` from location, otherwise use API subjects
  const subjects = useMemo(() => {
    if (locationState?.subjects) return locationState.subjects;
    if (availableFilters?.subjects) return availableFilters.subjects.map((s: any) => s.name);
    return [
      "Math",
      "Science",
      "History",
      "Civics",
      "Geography",
      "English Literature",
      "English Grammar",
      "Hindi Sahitya",
    ];
  }, [locationState?.subjects, availableFilters?.subjects]);

  // When API plan loads and no activeSubject selected, pick first subject
  useEffect(() => {
    if (!activeSubject && Array.isArray(effectiveSubjectWisePlan) && effectiveSubjectWisePlan.length > 0) {
      const first = effectiveSubjectWisePlan[0].subject_name || effectiveSubjectWisePlan[0].subject;
      if (first) setActiveSubject(first);
    }
  }, [effectiveSubjectWisePlan, activeSubject]);

  // Fetch Materials and Filters on Mount
  useEffect(() => {
    const fetchData = async () => {
      setIsResourcesLoading(true);
      try {
        const response = await ApiServices.getTeacherStudyMaterial();
        const result = response.data;
        if (result.status === "success") {
          setAllMaterials(result.data.data || []);
          setAvailableFilters(result.data.filters || null);

          const filters = result.data.filters;
          if (filters) {
            // Set options
            const boards = (filters.boards || []).map((b: any) => b.name);
            const classes = (filters.classes || []).map((c: any) => c.name);
            const subjects = (filters.subjects || []).map((s: any) => s.name);
            const sections = (filters.sections || []).map((s: any) => s.name);

            setBoardOptions(boards);
            setClassOptions(classes);
            setSubjectOptions(subjects);
            setSectionOptions(sections);

            // Default selections if not from location state
            if (!board && boards.length > 0) setBoard(boards[0]);
            if (!className && classes.length > 0) setClassName(classes[0]);
            if (!activeSubject && subjects.length > 0) setActiveSubject(subjects[0]);
            if (!section && sections.length > 0) setSection(sections[0]);
          }
        }
      } catch (error) {
        // console.error("Failed to fetch study materials:", error);
      } finally {
        setIsResourcesLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  // Filter materials based on current selection
  const filteredMaterialItems = useMemo(() => {
    if (!availableFilters) return [];

    let filtered = allMaterials;

    // Get IDs for selected names
    const selectedBoardId = availableFilters.boards?.find((b: any) => b.name === board)?.id;
    const selectedClassId = availableFilters.classes?.find((c: any) => c.name === className)?.id;
    const selectedSubjectId = availableFilters.subjects?.find((s: any) => s.name === activeSubject)?.id;
    const selectedSectionId = availableFilters.sections?.find((s: any) => s.name === section)?.id;

    if (selectedBoardId) {
      // items don't have board_id in the provided JSON, but if they did:
      // filtered = filtered.filter(m => m.board_id === selectedBoardId);
    }
    if (selectedClassId) {
      filtered = filtered.filter(m => m.class_id === selectedClassId);
    }
    if (selectedSubjectId) {
      filtered = filtered.filter(m => m.subject_id === selectedSubjectId);
    }
    if (selectedSectionId) {
      filtered = filtered.filter(m => m.section_id === selectedSectionId);
    }

    return filtered;
  }, [allMaterials, availableFilters, className, activeSubject, section]);

  // Derive youtubeLinks and studyMaterials from filtered items
  const dynamicYoutubeLinks = useMemo(() =>
    filteredMaterialItems
      .filter((m: any) => m.file_type === "link")
      .map((m: any) => ({
        title: m.title,
        url: m.resource,
        thumbnail: m.thumbnail,
      })),
    [filteredMaterialItems]
  );

  const dynamicStudyMaterials = useMemo(() =>
    filteredMaterialItems
      .filter((m: any) => m.file_type === "study_material" || m.file_type === "practice_material")
      .map((m: any) => ({
        ...m,
        file_url: m.resource // Ensure file_url is set for preview
      })),
    [filteredMaterialItems]
  );


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
  // when the active subject or plan changes, rebuild available chapters and reset selection
  useEffect(() => {
    if (
      !effectiveSubjectWisePlan ||
      !Array.isArray(effectiveSubjectWisePlan) ||
      !activeSubject
    ) {
      setChapters([]);
      setCoreTopics([]);
      setSelectedChapters([]);
      setSelectedTopics([]);
      return;
    }

    const selectedSubjectPlan = effectiveSubjectWisePlan.find(
      (plan: any) => plan.subject_name === activeSubject,
    );

    if (!selectedSubjectPlan?.chapters) {
      setChapters([]);
      setCoreTopics([]);
      setSelectedChapters([]);
      setSelectedTopics([]);
      return;
    }

    // transform and cache chapters for sidebar
    const transformedChapters: ChapterItem[] = selectedSubjectPlan.chapters.map(
      (chapter: any) => ({
        name: chapter.chapter_name,
        chapter_id: chapter.chapter_id,
        topics: chapter.topics || [],
      }),
    );
    setChapters(transformedChapters);

    // if we were given a chapter id from navigation state, initialize selection
    if (locationState?.selectedChapterId) {
      const idx = transformedChapters.findIndex(
        (ch) => ch.chapter_id === locationState.selectedChapterId,
      );
      if (idx !== -1) {
        setSelectedChapters([idx]);
      }
    } else {
      // otherwise start with no chapters selected – user will choose in sidebar
      setSelectedChapters([0]);
      // Also default select all topics for the first chapter on initial load
      const firstChapterTopics = transformedChapters[0]?.topics || [];
      setSelectedTopics(firstChapterTopics.map((_, i) => i));
    }
  }, [
    activeSubject,
    effectiveSubjectWisePlan,
    locationState?.selectedChapterId,
  ]);

  // Auto-select first chapter and its topics when switching resource tabs (Videos, Tests, Notes) if none are selected
  useEffect(() => {
    if (activeResourceType && chapters.length > 0 && selectedChapters.length === 0) {
      setSelectedChapters([0]);
      const firstChapterTopics = chapters[0]?.topics || [];
      setSelectedTopics(firstChapterTopics.map((_, i) => i));
    }
  }, [activeResourceType]);

  // whenever the chapter selection changes (or the chapter list itself), compute the core topic list
  useEffect(() => {
    if (selectedChapters.length === 0) {
      setCoreTopics([]);
      setSelectedTopics([]);
      return;
    }

    const topics: TopicItem[] = selectedChapters.flatMap((index) => {
      const ch = chapters[index];
      return (
        ch?.topics?.map((t: any) => ({
          name: t.topic_name || t.name,
          topic_id: t.topic_id,
        })) || []
      );
    });

    setCoreTopics(topics);

    // re-sync selectedTopics indices if they are out of range
    setSelectedTopics((prev) => prev.filter((i) => i < topics.length));
  }, [selectedChapters, chapters]);

  // if initial navigation state provided topic ids, map them to indices once topics list is available
  useEffect(() => {
    const selTopicIds = locationState?.selectedTopicIds || [];
    if (selTopicIds.length > 0 && coreTopics.length > 0) {
      const topicIndexes = coreTopics
        .map((topic, index) =>
          topic.topic_id !== undefined && selTopicIds.includes(topic.topic_id)
            ? index
            : -1,
        )
        .filter((index) => index !== -1);
      setSelectedTopics(topicIndexes);
    }
  }, [locationState?.selectedTopicIds, coreTopics]);
  // ── Fetch resources when chapter & topic are selected ──
  useEffect(() => {
    const fetchResources = async () => {
      // We need at least one selected chapter
      if (selectedChapters.length === 0) {
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
      const stats = locationState?.stats;
      const selectedSubjectPlan = effectiveSubjectWisePlan?.find(
        (plan: any) => plan.subject_name === activeSubject,
      );

      const payload = {
        board_id: stats?.board_id,
        institute_id: stats?.institute_id,
        class_id: stats?.class_id,
        // section may be used by newer APIs (name, id or both)
        section: section || undefined,
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
          // youtubeLinks are now handled dynamically from getTeacherStudyMaterial
        }
      } catch (error) {
        // console.error("Failed to fetch resources:", error);
      } finally {
        setIsResourcesLoading(false);
      }
    };

    fetchResources();
  }, [
    selectedChapters,
    selectedTopics,
    chapters,
    coreTopics,
    activeSubject,
    locationState?.stats,
    effectiveSubjectWisePlan,
    refreshTrigger, // Re-fetch on refresh
  ]);

  // Get subject_id and chapter_ids for Tests component
  // const getSubjectId = () => {
  //   if (!effectiveSubjectWisePlan || !activeSubject) return undefined;
  //   const selectedSubjectPlan = effectiveSubjectWisePlan.find(
  //     (plan: any) => plan.subject_name === activeSubject,
  //   );
  //   return selectedSubjectPlan?.subject_id;
  // };

  // const getSelectedChapterIds = () => {
  //   if (selectedChapters.length === 0) return null;
  //   const chapterIds = selectedChapters
  //     .map((index) => chapters[index]?.chapter_id)
  //     .filter((id) => id !== undefined) as number[];
  //   return chapterIds.length > 0 ? chapterIds : null;
  // };

  // const getSelectedChapterNames = () => {
  //   if (selectedChapters.length === 0) return [];
  //   return selectedChapters
  //     .map((index) => chapters[index]?.name)
  //     .filter((name) => name !== undefined) as string[];
  // };

  // const getClassId = () => {
  //   if (locationState?.stats?.class_id) return locationState.stats.class_id;
  //   return availableFilters?.classes?.find((c: any) => c.name === className)?.id;
  // };

  return (
    <div className="min-h-screen">
      <div className="flex gap-6">
        <MaterialsSidebar
          board={board}
          className={className}
          section={section}
          boardOptions={boardOptions}
          classOptions={classOptions}
          sectionOptions={sectionOptions}
          setBoard={setBoard}
          setClassName={setClassName}
          setSubject={setActiveSubject}
          setSection={setSection}
          activeSubject={activeSubject}
          subjectOptions={subjectOptions}
          chapters={chapters}
          coreTopics={coreTopics}
          selectedChapters={selectedChapters}
          setSelectedChapters={setSelectedChapters}
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
            onRefresh={handleRefresh}
            isRefreshing={isResourcesLoading}
          />

          <div className="pr-6">
            {activeResourceType === "Videos" && (
              <ResourceMaterials
                youtubeLinks={dynamicYoutubeLinks}
                isLoading={isResourcesLoading}
              />
            )}
            {/* {activeResourceType === "Tests" && (
              <Tests
                subjectId={getSubjectId()}
                subjectName={activeSubject}
                chapterIds={getSelectedChapterIds()}
                chapterNames={getSelectedChapterNames()}
                allChapters={chapters}
                allTopics={coreTopics}
                topicIds={selectedTopics
                  .map((i) => coreTopics[i]?.topic_id)
                  .filter((id): id is number => id !== undefined)}
                topicNames={selectedTopics
                  .map((i) => coreTopics[i]?.name)
                  .filter((name): name is string => name !== undefined)}
                classIds={getClassId() ? [getClassId()] : []}
                stats={locationState?.stats}
              />
            )} */}
            {activeResourceType === "Notes" && (
              <Notes
                studyMaterials={dynamicStudyMaterials}
                isLoading={isResourcesLoading}
              />
            )}
          </div>
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

export default TeacherMaterials;
