import React, { useState, useEffect, useRef } from "react";

const DropdownList = ({ label, options, selectedOption, setSelectedOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 27) { // Escape key
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <label className="block text-xs font-mono text-gray-700 ml-0.5 pb-0.5">{label}</label>
            <button
                className="py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-between"
                onClick={handleClick}
            >
                <span>{selectedOption}</span>
                &nbsp;&nbsp;
                <svg
                    className={`w-5 h-5 transition-transform transform ${isOpen ? "rotate-270" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                </svg>
            </button>
            {isOpen && (
                <ul className="absolute z-10 mt-2 w-full rounded-md bg-white shadow-sm border border-gray-300">
                    {options.map((option) => (
                        <li
                            key={option}
                            className="py-1 px-3 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelectOption(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownList;