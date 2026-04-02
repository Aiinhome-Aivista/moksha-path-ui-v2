import React from "react";
import { Loader2 } from "lucide-react";

interface Props {
    board: string;
    className: string;
    section?: string;

    boardOptions?: string[];
    classOptions?: string[];
    subjectOptions?: string[];
    sectionOptions?: string[];

    setBoard?: (v: string) => void;
    setClassName?: (v: string) => void;
    setSubject?: (v: string) => void;
    setSection?: (v: string) => void;

    activeSubject: string;
    isLoading?: boolean;
}

const MaterialsSidebar: React.FC<Props> = ({
    board,
    className,
    //section,
    boardOptions,
    classOptions,
    //sectionOptions,
    setBoard,
    setClassName,
    //setSection,
    activeSubject: subject, // Renamed for clarity in sidebar logic
    subjectOptions,
    setSubject,
    isLoading,
}) => {



    return (
        <div className="w-[280px] flex-shrink-0">
            {/* Tutor Image */}
            <div className="flex justify-start mb-2">
                <img src="/Guy.svg" alt="Tutor" />
            </div>

            {/* Filters */}
            <div className="flex gap-2 w-64 flex-col">
                {/* Board */}
                <div className="relative">
                    <p className="text-sm font-semibold text-gray-800 mb-1"> Choose Your Board</p>
                    <div className="w-full flex items-center pb-2 border-b border-gray-300 text-sm font-medium">
                        {setBoard && boardOptions ? (
                            <select
                                value={board}
                                onChange={(e) => setBoard(e.target.value)}
                                className="text-sm"
                            >
                                {boardOptions.map((b) => (
                                    <option key={b} value={b}>
                                        {b}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="text-gray-700">{board}</span>
                        )}
                    </div>
                </div>

                {/* Class */}
                <div className="relative">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Choose Class / Standard</p>
                    <div className="w-full flex items-center pb-2 border-b border-gray-300 text-sm font-medium">
                        {setClassName && classOptions ? (
                            <select
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                className="text-sm"
                            >
                                {classOptions.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="text-gray-700">{className}</span>
                        )}
                    </div>
                </div>

                {/* Subject */}
                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 z-1 flex items-center justify-center bg-white/60">
                             <Loader2 size={24} className="animate-spin text-primary" />
                        </div>
                    )}
                    <p className="text-sm font-semibold text-gray-800 mb-1">Choose Subject</p>
                    <div className="w-full flex items-center pb-2 border-b border-gray-300 text-sm font-medium">
                        {setSubject && subjectOptions ? (
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="text-sm bg-white focus:outline-none"
                            >
                                {subjectOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="text-gray-700">{subject}</span>
                        )}
                    </div>
                </div>

                {/* Section (optional) */}
                {/* {setSection && sectionOptions && (
                    <div className="relative">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Choose your Section</p>
                        <div className="w-full flex items-center pb-2 border-b border-gray-300 text-sm font-medium">
                            <select
                                value={section || ""}
                                onChange={(e) => setSection(e.target.value)}
                                className="text-sm bg-white"
                            >
                                <option value="">All</option>
                                {sectionOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )} */}

                {/* Difficulty */}
                {/* <div className="relative">
                    <p className="text-xs text-gray-500 mb-1">Difficulty Level</p>
                    <button
                        onClick={() => {
                            setOpenDifficulty(!openDifficulty);
                        }}
                        className="w-full flex justify-between items-center pb-2 border-b border-gray-300 text-sm font-medium"
                    >
                        <span>{difficulty}</span>
                        <ChevronDown size={16} />
                    </button>

                    {openDifficulty && (
                        <div className="absolute z-10 mt-2 w-full bg-white shadow-md rounded-md">
                            {["Easy", "Medium", "Difficult"].map((item) => (
                                <div
                                    key={item}
                                    onClick={() => {
                                        setDifficulty(item);
                                        setOpenDifficulty(false);
                                    }}
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div> */}
            </div>





        </div>
    );
};

export default MaterialsSidebar;
