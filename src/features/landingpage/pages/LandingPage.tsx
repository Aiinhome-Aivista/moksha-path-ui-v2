// // 
// import React, { useEffect, useState } from "react";
// import "./Landing.css";
// // import HeroImg from "../../../assets/icon/herosection.svg";
// import GuyImg from "../../../assets/icon/guy.svg";
// import IcoSearch from "../../../assets/icon/ico_search.svg";
// import IcoMenu from "../../../assets/icon/ico_menu.svg";
// import CbseIcon from "../../../assets/icon/cbsc.svg";
// import IcseIcon from "../../../assets/icon/icse.svg";
// import NiosIcon from "../../../assets/icon/nios.svg";
// import WbseIcon from "../../../assets/icon/wbse.svg";
// import CaieIcon from "../../../assets/icon/caie.svg";
// import IconPlan from "../../../assets/icon/group4.svg";
// import IconChat from "../../../assets/icon/chat2.svg";
// import Chat from "../../auth/modal/chat";
// import Layer_school from "../../../assets/icon/Layer_school.svg";
// // import HeroRobot from "../../../assets/icon/hero.svg";
// import Frame from "../../../assets/icon/Frame.svg";
// import Close_comma from "../../../assets/icon/Close_comma.svg";
// import Start_comma from "../../../assets/icon/Start_comma.svg";
// import Safety from "../../../assets/icon/Safety.svg";
// import Safety_arrow from "../../../assets/icon/Safety_arrow.svg";
// import Safety_light from "../../../assets/icon/Safety_light.svg";
// import Safety_meet from "../../../assets/icon/Safety_meet.svg";
// import Safety_privacy from "../../../assets/icon/Safety_privacy.svg";
// import subscription_model from "../../../assets/icon/subscription_model.svg";
// import who_landing from "../../../assets/icon/who_landing.svg";
// import knowledgehub_landing from "../../../assets/icon/knowledgehub_landing.svg";
// import Testimonials_landing from "../../../assets/icon/Testimonials_landing.svg";
// import Glance_landing from "../../../assets/icon/Glance_landing.svg";
// import carousel_landing1 from "../../../assets/icon/carousel_landing1.svg";
// import carousel_landing2 from "../../../assets/icon/carousel_landing2.svg";
// import carousel_landing3 from "../../../assets/icon/carousel_landing3.svg";
// import carousel_landing4 from "../../../assets/icon/carousel_landing4.svg";
// import carousel_landing5 from "../../../assets/icon/carousel_landing5.svg";
// import carousel_landing6 from "../../../assets/icon/carousel_landing6.svg";
// import carousel_landing7 from "../../../assets/icon/carousel_landing7.svg";

// interface FeatureCardProps {
//   icon: string;
//   title: string;
//   working: boolean;
//   desc: string;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({
//   icon,
//   title,
//   working,
//   desc,
// }) => {
//   return (
//     <div
//       className={`flex flex-col items-center text-center px-0 py-0${
//         working ? "" : "opacity-50 grayscale"
//       }`}
//     >
//       {/* Icon Container with specific spacing */}
//       <div className="mb-1 flex justify-center">
//         <img
//           src={icon}
//           alt={title}
//           className="w-16 h-auto object-contain mx-auto"
//         />
//       </div>
//       <h4 className="font-['Montserrat'] font-bold text-[18px] leading-[20px] tracking-[.02em] text-center max-w-[160px] min-h-[56px] text-primary mb-1 mx-auto flex items-center justify-center">
//         {title}
//       </h4>
//       <p className="font-['Montserrat'] font-normal text-base leading-[20px] tracking-[.02em] text-center max-w-[200px] text-primary mx-auto">
//         {desc}
//       </p>
//     </div>
//   );
// };

// const features = [
//   {
//     id: 1,
//     title: "AI powered Self Evaluation",
//     working: true,
//     icon: IconPlan,
//     desc: "Skills added, AI evaluates via adaptive parameters.",
//   },
//   {
//     id: 2,
//     title: "Smart Learning Plans",
//     working: true,
//     icon: IconPlan,
//     desc: "Auto-generates daily, structured, achievable study plans.",
//   },
//   {
//     id: 3,
//     title: "Progress & Completion Tracking",
//     working: true,
//     icon: IconPlan,
//     desc: "Track topics, tests, progress—know your standing.",
//   },
//   {
//     id: 4,
//     title: "AI Learning Assistant",
//     working: true,
//     icon: IconPlan,
//     desc: "Proactive AI guide: reminders, answers, priority focus.",
//   },
//   {
//     id: 5,
//     title: "Board-Specific Curriculum",
//     working: true,
//     icon: IconPlan,
//     desc: "Clear explanatory text for feature understanding.",
//   },
//   {
//     id: 6,
//     title: "Role-Based Dashboards",
//     working: true,
//     icon: IconPlan,
//     desc: "Role-based dashboards: students, parents, teachers, institutions.",
//   },
// ];

// export default function LandingPage() {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const sections = [
//     "section1",
//     "section2",
//     "section3",
//     "section4",
//     "section5",
//     "section6",
//     "section7",
//     "section8",
//     "section9",
//     "section10",
//     "section11"
//   ];
//   const [active, setActive] = useState(0);

//   // 2️⃣ Scroll to section when dot clicked
//   const scrollToSection = (index: number) => {
//     const element = document.getElementById(sections[index]);
//     if (element) {
//       window.scrollTo({
//         top: element.getBoundingClientRect().top + window.pageYOffset - 100,
//         behavior: "smooth",
//       });
//     }
//     setActive(index);
//   };

//   // 3️⃣ Detect active section while scrolling
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPos = window.scrollY;

//       sections.forEach((id, index) => {
//         const element = document.getElementById(id);

//         if (element) {
//           const offsetTop = element.offsetTop - 200;
//           const height = element.offsetHeight;

//           if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
//             setActive(index);
//           }
//         }
//       });
//     };
//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   const carouselLogos = [
//     carousel_landing1,
//     carousel_landing2,
//     carousel_landing3,
//     carousel_landing4,
//     carousel_landing5,
//     carousel_landing6,
//     carousel_landing7,
//   ];
//   return (
//     <div className="overflow-x-hidden bg-gray-100">
//       {/* 4️⃣ Right Side Navigation Dots */}
//       <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
//         {sections.map((_, index) => (
//           <div
//             key={index}
//             onClick={() => scrollToSection(index)}
//             className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
//               active === index ? "bg-lime-500 scale-125" : "bg-gray-400"
//             } `}
//           />
//         ))}
//       </div>

//       {/* CHAT ICON BUTTON */}
//       <div
//         className="fixed right-[1%] top-[80%] -translate-y-1/2 z-[100] cursor-pointer hover:scale-105 transition-transform"
//         onClick={() => setIsChatOpen(true)}
//       >
//         <img src={IconChat} alt="Chat" className="w-[95px]" />
//       </div>

//       {/* RENDER MODAL CONDITIONALLY */}
//       {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}

//       {/* ════════════════════════════════════════════════════════════════════
//           1. HEADER / HERO SECTION (SPLIT LAYOUT WITH GRAY BACKGROUND)
//       ════════════════════════════════════════════════════════════════════ */}
//       <header
//         id="section1"
//         /* REMOVED overflow-hidden so the robot's head doesn't get cut off */
//         // ADDED pt-12 (padding-top) here 👇
//         className="relative font-['Montserrat'] w-full max-w-full mx-auto "
//       >
//         {/* Large Gray Rounded Container - Added back bg color and rounded corners */}
//         {/* Main content area acting as a stacking context */}
//         <div className="relative w-full h-[750px]">
//           {" "}
//           {/* Reduced height for the visual area */}
//           {/* HeroImg as background, covering the entire area */}
//           <img
//             src={Frame}
//             alt="From Learning Facts to Leading Minds"
//             className="absolute inset-0 w-full h-100% object-cover z-0" // Covers the entire div
//           />
//         </div>
//       </header>

//       {/* 2. DEMO BUTTON, SEARCH BAR & FEATURES GRID CONTAINER */}

//       <section
//         id="section2"
//         className="relative mb-20 scroll-mt-24 z-20 -mt-[60px] md:-mt-[140px] lg:-mt-[260px] xl:-mt-[340px] flex flex-col items-center"
//       >
//         {/* Demo Button & Search Bar Row */}
//         <div className="w-auto flex flex-col md:flex-row items-center justify-center gap-4 px-4 mb-16 lg:mb-20">
//           {/* <button className="bg-[#BADA55] hover:bg-lime-500 text-gray-800 px-8 py-3 rounded-full text-base lg:text-lg font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap">
//             Try a Demo
//           </button> */}

//           <div className="relative w-full md:w-[500px] lg:w-[600px] h-[55px] lg:h-[60px]">
//             <img
//               src={IcoMenu}
//               alt="Menu"
//               className="absolute left-6 top-1/2 -translate-y-1/2 w-[18px] cursor-pointer opacity-60 z-20"
//             />
//             <input
//               type="text"
//               placeholder="Search by Learning Videos, Tests, Study Notes, Assessments, etc ..."
//               className="w-full h-full pr-[60px] pl-[55px] rounded-full border-none shadow-[0_4px_25px_rgba(0,0,0,0.08)] outline-none text-sm text-gray-700 focus:ring-2 focus:ring-[#BADA55]/40 transition-all bg-white"
//             />
//             <div className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white shadow-sm rounded-full">
//               <img
//                 src={IcoSearch}
//                 alt="Search"
//                 className="w-5 h-5 opacity-70"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Features Area Wrapper to contain the background line properly */}
//         <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-20">
//           <div className="relative">
//             {/* Dashed Line Background for Features Grid (positioned relative to the grid now) */}
//             <div className="absolute top-[35px] left-[8.33%] right-[8.33%] border-t-2 border-dashed border-[#d1d5db] z-0 hidden lg:block" />

//             {/* Features Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-4 relative z-10">
//               {features.map((f) => (
//                 <FeatureCard key={f.id} {...f} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 3. Why MokshPath */}

//       <section id="section3" className="w-full bg-gray-100 py-20">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 xl:gap-32 items-center">
//           {/* LEFT IMAGE */}
//           <div className="flex justify-center lg:justify-start">
//             <img
//               src={Layer_school}
//               alt="School Illustration"
//               className="w-[420px] max-w-full"
//             />
//           </div>

//           {/* RIGHT CONTENT */}
//           <div className="relative col-span-2">
//             <div className="relative">
//               {/* LEFT QUOTE */}
//               <img
//                   src={Start_comma}
//                   alt="Start Quote"
//                   className="absolute -left-32 -top-6 w-32 h-auto inline-block"
//                 />

//               {/* TITLE */}
//               <span className="text-center text-4xl md:text-5xl lg:text-[60px] font-bold text-gray-700 leading-tight">
//                 Why MokshPath
//               </span>
//               <br />
//               <span className="text-center text-4xl md:text-5xl lg:text-[60px] font-bold text-gray-700 leading-tight">
//                 for Your School?
//               </span>

//               {/* RIGHT QUOTE */}
//               <img
//                   src={Close_comma}
//                   alt="end Quote"
//                   className="absolute right-44 top-4 w-28 h-auto inline-block"
//                 />
//             </div>

//             {/* DESCRIPTION */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6 text-gray-600">
//               <p className="font-bold col-span-2 leading-7 tracking-widest track">
//                 Educational excellence is not just about grades, it’s about
//                 understanding how students think.
//               </p>

//               <p className="text-sm col-span-2 leading-relaxed">
//                 This platform enables personalised evaluation, structured
//                 feedback, and supports future-ready subsidiary programmes as
//                 schools grow.
//               </p>
//             </div>

//             {/* FEATURES GRID */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-10 text-sm">
//               <div>
//                 <h4 className="font-semibold text-gray-700">
//                   Eliminate Malpractice
//                 </h4>
//                 <p className="text-gray-500 mt-1">
//                   The AI engine delivers a unique question sequence for every
//                   student.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-700">
//                   Identify “Hidden” Gaps
//                 </h4>
//                 <p className="text-gray-500 mt-1">
//                   Analytics classify errors as conceptual, careless, or
//                   time-management issues.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-700">
//                   Empower Teachers
//                 </h4>
//                 <p className="text-gray-500 mt-1">
//                   Guide AI with instructional hints to generate concept-driven
//                   questions.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-700">
//                   Automated Remediation
//                 </h4>
//                 <p className="text-gray-500 mt-1">
//                   Create targeted remedial tests from each student's error
//                   patterns.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-700">
//                   Global Standards
//                 </h4>
//                 <p className="text-gray-500 mt-1">
//                   Assessments aligned to Bloom’s Taxonomy for academic rigor.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 4. BOTTOM SECTION: TEXT + COLORED BUBBLES + GUY */}

//       <section
//         id="section4"
//         className="flex flex-col lg:flex-row items-center justify-center w-full pb-[50px] gap-10 mt-[50px] scroll-mt-24"
//       >
//         {/* Left Content */}
//         <div className="flex-1 text-center lg:text-left pt-2 pl-4 lg:pl-[50px]">
//           <h2 className="relative font-['Montserrat'] font-bold text-[55px] leading-[55px] tracking-[0.02em] text-primary ml-12">
//             {/* Opening Quote */}
//             <span className="absolute -left-[100px] -top-[-25px] font-['Montagu_Slab'] font-bold text-[200px] leading-[66px] tracking-[0.04em] opacity-80 select-none">
//               “
//             </span>

//             <span className="block">Built</span>
//             <span className="block">around your</span>
//             <span className="block">school</span>
//             {/* Closing Quote Wrapper */}
//             <span className="block relative w-max">
//               curriculum
//               <span className="absolute left-[100%] -top-[-25px] font-['Montagu_Slab'] font-bold text-[200px] leading-[66px] tracking-[0.04em] opacity-80 select-none">
//                 ”
//               </span>
//             </span>
//           </h2>
//           <p className="mt-2 font-['Montserrat'] font-normal text-[18px] leading-[30px] tracking-[0.10em] text-primary max-w-[350px] mx-auto lg:ml-[50px]">
//             Our learning plans are intelligently mapped to official academic
//             calendars, ensuring the right pace and structure for each education
//             board.
//           </p>
//         </div>

//         {/* Middle: Colored Board Bubbles */}
//         <div className="relative w-[350px] h-[350px] flex-shrink-0">
//           <div className="absolute left-[8%] bottom-[58%] w-[80px]">
//             <img src={CbseIcon} alt="CBSE" className="w-full h-auto " />
//           </div>

//           <div className="absolute left-[26%] bottom-[45%] w-[120px]">
//             <img src={IcseIcon} alt="ICSE" className="w-full h-auto" />
//           </div>

//           <div className="absolute bottom-[68%] left-[55%] w-[70px]">
//             <img src={NiosIcon} alt="NIOS" className="w-full h-auto" />
//           </div>

//           <div className="absolute bottom-[60%] left-[80%] w-[85px]">
//             <img src={WbseIcon} alt="WBSE" className="w-full h-auto" />
//           </div>

//           <div className="absolute bottom-[45%] left-[58%] w-[100px]">
//             <img src={CaieIcon} alt="CAIE" className="w-full h-auto" />
//           </div>

//           {/* BOTTOM TEXT */}
//           <div className="relative w-[550px] h-[320px] mx-auto mt-10">
//             <div className="absolute pt-14 left-1/2 -translate-x-1/2 w-full flex justify-center p-0 m-0">
//               <div className="text-left pt-40">
//                 <p className="font-['Montserrat'] font-bold text-[20px] leading-[32px] tracking-[0.14em] text-primary">
//                   <span className="block">Different boards.</span>
//                   <span className="block">Different timelines.</span>
//                   <span className="block">One intelligent system.</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right: Guy with Orange Background */}
//         <div className="flex-1 flex justify-end relative lg:mt-0 items-end">
//           <img
//             src={GuyImg}
//             alt="Student"
//             className="relative z-20 w-[800px] max-w-full h-auto"
//           />
//         </div>
//       </section>

//       {/* 5. Technical Reliability & Safety */}
//       <section
//         id="section5"
//         className="flex flex-col lg:flex-row items-center justify-center w-full pb-[50px] gap-10 mt-[50px] scroll-mt-24"
//       >
//         <div className="min-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-center">
//           {/* LEFT IMAGE */}
//           <div className="flex justify-center">
//             <img src={Safety} alt="Security" className="max-w-[35rem] w-fit" />
//           </div>

//           {/* RIGHT CONTENT */}
//           <div className="col-span-2">
//             {/* TITLE */}
//             <div className="relative mb-10">
//               <div className="flex">
//                 <img
//                   src={Start_comma}
//                   alt="Start Quote"
//                   className="absolute -left-36 -top-6 w-32 h-auto inline-block"
//                 />
//                 <h2 className="text-5xl font-bold text-[#464646] leading-tight">
//                   Technical
//                 </h2>
//               </div>
//               <div className="flex gap-4">
//                 <span className="text-5xl font-bold text-[#464646] leading-tight">
//                   Reliability & Safety
//                 </span>
//                 <img
//                   src={Close_comma}
//                   alt="End Quote"
//                   className="w-20 h-auto inline-block"
//                 />
//               </div>
//             </div>

//             {/* FEATURES */}
//             <div className="grid grid-cols-2 gap-28 gap-y-8">
//               <div className="flex gap-4 w-60">
//                 <img
//                   src={Safety_light}
//                   alt="Safety Light"
//                   className="w-12 h-auto"
//                 />
//                 <div>
//                   <h4 className="font-semibold text-[#464646]">
//                     Lightning Fast
//                   </h4>
//                   <p className="text-sm text-[#464646] leading-relaxed tracking-widest">
//                     The adaptive engine serves the next question in under 1.5
//                     seconds, even on low bandwidth.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-4 w-60">
//                 <img
//                   src={Safety_arrow}
//                   alt="Scalability"
//                   className="w-12 h-auto"
//                 />
//                 <div>
//                   <h4 className="font-semibold text-[#464646]">
//                     High Scalability
//                   </h4>
//                   <p className="text-sm text-[#464646] leading-relaxed tracking-widest">
//                     Supports concurrent usage spikes for large-scale National
//                     Olympiads.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-4 w-60">
//                 <img
//                   src={Safety_privacy}
//                   alt="Privacy"
//                   className="w-12 h-auto"
//                 />
//                 <div>
//                   <h4 className="font-semibold text-[#464646]">
//                     Privacy First
//                   </h4>
//                   <p className="text-sm text-[#464646] leading-relaxed tracking-widest">
//                     Fully compliant with GDPR and COPPA; student data for
//                     regulatory bodies is strictly anonymised.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-4 w-60">
//                 <img
//                   src={Safety_meet}
//                   alt="Reliability"
//                   className="w-12 h-auto"
//                 />

//                 <div>
//                   <h4 className="font-semibold text-[#464646]">
//                     Inclusive Design
//                   </h4>
//                   <p className="text-sm text-[#464646] leading-relaxed tracking-widest">
//                     Platform meets WCAG 2.1 AA standards to ensure accessibility
//                     for all learners.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 6. Subscription Model */}
//       <section
//         id="section6"
//         className="flex flex-col lg:flex-row items-center justify-center w-full pb-[50px] gap-10 mt-[50px] scroll-mt-24"
//       >
//         <div className="min-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-center">
//           {/* LEFT CONTENT */}
//           <div className="col-span-2">
//             <div className="grid grid-cols-2 gap-4 mb-10">
//               {/* TITLE */}
//               <div className="relative mb-8">
//                 <img
//                   src={Start_comma}
//                   alt="Start Quote"
//                   className="absolute -left-24 -top-6 w-24 h-auto inline-block"
//                 />
//                 <h2 className="text-5xl font-bold text-[#464646]">
//                   Subscription <br /> Model
//                 </h2>
//                 <img
//                   src={Close_comma}
//                   alt="End Quote"
//                   className="absolute right-40 bottom-0 w-16 h-auto inline-block"
//                 />
//               </div>

//               {/* DESCRIPTION */}
//               <p className="text-gray-600 max-w-72 mb-10 leading-relaxed tracking-tight">
//                 We offer tiered pricing designed to scale with your
//                 institution's size and customization needs.
//               </p>
//             </div>
//             {/* TABLE */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left border-collapse">
//                 <thead>
//                   <tr className="text-[#464646] font-semibold text-lg border-b">
//                     <th className="py-3">Feature</th>
//                     <th className="py-3">Silver Tier</th>
//                     <th className="py-3">Gold Tier</th>
//                     <th className="py-3">Enterprise</th>
//                   </tr>
//                 </thead>

//                 <tbody className="text-gray-600">
//                   <tr className="border-b">
//                     <td className="py-3 font-semibold">Best For</td>
//                     <td>Standard Board Prep</td>
//                     <td>Custom School Needs</td>
//                     <td>Large School Networks</td>
//                   </tr>

//                   <tr className="border-b">
//                     <td className="py-3 font-semibold">Content Generation</td>
//                     <td>General Boards (CBSE/ICSE)</td>
//                     <td>Custom AI Fine-Tuning</td>
//                     <td>Bespoke Syllabus Integration</td>
//                   </tr>

//                   <tr className="border-b">
//                     <td className="py-3 font-semibold">Style Sync</td>
//                     <td>Standard Templates</td>
//                     <td>Learns School Teaching Style</td>
//                     <td>Full Brand White Labelling</td>
//                   </tr>

//                   <tr className="border-b">
//                     <td className="py-3 font-semibold">Analytics</td>
//                     <td>Standard Reporting</td>
//                     <td>Deep Pattern Analysis</td>
//                     <td>Regulatory Reporting</td>
//                   </tr>

//                   <tr>
//                     <td className="py-3 font-semibold">Pricing</td>
//                     <td>Monthly Flat Fee</td>
//                     <td>Custom Based on Volume</td>
//                     <td>Contract-Based</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex flex-col items-center">
//             <img
//               src={subscription_model}
//               alt="Subscription"
//               className="max-w-md w-full mb-6"
//             />

//             <button className="bg-[#B0CB1F] hover:bg-[#c6df35] text-gray-900 font-semibold px-3 py-2 rounded-full shadow-md">
//               Single Subscription
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* 7. Who We Are */}
//       <section
//         id="section7"
//         className="flex flex-col lg:flex-row items-center justify-center w-full pb-[50px] gap-10 mt-[50px] scroll-mt-24"
//       >
//         <div className="min-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-center">
//           {/* LEFT IMAGE + QUOTE */}
//           <div className="relative">
//             <img
//               src={Start_comma}
//               alt="Start Quote"
//               className="absolute -left-10 top-0 w-40 h-auto"
//             />

//             <img
//               src={who_landing}
//               alt="Teacher Student"
//               className=" w-96 h-96 rounded-full object-cover"
//             />

//             <div className="absolute top-0 -right-16 max-w-96">
//               <h2 className="text-4xl font-bold text-[#464646]">
//                 Who <br /> it’s for <span className="text-5xl">?</span>
//               </h2>
//               <img
//                 src={Close_comma}
//                 alt="End Quote"
//                 className="absolute -right-20 bottom-4 w-16 h-auto "
//               />
//             </div>

//             <div className="absolute mt-12 bottom-10 -right-12 text-xl font-semibold text-gray-700">
//               . . . for all.
//             </div>
//           </div>

//           {/* RIGHT CONTENT */}
//           <div className="col-span-2">
//             {/* USERS GRID */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               <div>
//                 <h4 className="font-semibold text-[#464646] mb-2">Students</h4>
//                 <p className="text-sm text-[#464646] w-36">
//                   Clear plans, daily guidance, and stress-free completion.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-[#464646] mb-2">Parents</h4>
//                 <p className="text-sm text-[#464646] w-36">
//                   Visibility into progress and early alerts for risks.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-[#464646] mb-2">Teachers</h4>
//                 <p className="text-sm text-[#464646] w-36">
//                   Insight into student performance and learning gaps.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-[#464646] mb-2">
//                   Institutions
//                 </h4>
//                 <p className="text-sm text-[#464646] w-36">
//                   Standard-wise oversight and academic tracking.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 8. At a Glance */}
//       <section
//         id="section8"
//         className="flex flex-col lg:flex-row items-center justify-center w-full pb-[50px] gap-10 mt-[50px] scroll-mt-24"
//       >
//         <div className="min-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
//           {/* LEFT TEXT */}
//           <div className="relative flex flex-col">
//             {/* Quotes */}
//             <div>
//               <img
//                 src={Start_comma}
//                 alt="Start Quote"
//                 className="absolute -left-40 -top-16 w-40 h-auto"
//               />

//               <h2 className="text-5xl font-bold text-[#464646] mb-4">
//                 At a Glance
//               </h2>
//             </div>
//             <div className="flex gap-12">
//               <span className="text-lg font-semibold text-[#464646]">
//                 Everything You Need <br />
//                 to Stay on Track.
//               </span>

//               <img
//                 src={Close_comma}
//                 alt="End Quote"
//                 className=" w-24 h-auto "
//               />
//             </div>
//             <p className="text-[#464646] max-w-md mt-4 tracking-widest">
//               The dashboard brings together your learning plan, progress,
//               pending tasks, and insights helping you make the right study
//               decisions every day.
//             </p>
//           </div>

//           {/* RIGHT Image */}
//           {/* Robot Image */}
//           <img
//             src={Glance_landing}
//             alt="Glance Dashboard"
//             className="w-[35rem] relative z-10"
//           />
//         </div>
//       </section>

//       {/* 9. Vidya Kosh or the Knowledge Hub */}
//       <section
//         id="section9"
//         className="flex flex-col lg:flex-row items-center justify-center w-full pb-[50px] gap-10 mt-[50px] scroll-mt-24"
//       >
//         <div className="min-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
//           {/* LEFT IMAGE */}
//           <div className="flex justify-center">
//             <img
//               src={knowledgehub_landing}
//               alt="Security"
//               className="max-w-[30rem] w-fit"
//             />
//           </div>

//           {/* RIGHT CONTENT */}
//           <div className="mx-10">
//             {/* TITLE */}
//             <div className="relative mb-10">
//               <img
//                 src={Start_comma}
//                 alt="Start Quote"
//                 className="absolute left-3 -top-6 w-32 h-auto inline-block"
//               />
//               <h2 className="text-5xl text-center font-bold text-[#464646] leading-tight">
//                 Vidya Kosh{" "}
//               </h2>
//               <h4 className="text-2xl text-center font-bold text-[#464646] ">
//                 or the Knowledge Hub
//               </h4>

//               <img
//                 src={Close_comma}
//                 alt="End Quote"
//                 className="absolute right-12 bottom-5 w-24 h-auto inline-block"
//               />
//             </div>

//             {/* FEATURES */}
//             <div className="grid grid-cols-2 gap-2">
//               <div className="flex gap-4 w-60">
//                 <p className="text-sm text-[#464646] font-bold leading-relaxed tracking-widest">
//                   Learn through <span className="text-[#57A7B3]">Videos</span>,
//                   <span className="text-[#57A7B3]"> Notes</span>, and
//                   <span className="text-[#57A7B3]"> Structured Resources</span>
//                 </p>
//               </div>

//               <div className="flex gap-4 w-72">
//                 <p className="text-sm text-[#464646] leading-relaxed tracking-widest">
//                   Access high-quality video lessons, learning materials, and
//                   notes—organized by subject, chapter, and difficulty level.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 10. TESTIMONIALS */}
//       <section
//         id="section10"
//         className="flex flex-col items-center justify-center w-full pb-[50px] gap-1 mt-[50px] scroll-mt-24"
//       >
//         {/* TITLE */}
//         <div className="relative text-center gap-4 mt-20 mx-auto">
//           <img
//             src={Start_comma}
//             alt="Start Quote"
//             className="absolute -left-52 bottom-2 w-48 h-auto"
//           />

//           <h2 className="text-6xl font-bold text-gray-800">Testimonials</h2>

//           <img
//             src={Close_comma}
//             alt="End Quote"
//             className="absolute -right-36 top-2 w-32 h-auto"
//           />
//         </div>

//         {/* CONTENT */}
//         <div className="min-w-7xl mx-auto grid md:grid-cols-3 gap-10 items-center px-6">
//           {/* LEFT SIDE IMAGE DESIGN */}
//           <div className="col-span-2">
//             <img
//               src={Testimonials_landing}
//               className="p-2 max-w-4xl"
//             />
//           </div>

//           {/* RIGHT SIDE TEXT */}
//           <div className="max-w-md">
//             <p className="text-gray-600 leading-relaxed">
//               Clear plans, daily guidance, and stress-free completion the reason
//               I got through my exams was because of MokshPath. You don’t have
//               to think about where to start with, just get your enrolment done.
//               That’s it!
//             </p>

//             <p className="mt-6 font-semibold text-gray-800">
//               – Shubham Rastogy, ICSE, Class-12
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* 11. Data-Lab & Education Partners carousel */}
//       <section id="section11" className="overflow-hidden bg-white py-10">
//         <h1 className="text-4xl text-center font-semibold my-4">
//           Data-Lab & Education Partners
//         </h1>
//         <div className="p-8 mx-auto flex gap-12 animate-carousel">
//           {[...carouselLogos, ...carouselLogos].map((logo, index) => (
//             <img
//               key={index}
//               src={logo}
//               alt="logo"
//               className="h-40 w-auto object-contain"
//             />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }


//
import React, { useEffect, useState } from "react";
import "./Landing.css";
// import HeroImg from "../../../assets/icon/herosection.svg";

import IconBoard from "../../../assets/icon/curriculum_1.svg";
import GuyImg from "../../../assets/icon/Guy.svg";
import start_comma_gray from "../../../assets/icon/start_comma_gray.svg";
import end_comma_gray from "../../../assets/icon/end_comma_gray.svg";
import IcoSearch from "../../../assets/icon/ico_search.svg";
import IcoMenu from "../../../assets/icon/ico_menu.svg";
import IconPlan from "../../../assets/icon/group4.svg";
// import IconChat from "../../../assets/icon/chat2.svg";
import Chat from "../../auth/modal/chat";
import Layer_school from "../../../assets/icon/Layer_school.svg";
// import HeroRobot from "../../../assets/icon/hero.svg";
import Frame from "../../../assets/icon/Frame.svg";
import Close_comma from "../../../assets/icon/Close_comma.svg";
import Start_comma from "../../../assets/icon/Start_comma.svg";
import Safety from "../../../assets/icon/Safety.svg";
import Safety_arrow from "../../../assets/icon/Safety_arrow.svg";
import Safety_light from "../../../assets/icon/Safety_light.svg";
import Safety_meet from "../../../assets/icon/Safety_meet.svg";
import Safety_privacy from "../../../assets/icon/Safety_privacy.svg";
import subscription_model from "../../../assets/icon/subscription_model.svg";
import who_landing from "../../../assets/icon/who_landing.svg";
import knowledgehub_landing from "../../../assets/icon/knowledgehub_landing.svg";
import Testimonials_landing from "../../../assets/icon/Testimonials_landing.svg";
import Glance_landing from "../../../assets/icon/Glance_landing.svg";
import carousel_landing1 from "../../../assets/icon/carousel_landing1.svg";
import carousel_landing2 from "../../../assets/icon/carousel_landing2.svg";
import carousel_landing3 from "../../../assets/icon/carousel_landing3.svg";
import carousel_landing4 from "../../../assets/icon/carousel_landing4.svg";
import carousel_landing5 from "../../../assets/icon/carousel_landing5.svg";
import carousel_landing6 from "../../../assets/icon/carousel_landing6.svg";
import carousel_landing7 from "../../../assets/icon/carousel_landing7.svg";

interface FeatureCardProps {
  icon: string;
  title: string;
  working: boolean;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  working,
  desc,
}) => {
  return (
    <div
      className={`flex flex-col items-center text-center px-0 py-0${
        working ? "" : "opacity-50 grayscale"
      }`}
    >
      {/* Icon Container with specific spacing */}
      <div className="mb-1 flex justify-center">
        <img
          src={icon}
          alt={title}
          className="w-16 h-auto object-contain mx-auto"
        />
      </div>
      <h4 className="font-['Montserrat'] font-bold text-[18px] leading-[20px] tracking-[.02em] text-center max-w-[160px] min-h-[56px] text-primary mb-1 mx-auto flex items-center justify-center">
        {title}
      </h4>
      <p className="font-['Montserrat'] font-normal text-base leading-[20px] tracking-[.02em] text-center max-w-[200px] text-primary mx-auto">
        {desc}
      </p>
    </div>
  );
};

const features = [
  {
    id: 1,
    title: "AI powered Self Evaluation",
    working: true,
    icon: IconPlan,
    desc: "Skills added, AI evaluates via adaptive parameters.",
  },
  {
    id: 2,
    title: "Smart Learning Plans",
    working: true,
    icon: IconPlan,
    desc: "Auto-generates daily, structured, achievable study plans.",
  },
  {
    id: 3,
    title: "Progress & Completion Tracking",
    working: true,
    icon: IconPlan,
    desc: "Track topics, tests, progress—know your standing.",
  },
  {
    id: 4,
    title: "AI Learning Assistant",
    working: true,
    icon: IconPlan,
    desc: "Proactive AI guide: reminders, answers, priority focus.",
  },
  {
    id: 5,
    title: "Board-Specific Curriculum",
    working: true,
    icon: IconPlan,
    desc: "Clear explanatory text for feature understanding.",
  },
  {
    id: 6,
    title: "Role-Based Dashboards",
    working: true,
    icon: IconPlan,
    desc: "Role-based dashboards: students, parents, teachers, institutions.",
  },
];

export default function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sections = [
    "section1",
    "section2",
    "section3",
    "section4",
    "section5",
    "section6",
    "section7",
    "section8",
    "section9",
    "section10",
    "section11",
  ];
  const [active, setActive] = useState(0);

  // 2️⃣ Scroll to section when dot clicked
  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index]);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: "smooth",
      });
    }
    setActive(index);
  };

  // 3️⃣ Detect active section while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;

      sections.forEach((id, index) => {
        const element = document.getElementById(id);

        if (element) {
          const offsetTop = element.offsetTop - 200;
          const height = element.offsetHeight;

          if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
            setActive(index);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const carouselLogos = [
    carousel_landing1,
    carousel_landing2,
    carousel_landing3,
    carousel_landing4,
    carousel_landing5,
    carousel_landing6,
    carousel_landing7,
  ];
  return (
    <div className="overflow-x-hidden bg-gray-100">
      {/* 4️⃣ Right Side Navigation Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {sections.map((_, index) => (
          <div
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              active === index ? "bg-lime-500 scale-125" : "bg-gray-400"
            } `}
          />
        ))}
      </div>

      {/* CHAT ICON BUTTON */}
      {/* <div
        className="fixed right-[1%] top-[80%] -translate-y-1/2 z-[100] cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setIsChatOpen(true)}
      >
        <img src={IconChat} alt="Chat" className="w-[95px]" />
      </div> */}

      {/* RENDER MODAL CONDITIONALLY */}
      {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}

      {/* ════════════════════════════════════════════════════════════════════
          1. HEADER / HERO SECTION (SPLIT LAYOUT WITH GRAY BACKGROUND)
      ════════════════════════════════════════════════════════════════════ */}
      <section id="section1" className="relative">
        <div className="relative w-full pt-5">
          <img
            src={Frame}
            alt="From Learning Facts to Leading Minds"
            className=" w-full object-cover" // Covers the entire div
          />

          {/* Demo Button & Search Bar Row */}
          <div className="absolute -bottom-4 w-full flex flex-col md:flex-row items-center justify-center gap-4 px-4 mb-1">
            {/* <button className="bg-[#BADA55] hover:bg-lime-500 text-gray-800 px-8 py-3 rounded-full text-base lg:text-lg font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap">
            Try a Demo
          </button> */}

            <div className="relative w-full md:w-1/2  h-12 lg:h-14">
              <img
                src={IcoMenu}
                alt="Menu"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-[18px] cursor-pointer opacity-60 z-20"
              />
              <input
                type="text"
                placeholder="Search by Learning Videos, Tests, Study Notes, Assessments, etc ..."
                className="w-full h-full pr-[60px] pl-[55px] rounded-full border-none shadow-[0_4px_25px_rgba(0,0,0,0.08)] outline-none text-sm text-gray-700 focus:ring-2 focus:ring-[#BADA55]/40 transition-all bg-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white shadow-sm rounded-full">
                <img
                  src={IcoSearch}
                  alt="Search"
                  className="w-5 h-5 opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEMO BUTTON, SEARCH BAR & FEATURES GRID CONTAINER */}
      {/* mb-20 scroll-mt-24 z-20 -mt-[60px] md:-mt-[140px] lg:-mt-[260px] xl:-mt-[340px] flex flex-col items-center */}
      <section id="section2" className="relative ">
        {/* Features Area Wrapper to contain the background line properly */}
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-20">
          <div className="relative top-20">
            {/* Dashed Line Background for Features Grid (positioned relative to the grid now) */}
            <div className="absolute top-[35px] left-[8.33%] right-[8.33%] border-t-2 border-dashed border-[#d1d5db] z-0 hidden lg:block" />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-4 relative z-10">
              {features.map((f) => (
                <FeatureCard key={f.id} {...f} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why MokshPath */}

      <section
        id="section3"
        className="w-full bg-gray-100 py-20 mt-10 2xl:mt-20"
      >
        <div className="max-w-7xl mx-auto grid px-1 grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* LEFT IMAGE */}
          <div className="flex justify-center lg:justify-end items-end w-full ml-4">
            <img
              src={Layer_school}
              alt="School Illustration"
              className="w-[30rem] xl:w-96"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="relative col-span-2 ml-2 px-40 lg:p-0">
            <div className="">
              {/* LEFT QUOTE */}
              <div className="flex relative">
                <img
                  src={Start_comma}
                  alt="Start Quote"
                  className="absolute -left-32 -top-6 w-32 h-auto inline-block"
                />

                {/* TITLE */}
                <span className="text-center text-4xl md:text-5xl lg:text-[60px] font-bold text-gray-700 leading-tight">
                  Why MokshPath
                </span>
              </div>
              <div className="flex relative">
                <span className="text-center text-4xl md:text-5xl lg:text-[60px] font-bold text-gray-700 leading-tight">
                  for Your School?
                </span>

                {/* RIGHT QUOTE */}
                <img
                  src={Close_comma}
                  alt="end Quote"
                  className="absolute right-0 lg:right-8 xl:right-40 -top-4 w-28 h-auto inline-block"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6 text-gray-600">
              <p className="font-bold col-span-2 leading-7 tracking-widest track">
                Educational excellence is not just about grades, it’s about
                understanding how students think.
              </p>

              <p className="text-sm col-span-2 leading-relaxed">
                This platform enables personalised evaluation, structured
                feedback, and supports future-ready subsidiary programmes as
                schools grow.
              </p>
            </div>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-10 px-1 text-sm">
              <div className="w-80 lg:w-44 xl:w-[96%]">
                <h4 className="font-semibold text-gray-700 tracking-widest">
                  Eliminate Malpractice
                </h4>
                <p className="text-gray-500 mt-1">
                  The AI engine delivers a unique question sequence for every
                  student.
                </p>
              </div>

              <div className="w-80 lg:w-44 xl:w-[100%]">
                <h4 className="font-semibold text-gray-700">
                  Identify “Hidden” Gaps
                </h4>
                <p className="text-gray-500 mt-1">
                  Analytics classify errors as conceptual, careless, or
                  time-management issues.
                </p>
              </div>

              <div className="w-80 lg:w-44 xl:w-[96%]">
                <h4 className="font-semibold text-gray-700">
                  Empower Teachers
                </h4>
                <p className="text-gray-500 mt-1">
                  Guide AI with instructional hints to generate concept-driven
                  questions.
                </p>
              </div>

              <div className="w-80 lg:w-44 xl:w-[96%]">
                <h4 className="font-semibold text-gray-700 tracking-widest">
                  Automated Remediation
                </h4>
                <p className="text-gray-500 mt-1">
                  Create targeted remedial tests from each student's error
                  patterns.
                </p>
              </div>

              <div className="w-80 lg:w-44 xl:w-[96%]">
                <h4 className="font-bold text-gray-700 tracking-widest">
                  Global Standards
                </h4>
                <p className="text-gray-500 mt-1">
                  Assessments aligned to Bloom’s Taxonomy for academic rigor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM SECTION: TEXT + COLORED BUBBLES + GUY */}

      <section
        id="section4"
        className="flex flex-col lg:flex-row items-center justify-center w-full pb-12 gap-10 mt-12 scroll-mt-24"
      >
        <div className="min-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left pt-2 ml-24">
            <div className="relative flex">
              {/* Opening Quote */}
              <h4 className="flex gap-5 font-['Montserrat'] font-bold text-3xl leading-10 tracking-tight text-primary ml-12">
                Built around your
              </h4>
              <img
                src={start_comma_gray}
                alt="Start Quote"
                className="absolute -left-24 -top-6 w-36 h-auto inline-block"
              />
            </div>
            <h2 className=" gap-5 font-['Montserrat'] font-bold text-5xl tracking-tight text-primary ml-12">
              <span className="block">school</span>
              <div className="flex gap-4">
                <span className="block">curriculum </span>
                <img
                  src={end_comma_gray}
                  alt="End Quote"
                  className=" w-24 h-auto inline-block"
                />
              </div>
            </h2>
            <p className="font-['Montserrat'] font-normal text-normal leading-relaxed tracking-wider text-primary w-96 lg:w-52 xl:w-80 mx-auto lg:ml-12">
              Our learning plans are intelligently mapped to official academic
              calendars, ensuring the right pace and structure for each
              education board; an exact fit for ICSE, CBSE and all the Indian
              State Boards.
            </p>
          </div>

          {/* Middle: Colored Board Bubbles */}
          <div className="flex flex-col gap-2 items-center justify-center">
            <img
              src={IconBoard}
              alt="Board Bubbles"
              className="relative left-6 bottom-12 w-96 max-w-full h-auto "
            />

            {/* BOTTOM TEXT */}
            <p className="flex flex-col justify-center text-left mb-20 xl:mb-48 font-['Montserrat'] font-bold text-xl leading-8 tracking-[0.14em] text-primary">
              <span className="block">Different boards.</span>
              <span className="block">Different timelines.</span>
              <span className="block">One intelligent system.</span>
            </p>
          </div>

          {/* Right: Guy with Orange Background */}
          <div className="flex-1 flex lg:mt-0 px-2">
            <img
              src={GuyImg}
              alt="Student"
              className="relative  max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* 5. Technical Reliability & Safety */}
      <section
        id="section5"
        className="flex flex-col lg:flex-row items-center justify-center w-full pb-12 gap-10 mt-12 scroll-mt-24"
      >
        <div className="min-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 items-center">
          {/* LEFT IMAGE */}
          <div className="flex justify-center ml-40">
            <img src={Safety} alt="Security" className="max-w-[30rem] w-fit" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-2 ml-28">
            {/* TITLE */}
            <div className="relative mb-10">
              <div className="flex">
                <img
                  src={Start_comma}
                  alt="Start Quote"
                  className="absolute -left-36 -top-6 w-32 h-auto inline-block"
                />
                <h2 className="text-5xl font-bold text-primary leading-tight">
                  Technical
                </h2>
              </div>
              <div className="flex gap-4">
                <span className="text-5xl font-bold text-primary leading-tight">
                  Reliability & Safety
                </span>
                <img
                  src={Close_comma}
                  alt="End Quote"
                  className="w-20 h-auto inline-block"
                />
              </div>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              <div className="flex justify-start items-start gap-4 w-64">
                <img
                  src={Safety_light}
                  alt="Safety Light"
                  className="w-12 h-auto"
                />
                <div>
                  <h4 className="font-semibold text-primary">Lightning Fast</h4>
                  <p className="text-sm text-primary  leading-tighter tracking-wider">
                    The adaptive engine serves the next question in under 1.5
                    seconds, even on low bandwidth.
                  </p>
                </div>
              </div>

              <div className="flex justify-start items-start gap-4 w-64">
                <img
                  src={Safety_arrow}
                  alt="Scalability"
                  className="w-12 h-auto"
                />
                <div>
                  <h4 className="font-semibold text-primary">
                    High Scalability
                  </h4>
                  <p className="text-sm text-primary  leading-tighter tracking-wider">
                    Supports concurrent usage spikes for large-scale National
                    Olympiads.
                  </p>
                </div>
              </div>

              <div className="flex justify-start items-start gap-4 w-64">
                <img
                  src={Safety_privacy}
                  alt="Privacy"
                  className="w-12 h-auto"
                />
                <div>
                  <h4 className="font-semibold text-primary">Privacy First</h4>
                  <p className="text-sm text-primary  leading-tighter tracking-wider">
                    Fully compliant with GDPR and COPPA; student data for
                    regulatory bodies is strictly anonymised.
                  </p>
                </div>
              </div>

              <div className="flex justify-start items-start gap-4 w-64">
                <img
                  src={Safety_meet}
                  alt="Reliability"
                  className="w-12 h-auto"
                />

                <div>
                  <h4 className="font-semibold text-primary">
                    Inclusive Design
                  </h4>
                  <p className="text-sm text-primary leading-tighter tracking-wider">
                    Platform meets WCAG 2.1 AA standards to ensure accessibility
                    for all learners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Subscription Model */}
      <section
        id="section6"
        className="flex flex-col lg:flex-row items-center justify-center w-full pb-12 gap-10 mt-12 scroll-mt-24"
      >
        <div className="min-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 ml-20">
            <div className="grid grid-cols-2 gap-16 lg:gap-24 mb-10">
              {/* TITLE */}
              <div className="relative mb-1">
                <img
                  src={Start_comma}
                  alt="Start Quote"
                  className="absolute -left-24 -top-6 w-24 h-auto inline-block"
                />
                <h2 className="text-5xl font-bold text-primary">
                  Subscription <br /> Model
                </h2>
                <img
                  src={Close_comma}
                  alt="End Quote"
                  className="absolute left-40 top-14 w-16 h-auto inline-block"
                />
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-600 max-w-72 mb-1 leading-relaxed tracking-tight">
                We offer tiered pricing designed to scale with your
                institution's size and customization needs.
              </p>
            </div>
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="text-primary font-semibold text-lg border-b">
                    <th className="py-3">Feature</th>
                    <th className="py-3">Silver Tier</th>
                    <th className="py-3">Gold Tier</th>
                    <th className="py-3">Enterprise</th>
                  </tr>
                </thead>

                <tbody className="text-gray-600">
                  <tr className="border-b">
                    <td className="py-3 font-semibold">Best For</td>
                    <td>Standard Board Prep</td>
                    <td>Custom School Needs</td>
                    <td>Large School Networks</td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3 font-semibold">Content Generation</td>
                    <td>General Boards (CBSE/ICSE)</td>
                    <td>Custom AI Fine-Tuning</td>
                    <td>Bespoke Syllabus Integration</td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3 font-semibold">Style Sync</td>
                    <td>Standard Templates</td>
                    <td>Learns School Teaching Style</td>
                    <td>Full Brand White Labelling</td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-3 font-semibold">Analytics</td>
                    <td>Standard Reporting</td>
                    <td>Deep Pattern Analysis</td>
                    <td>Regulatory Reporting</td>
                  </tr>

                  <tr>
                    <td className="py-3 font-semibold">Pricing</td>
                    <td>Monthly Flat Fee</td>
                    <td>Custom Based on Volume</td>
                    <td>Contract-Based</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center mr-6">
            <img
              src={subscription_model}
              alt="Subscription"
              className="max-w-sm w-ful mb-6"
            />

            <button className="bg-[#B0CB1F] hover:bg-[#c6df35] text-gray-900 font-semibold px-3 py-2 rounded-full shadow-md">
              Single Subscription
            </button>
          </div>
        </div>
      </section>

      {/* 7. Who We Are */}
      <section
        id="section7"
        className="flex flex-col lg:flex-row items-center justify-center w-full pb-12 gap-10 mt-12 scroll-mt-24"
      >
        <div className="min-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 items-center">
          {/* LEFT IMAGE + QUOTE */}
          <div className="relative ml-6">
            <img
              src={Start_comma}
              alt="Start Quote"
              className="absolute -left-10 top-0 w-40 lg:w-28 xl:w-40 h-auto"
            />

            <img
              src={who_landing}
              alt="Teacher Student"
              className=" w-96 xl:h-96 rounded-full object-cover"
            />

            <div className="absolute top-0 -right-16 max-w-96">
              <h2 className="text-4xl font-bold text-[#464646]">
                Who <br /> it’s for <span className="text-5xl">?</span>
              </h2>
              <img
                src={Close_comma}
                alt="End Quote"
                className="absolute -right-20 bottom-4 w-16 h-auto "
              />
            </div>

            <div className="absolute mt-12 bottom-10 -right-12 text-xl font-semibold text-gray-700">
              . . . for all.
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-2 ml-4 lg:ml-12">
            {/* USERS GRID */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
              <div className=" w-32">
                <h4 className="font-semibold text-primary mb-2">Students</h4>
                <p className="text-sm text-primary">
                  Clear plans, daily guidance, and stress-free completion.
                </p>
              </div>

              <div className=" w-32">
                <h4 className="font-semibold text-primary mb-2">Parents</h4>
                <p className="text-sm text-primary">
                  Visibility into progress and early alerts for risks.
                </p>
              </div>

              <div className=" w-32">
                <h4 className="font-semibold text-primary mb-2">Teachers</h4>
                <p className="text-sm text-primary">
                  Insight into student performance and learning gaps.
                </p>
              </div>

              <div className=" w-32">
                <h4 className="font-semibold text-primary mb-2">
                  Institutions
                </h4>
                <p className="text-sm text-primary">
                  Standard-wise oversight and academic tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. At a Glance */}
      <section
        id="section8"
        className="flex flex-col lg:flex-row items-center justify-center w-full pb-12 gap-10 mt-12 scroll-mt-24"
      >
        <div className="min-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT TEXT */}
          <div className="relative flex flex-col ml-40">
            {/* Quotes */}
            <div>
              <img
                src={Start_comma}
                alt="Start Quote"
                className="absolute -left-40 -top-16 w-40 h-auto"
              />

              <h2 className="text-5xl font-bold text-[#464646] mb-4">
                At a Glance
              </h2>
            </div>
            <div className="flex gap-12">
              <span className="text-lg font-semibold text-[#464646]">
                Everything You Need <br />
                to Stay on Track.
              </span>

              <img
                src={Close_comma}
                alt="End Quote"
                className=" w-24 h-auto "
              />
            </div>
            <p className="text-[#464646] max-w-md mt-4 tracking-widest">
              The dashboard brings together your learning plan, progress,
              pending tasks, and insights helping you make the right study
              decisions every day.
            </p>
          </div>

          {/* RIGHT Image */}
          {/* Robot Image */}
          <img
            src={Glance_landing}
            alt="Glance Dashboard"
            className="w-[35rem] relative z-10"
          />
        </div>
      </section>

      {/* 9. Vidya Kosh or the Knowledge Hub */}
      <section
        id="section9"
        className="flex flex-col lg:flex-row items-center justify-center w-full pb-12 gap-10 mt-12 scroll-mt-24"
      >
        <div className="min-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT IMAGE */}
          <div className="flex justify-center">
            <img
              src={knowledgehub_landing}
              alt="Security"
              className="max-w-[30rem] w-fit"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="mx-10 lg:mx-1 xl:mx-10">
            {/* TITLE */}
            <div className="relative mb-10">
              <img
                src={Start_comma}
                alt="Start Quote"
                className="absolute left-3 lg:-left-9 xl:-left-2 -top-6 w-32 h-auto inline-block"
              />
              <h2 className="text-5xl text-center font-bold text-[#464646] leading-tight">
                Vidya Kosh{" "}
              </h2>
              <h4 className="text-2xl text-center font-bold text-[#464646] ">
                or the Knowledge Hub
              </h4>

              <img
                src={Close_comma}
                alt="End Quote"
                className="absolute right-12 lg:-right-4 xl:right-6 bottom-5 w-24 h-auto inline-block"
              />
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex gap-4 w-60">
                <p className="text-sm text-[#464646] font-bold leading-relaxed tracking-widest">
                  Learn through <span className="text-[#57A7B3]">Videos</span>,
                  <span className="text-[#57A7B3]"> Notes</span>, and
                  <span className="text-[#57A7B3]"> Structured Resources</span>
                </p>
              </div>

              <div className="flex gap-4 w-72">
                <p className="text-sm text-[#464646] leading-relaxed tracking-widest">
                  Access high-quality video lessons, learning materials, and
                  notes—organized by subject, chapter, and difficulty level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section
        id="section10"
        className="flex flex-col items-center justify-center w-full pb-[50px] bg-white gap-1 mt-[50px] scroll-mt-24"
      >
        {/* TITLE */}
        <div className="relative text-center gap-4 mt-20 mx-auto">
          <img
            src={Start_comma}
            alt="Start Quote"
            className="absolute -left-52 bottom-2 w-48 h-auto"
          />

          <h2 className="text-6xl font-bold text-gray-800">Testimonials</h2>

          <img
            src={Close_comma}
            alt="End Quote"
            className="absolute -right-36 top-2 w-32 h-auto"
          />
        </div>

        {/* CONTENT */}
        <div className="min-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center justify-center">
          {/* LEFT SIDE IMAGE DESIGN */}
          <div className="lg:col-span-2">
            <img
              src={Testimonials_landing}
              className="p-2 max-w-4xl lg:max-w-2xl xl:max-w-4xl"
            />
          </div>

          {/* RIGHT SIDE TEXT */}
          <div className="w-full lg:max-w-md md:max-w-md justify-center text-start flex flex-col">
            <p className="text-gray-600 leading-relaxed w-96">
              Clear plans, daily guidance, and stress-free completion the reason
              I got through my exams was because of MokshaPath. You don’t have
              to think about where to start with, just get your enrolment done.
              That’s it!
            </p>

            <p className="mt-6 font-semibold text-gray-800">
              – Shubham Rastogy, ICSE, Class-12
            </p>
          </div>
        </div>
      </section>

      {/* 11. Data-Lab & Education Partners carousel */}
      <section id="section11" className="overflow-hidden bg-white py-10">
        <h1 className="text-4xl text-center font-semibold my-4">
          Data-Lab & Education Partners
        </h1>
        <div className="p-8 mx-auto flex gap-12 animate-carousel">
          {[...carouselLogos, ...carouselLogos].map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt="logo"
              className="h-40 w-auto object-contain"
            />
          ))}
        </div>
      </section>
    </div>
  );
}