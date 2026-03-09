import  { useState } from 'react';
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
    // Backdrop for the modal - added bg-black/40 for overlay effect and explicit font
    <div 
      className="fixed inset-0 z-[200] font-['Montserrat']"
      onClick={() => {
        setIsOpen(false);
        if (onClose) onClose();
      }}
    >
      
      {/* Modal Container */}
      <div 
        className="absolute bottom-4 right-4 bg-[#FFCA08] rounded-[32px] w-[446px] h-[590px] flex flex-col p-1 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header - White Pill */}
        <div className="bg-white rounded-full flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center pb-1">
              <img src={IconChat} alt="MokshGuru" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-gray-800 text-[16px] leading-tight">MokshGuru</span>
              <span className="text-[#E54B4B] text-[13px] font-medium leading-tight mt-0.5">Today: 7.45 am</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="absolute top-[14px] left-[397px] w-[30px] h-[30px] bg-[#F0F0F0] hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-20"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1L13 13M1 13L13 1" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 mt-6 px-6 flex flex-col relative">
          
          {/* Recent Chats Link */}
          <div className="absolute top-0 right-0  mr-8">
            <button className="text-[#E54B4B] font-bold text-[16px] tracking-wide hover:opacity-80 transition-opacity">
              Recent Chats
            </button>
          </div>

          {/* Greeting Text */}
          <p className="text-[22px] font-medium text-[#333333] leading-[1.3] w-[75%] mt-2">
            “Namaste, Shishya!<br/>
            Your learning path is<br/>
            ready. Proceed?”
          </p>

{/* Action Bubbles - Removed absolute positioning, used mt-auto instead */}
          <div className="flex flex-col gap-3.5 items-start mt-auto mb-4 pl-2">
            <div className="bg-[#E54B4B] text-white rounded-full px-5 py-2.5 text-[15px] font-medium shadow-sm w-fit">
              Try a quiz on this topic
            </div>
            <div className="bg-[#E54B4B] text-white rounded-full px-5 py-2.5 text-[15px] font-medium shadow-sm w-fit">
              Get notes on this chapter
            </div>
            <div className="bg-[#E54B4B] text-white rounded-full px-5 py-2.5 text-[15px] font-medium shadow-sm w-fit">
              Get videos on this chapter
            </div>
            <div className="bg-[#E54B4B] text-white rounded-full px-5 py-2.5 text-[15px] font-medium shadow-sm w-fit">
              Tell me about the subscriptions
            </div>
          </div>
        </div>


        {/* Footer / Input Area */}
{/* Assume you have imports like this at the top of your file:
import SendIcon from '../../../assets/icon/send.svg';
import MicIcon from '../../../assets/icon/mic.svg';
*/}

<div className="flex items-center gap-3 px-4 mb-3">
  <div className="flex-1 bg-white rounded-full flex items-center px-5 py-3.5 shadow-sm">
    <input 
      type="text" 
      placeholder="Type here" 
      className="flex-1 outline-none focus:outline-none focus:ring-0 text-[15px] text-gray-700 placeholder-[#B0B0B0] bg-transparent font-medium border-none"
    />
    
    {/* Send button using your imported image */}
    <button className="ml-2 flex items-center justify-center hover:opacity-80 transition-opacity focus:outline-none">
      <img src={SendIcon} alt="Send" className="w-[30px] h-[15px] object-contain" />
    </button>
  </div>
  
  {/* Mic button using your imported image */}
  <button className="w-10 h-10 flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity focus:outline-none">
    <img src={MicIcon} alt="Mic" className="w-[18px] h-[28px] object-contain" />
  </button>
</div>

      </div>
    </div>
  );
};

export default Chat;