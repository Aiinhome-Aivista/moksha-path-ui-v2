import { useState } from 'react';
import IconChat from '../../../assets/icon/chat3.svg';
import SendIcon from '../../../assets/icon/send.svg';
import MicIcon from '../../../assets/icon/mic.svg';

interface ChatProps {
  onClose?: () => void;
}

const Chat = ({ onClose }: ChatProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="px-4 py-2 bg-blue-500 text-white rounded-md mt-10 ml-10"
    >
      Open Modal
    </button>
  );

  return (
    // Backdrop for the modal - Darker on mobile, transparent on desktop
    <div 
      className="fixed inset-0 z-[200] font-['Montserrat'] bg-black/40 sm:bg-transparent transition-all"
      onClick={() => {
        setIsOpen(false);
        if (onClose) onClose();
      }}
    >
      
      {/* Modal Container: Full screen/bottom sheet on mobile, fixed floating box on desktop */}
      <div 
        className="absolute bottom-0 right-0 w-full h-[95dvh] rounded-t-[32px] sm:bottom-4 sm:right-4 bg-[#FFCA08] sm:rounded-[32px] sm:w-[446px] sm:h-[590px] flex flex-col p-1 sm:p-2 shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header - White Pill */}
        <div className="bg-white rounded-[30px] sm:rounded-full flex items-center justify-between shadow-sm z-10 p-1">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Avatar */}
            <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden flex items-center justify-center pb-1 shrink-0">
              <img src={IconChat} alt="MokshGuru" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-gray-800 text-[15px] sm:text-[16px] leading-tight">MokshGuru</span>
              <span className="text-[#E54B4B] text-[12px] sm:text-[13px] font-medium leading-tight mt-0.5">Today: 7.45 am</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="w-8 h-8 sm:w-[30px] sm:h-[30px] mr-3 bg-[#F0F0F0] hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors shrink-0"
          >
            {/* FIX: Width and height moved to className to make TypeScript happy */}
            <svg className="w-3 h-3 sm:w-[14px] sm:h-[14px]" viewBox="0 0 14 14" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1L13 13M1 13L13 1" />
            </svg>
          </button>
        </div>

        {/* Modal Body - Made scrollable (overflow-y-auto) for shorter screens */}
        <div className="flex-1 mt-4 sm:mt-6 px-4 sm:px-6 flex flex-col relative overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Recent Chats Link */}
          <div className="flex justify-end w-full mb-2 sm:absolute sm:top-0 sm:right-4 sm:mb-0">
            <button className="text-[#E54B4B] font-bold text-[14px] sm:text-[16px] tracking-wide hover:opacity-80 transition-opacity">
              Recent Chats
            </button>
          </div>

          {/* Greeting Text */}
          <p className="text-[20px] sm:text-[22px] font-medium text-[#333333] leading-[1.3] w-[85%] sm:w-[75%] mt-2 sm:mt-8">
            “Namaste, Shishya!<br/>
            Your learning path is<br/>
            ready. Proceed?”
          </p>

          {/* Action Bubbles */}
          <div className="flex flex-col gap-3 items-start mt-auto pt-6 mb-4 pl-1 sm:pl-2">
            <button className="bg-[#E54B4B] text-white rounded-full px-4 sm:px-5 py-2.5 text-[14px] sm:text-[15px] font-medium shadow-sm w-fit text-left hover:bg-[#d43d3d] transition-colors">
              Try a quiz on this topic
            </button>
            <button className="bg-[#E54B4B] text-white rounded-full px-4 sm:px-5 py-2.5 text-[14px] sm:text-[15px] font-medium shadow-sm w-fit text-left hover:bg-[#d43d3d] transition-colors">
              Get notes on this chapter
            </button>
            <button className="bg-[#E54B4B] text-white rounded-full px-4 sm:px-5 py-2.5 text-[14px] sm:text-[15px] font-medium shadow-sm w-fit text-left hover:bg-[#d43d3d] transition-colors">
              Get videos on this chapter
            </button>
            <button className="bg-[#E54B4B] text-white rounded-full px-4 sm:px-5 py-2.5 text-[14px] sm:text-[15px] font-medium shadow-sm w-fit text-left hover:bg-[#d43d3d] transition-colors">
              Tell me about the subscriptions
            </button>
          </div>
        </div>

        {/* Footer / Input Area */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 mb-3 shrink-0 pt-2">
          <div className="flex-1 bg-white rounded-full flex items-center px-4 sm:px-5 py-3 sm:py-3.5 shadow-sm">
            <input 
              type="text" 
              placeholder="Type here" 
              className="flex-1 min-w-0 outline-none focus:outline-none focus:ring-0 text-[14px] sm:text-[15px] text-gray-700 placeholder-[#B0B0B0] bg-transparent font-medium border-none"
            />
            
            {/* Send button */}
            <button className="ml-2 flex items-center justify-center hover:opacity-80 transition-opacity focus:outline-none shrink-0">
              <img src={SendIcon} alt="Send" className="w-[24px] h-[12px] sm:w-[30px] sm:h-[15px] object-contain" />
            </button>
          </div>
          
          {/* Mic button */}
          <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity focus:outline-none bg-white/20 sm:bg-transparent rounded-full">
            <img src={MicIcon} alt="Mic" className="w-[16px] h-[24px] sm:w-[18px] sm:h-[28px] object-contain" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Chat;