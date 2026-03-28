import React, { useState } from "react";
import {
  StickyNote,
  ChevronDown,
  ChevronUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  Link as LinkIcon,
  X,
} from "lucide-react";

export interface NoteData {
  topic_id: number;
  topic_title: string;
  content: any; // Can be string, array, or object
}

export interface StudyMaterialItem {
  id: number;
  title: string;
  file_name: string | null;
  file_type: string; // "study_material" | "practice_material" | "link"
  file_url: string | null;
  link_url: string | null;
  resource: string;
  section_id: number;
  uploaded_at: string;
  uploaded_by: number;
}

interface NotesProps {
  notes?: NoteData[];
  studyMaterials?: StudyMaterialItem[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 8;

// Build full URL for file downloads
const getFullResourceUrl = (resource: string): string => {
  if (!resource) return "#";
  // If already a full URL (link type), return as-is
  if (resource.startsWith("http://") || resource.startsWith("https://")) {
    return resource;
  }
  // For file uploads, prepend the API base URL (without /api/v1/)
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  // Remove trailing /api/v1/ to get the domain
  const domainUrl = baseUrl.replace(/\/api\/v1\/?$/, "");
  return `${domainUrl}${resource}`;
};

// Get icon for file type
const getFileIcon = (item: StudyMaterialItem) => {
  if (item.file_type === "link") {
    return <LinkIcon size={18} className="text-blue-500" />;
  }
  const fileName = item.file_name || item.resource || "";
  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    return <FileSpreadsheet size={18} className="text-green-600" />;
  }
  return <FileText size={18} className="text-red-500" />;
};

// Get badge color for file type
const getTypeBadge = (fileType: string) => {
  switch (fileType) {
    case "study_material":
      return {
        label: "Study Material",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    case "practice_material":
      return {
        label: "Practice Material",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      };
    case "link":
      return {
        label: "External Link",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      };
    default:
      return {
        label: fileType,
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      };
  }
};

// Format date
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// Recursively render note content in a readable format
const RenderNoteContent: React.FC<{ data: any; depth?: number }> = ({
  data,
  depth = 0,
}) => {
  if (typeof data === "string") {
    // Handle bold text indicated by ** markers
    const parts = data.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p className="text-sm text-gray-700 leading-relaxed">
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  }

  if (Array.isArray(data)) {
    // Different list styles based on depth
    const getBulletStyle = (lvl: number) => {
      if (lvl === 0) return "list-disc"; // Main level: •
      if (lvl === 1) return "list-circle"; // Sub level: ◦
      return "list-square"; // Deep level: ▪
    };

    return (
      <ul
        className={`space-y-2 ${getBulletStyle(depth)} list-inside ${depth > 0 ? "ml-4" : ""}`}
      >
        {data.map((item, i) => (
          <li
            key={i}
            className={`text-gray-700 leading-relaxed ${
              depth === 0 ? "text-sm font-medium" : "text-sm"
            }`}
          >
            {typeof item === "string" ? (
              <>
                {item.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={idx}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </>
            ) : typeof item === "object" ? (
              <RenderNoteContent data={item} depth={depth + 1} />
            ) : (
              String(item)
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof data === "object" && data !== null) {
    return (
      <div className={`space-y-4 ${depth > 0 ? "ml-2" : ""}`}>
        {Object.entries(data).map(([key, value]) => {
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          // Skip class/title since we show those in the header
          if (key === "class" || key === "title") return null;

          const isMainSection = depth === 0;

          return (
            <div key={key} className={isMainSection ? "mb-4" : "mb-3"}>
              <h4
                className={`font-bold mb-2 tracking-widest ${
                  isMainSection
                    ? "text-xs text-gray-900 uppercase border-b-2 border-[#F27927] pb-2"
                    : "text-xs text-gray-800 uppercase"
                }`}
              >
                {label}
              </h4>
              <div
                className={
                  isMainSection ? "pl-0" : "pl-3 border-l-2 border-gray-300"
                }
              >
                <RenderNoteContent data={value} depth={depth + 1} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <p className="text-sm text-gray-700">{String(data)}</p>;
};

// ── Study Materials Card Component ──
const StudyMaterialCard: React.FC<{
  item: StudyMaterialItem;
  onClick: (item: StudyMaterialItem) => void;
}> = ({ item, onClick }) => {
  const badge = getTypeBadge(item.file_type);
  const isLink = item.file_type === "link";

  return (
    <div
      onClick={() => onClick(item)}
      className="group block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-[#F27927]/40 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-orange-50 flex items-center justify-center flex-shrink-0 transition-colors">
          {getFileIcon(item)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-800 truncate m-0 mb-1">
            {item.title}
          </h4>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Type badge */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {badge.label}
            </span>

            {/* File name (if different from title) */}
            {item.file_name && item.file_name !== item.title && (
              <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                {item.file_name}
              </span>
            )}

            {/* Date */}
            {item.uploaded_at && (
              <span className="text-[10px] text-gray-400">
                {formatDate(item.uploaded_at)}
              </span>
            )}
          </div>

          {/* Link URL preview for link type */}
          {isLink && item.link_url && (
            <p className="text-[11px] text-blue-500 truncate mt-1 m-0">
              {item.link_url}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Document Preview Modal ──
const DocumentPreviewModal: React.FC<{
  item: StudyMaterialItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  if (!item) return null;

  const resourceUrl = getFullResourceUrl(item.resource);
  const isExcel =
    item.file_name?.endsWith(".xlsx") || item.file_name?.endsWith(".xls");

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {getFileIcon(item)}
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-800 truncate m-0">
                {item.title}
              </h3>
              {item.file_name && item.file_name !== item.title && (
                <p className="text-xs text-gray-400 truncate m-0">
                  {item.file_name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {isExcel ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <FileSpreadsheet size={48} className="text-green-600" />
              <p className="text-sm text-gray-600 font-medium">
                Excel files cannot be previewed directly.
              </p>
              <a
                href={resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#F27927] text-white rounded-lg text-sm font-semibold no-underline hover:bg-[#d96820] transition-colors"
              >
                Open in New Tab
              </a>
            </div>
          ) : (
            <iframe
              src={resourceUrl}
              title={item.title}
              className="w-full h-full border-none bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Notes: React.FC<NotesProps> = ({
  notes = [],
  studyMaterials = [],
  isLoading = false,
}) => {
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<StudyMaterialItem | null>(null);

  const toggleNote = (topicId: number) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  // Pagination Logic
  const totalPages = Math.ceil(notes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotes = notes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Separate study materials by type
  const studyMats = studyMaterials.filter(
    (m) => m.file_type === "study_material",
  );
  const practiceMats = studyMaterials.filter(
    (m) => m.file_type === "practice_material",
  );

  const hasStudyMaterials = studyMats.length > 0 || practiceMats.length > 0;
  const hasNotes = notes.length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3" />
        <p className="text-sm font-medium">Loading notes...</p>
      </div>
    );
  }

  if (!hasNotes && !hasStudyMaterials) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <StickyNote size={40} className="mb-3 opacity-50" />
        <p className="text-sm font-medium">No notes available</p>
        <p className="text-xs mt-1">
          Select a chapter and topic from the sidebar to load notes
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Study Materials Section (from get_study_material API) ── */}
      {hasStudyMaterials && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-[#F27927]" />
            <h2 className="text-lg font-semibold text-gray-800">
              Study Materials
            </h2>
            <span className="text-xs bg-orange-50 text-[#F27927] px-2 py-0.5 rounded-full font-medium">
              {studyMaterials.length} files
            </span>
          </div>

          {/* Study Material */}
          {studyMats.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                📚 Study Material
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {studyMats.map((item) => (
                  <StudyMaterialCard key={item.id} item={item} onClick={setPreviewItem} />
                ))}
              </div>
            </div>
          )}

          {/* Practice Material */}
          {practiceMats.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                📝 Practice Material
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {practiceMats.map((item) => (
                  <StudyMaterialCard key={item.id} item={item} onClick={setPreviewItem} />
                ))}
              </div>
            </div>
          )}

          {/* Divider between study materials and notes */}
          {hasNotes && (
            <div className="border-t border-gray-200 mt-6 mb-6" />
          )}
        </div>
      )}

      {/* ── AI-Generated Notes Section (existing) ── */}
      {hasNotes && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <StickyNote size={20} className="text-[#F27927]" />
              <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {notes.length} notes
              </span>
            </div>

            {/* Page indicator */}
            {totalPages > 1 && (
              <span className="text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          <div className="space-y-4 min-h-[500px]">
            {currentNotes.map((note) => {
              const isExpanded = expandedNotes.has(note.topic_id);

              return (
                <div
                  key={note.topic_id}
                  className="bg-white rounded-lg border-l-4 border-l-[#F27927] border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Header - clickable */}
                  <button
                    onClick={() => toggleNote(note.topic_id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <StickyNote size={20} className="text-[#F27927]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-gray-800">
                          {note.topic_title}
                        </h3>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp
                        size={20}
                        className="text-[#F27927] flex-shrink-0"
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="text-gray-400 flex-shrink-0"
                      />
                    )}
                  </button>

                  {/* Expandable content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-200 bg-gray-50">
                      <div className="pt-4">
                        <RenderNoteContent data={note.content} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 mb-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#F27927]"
                }`}
                title="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                        currentPage === page
                          ? "bg-[#F27927] text-white shadow-md shadow-orange-100"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
                  currentPage === totalPages
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#F27927]"
                }`}
                title="Next Page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
};

export default Notes;
