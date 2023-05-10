import { useState, useEffect } from "react"

const BottomSheet = ({ label, options, selectedOption, setSelectedOption }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isPhoneSize, setIsPhoneSize] = useState(false)

    const handleSelectOption = (option) => {
        setSelectedOption(option)
        setIsOpen(false)
    }

    useEffect(() => {
        const handleResize = () => {
            setIsPhoneSize(window.innerWidth < 768)
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const openBottomSheet = () => {
        setIsOpen(true)
        document.body.style.overflow = "hidden"
    }

    const closeBottomSheet = () => {
        setIsOpen(false)
        document.body.style.overflow = "auto"
    }

    return (
        <div className="relative">
            {/* Render as modal on tablet and larger screens */}
            <div
                className={`hidden sm:block fixed top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeBottomSheet}
            >
                <div className="flex items-center h-full">
                    <div className="bg-white shadow-md rounded-md p-4 max-w-lg mx-auto overflow-y-auto">
                        <div className="grid gap-4 grid-cols-6 grid-rows-4">
                            {options.map((option) => (
                                <div
                                    key={option}
                                    className={`p-2 h-14 w-14 flex justify-center items-center cursor-pointer ${option === selectedOption ? "bg-gray-300 hover:bg-gray-300" : "bg-white hover:bg-gray-50"} border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#457B9D]`}
                                    onClick={() => handleSelectOption(option)}>
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Render as bottom sheet on phone-sized screens */}
            <div className={`block sm:hidden h-screen fixed bottom-0 left-0 right-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-full pointer-events-none"}`} onClick={closeBottomSheet}>
                <div className="flex items-center">
                    <div className={`flex justify-center fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md rounded-t-md sm:rounded-md sm:overflow-hidden transition-all ease-in-out duration-300 transform ${isOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"}`}>
                        <div className="grid gap-4 grid-cols-6 grid-rows-4">
                            {options.map((option) => (
                                <div
                                    key={option}
                                    className={`p-2 h-14 w-14 flex justify-center items-center cursor-pointer ${option === selectedOption ? "bg-gray-300" : "bg-white"} border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#457B9D]`}
                                    onClick={() => handleSelectOption(option)}>
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative inline-block">
                <label className="block text-xs font-mono text-gray-700 ml-0.5 pb-0.5">{label}</label>
                <button
                    className="z-50 p-4 h-14 w-14 flex justify-center items-center bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#457B9D]"
                    onClick={openBottomSheet}
                >
                    {selectedOption}
                </button>
            </div>
        </div>
    )
}

export default BottomSheet