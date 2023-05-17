const DepressibleButton = ({ btnText, width }) => {
    return (
        <>
            <style>
                {`
          #depressibleButton {
            @apply bg-green-500 text-white py-2 px-4 rounded;
            box-shadow: 0px 4px rgba(79, 115, 82, 0.4);
          }

          #depressibleButton:hover {
            @apply bg-green-600;
            transform: translateY(2px);
            box-shadow: 0px 2px rgba(79, 115, 82, 0.3);
            transition-duration: 0.17s;
            border-bottom-width: 4px;
          }

          #depressibleButton:focus {
            box-shadow: 0px 0px;
            transform: translateY(2px);
            border-bottom-width: 1px;
          }
        `}
            </style>
            <div className="min-h-[3.1rem] flex items-center justify-center bg-transparent">
                <button id="depressibleButton" className={`"font-mono px-6 py-2 " + ${width} + " bg-[#6D9F71] text-white rounded-xl border-[#4F7352] border-l-[1px] border-r-[1px] border-t-[1px] border-b-[8px] hover:border-b-[5px]"`}>
                    {btnText}
                </button>
            </div>
        </>
    )
}

export default DepressibleButton