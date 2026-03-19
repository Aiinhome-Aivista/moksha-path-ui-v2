
const RemediationFooter = ({ title, value, desc }: any) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-500">{value}</p>
        <button className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
          Buy a Plan
        </button>
      </div>
    </div>
  );
};

export default RemediationFooter;