import { DragEventHandler, useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import { Greet, OpenFileDialog } from "../wailsjs/go/main/App";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


type ItemType = {
    icon: string;
    label: string;
    action: string;
}

const sidebarGroups = [
    {
        label: "System",
        items: [
            {
                icon: "web",
                label: "Website",
                action: "website",
            },
            {
                icon: "media",
                label: "Multimedia",
                action: "media",
            },
            {
                icon: "rocket",
                label: "Launch",
                action: "launch",
            },
            {
                icon: "close",
                label: "Close",
                action: "close",
            }
        ]
    }
]

function App() {
    // states
    const [draggedElement, setDraggedElement] = useState<ItemType>();
    const [tileState, setTileState] = useState<{ [key: number]: ItemType }>({});

    const allTiles = Array(15).fill(1);
    const breakPoint = 5;
    const result = [];

    // Loop through allTiles and push chunks of 5 elements into the result array
    for (let i = 0; i < allTiles.length; i += breakPoint) {
        result.push(allTiles.slice(i, i + breakPoint));
    }

    async function greet() {
        // Greet(name).then(updateResultText);
        const filePath = await OpenFileDialog();

        if (filePath) {
            console.log("Selected file path:", filePath);
            // You can display it in the UI or use it as needed
            // updateResultText(filePath);
        } else {
            console.log("No file selected");
        }
    }

    async function handleDragStart(e: React.DragEvent<HTMLDivElement>, draggedElement: ItemType) {
        setDraggedElement(draggedElement);
    }

    const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    return (
        <div id="App" className="flex">
            <div className="flex-grow h-screen flex flex-col">
                <div className="flex-grow flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-4">
                        {
                            allTiles.map((v, tileIndex) => (
                                <div
                                    key={tileIndex}
                                    className="w-[72px] aspect-square border-2 border-zinc-500 bg-zinc-800 flex-grow-0 flex-shrink-0 rounded-2xl transition transform active:scale-90 cursor-pointer"
                                    onDrop={e => {
                                        if (draggedElement) {
                                            setTileState({
                                                ...tileState,
                                                [tileIndex]: draggedElement
                                            });
                                        }
                                    }}
                                    onDragOver={allowDrop}
                                >
                                    {
                                        tileState[tileIndex] ? tileState[tileIndex].label : ""
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex-shrink-0 h-[320px] border-t border-gray-900">Details tab</div>
            </div>
            {/* sidebar */}
            <div className="flex-shrink-0 block w-[270px] border-l border-gray-900 h-screen overflow-y-auto overflow-x-hidden">
                <Accordion type="single" collapsible>
                    {
                        sidebarGroups.map((group, index) => (
                            <AccordionItem value={group.label} key={index}>
                                <AccordionTrigger className="px-4 hover:no-underline">{group.label}</AccordionTrigger>
                                <AccordionContent className="bg-zinc-800 pb-0">
                                    {
                                        group.items.map((item, index) => (
                                            <div
                                                className="px-4 py-3 text-left cursor-pointer"
                                                onDragStart={(e) => handleDragStart(e, item)}
                                                draggable>{item.label}</div>
                                        ))
                                    }
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }
                </Accordion>
            </div>
        </div>
    )
}

export default App
