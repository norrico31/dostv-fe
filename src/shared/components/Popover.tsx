import { ReactNode, useState, useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';

export default function Popover({ children, content }: { children: ReactNode; content: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popoverRef]);

    return (
        <div className="relative inline-block text-left" ref={popoverRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {children}
                </button>
            </div>

            <Transition
                show={isOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div
                    // specify width and height here if necesary
                    className="absolute z-10 mt-2 p-5 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                >
                    <div className="py-1" role="none">
                        {content}
                    </div>
                </div>
            </Transition>
        </div>
    );
}