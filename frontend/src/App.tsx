import { DragEventHandler, useRef, useState } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Laptop, Volume2, VolumeX, Mic, Video, Image, Folder, Settings, Power, Headphones, Monitor, Speaker } from 'lucide-react'
import './App.css';
import { Greet, OpenFileDialog } from "../wailsjs/go/main/App";
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"


type ItemType = {
    icon: string;
    label: string;
    action: string;
}

// Available actions grouped by category
const availableActions = {
    "Media Controls": [
        { id: 'play', icon: <Play className="w-6 h-6" />, name: 'Play' },
        { id: 'pause', icon: <Pause className="w-6 h-6" />, name: 'Pause' },
        { id: 'next', icon: <SkipForward className="w-6 h-6" />, name: 'Next Track' },
        { id: 'prev', icon: <SkipBack className="w-6 h-6" />, name: 'Previous Track' },
    ],
    "Audio": [
        { id: 'volumeUp', icon: <Volume2 className="w-6 h-6" />, name: 'Volume Up' },
        { id: 'volumeDown', icon: <VolumeX className="w-6 h-6" />, name: 'Volume Down' },
        { id: 'mic', icon: <Mic className="w-6 h-6" />, name: 'Toggle Mic' },
        { id: 'headphones', icon: <Headphones className="w-6 h-6" />, name: 'Toggle Headphones' },
        { id: 'speaker', icon: <Speaker className="w-6 h-6" />, name: 'Toggle Speaker' },
    ],
    "Applications": [
        { id: 'music', icon: <Music className="w-6 h-6" />, name: 'Open Music App' },
        { id: 'app', icon: <Laptop className="w-6 h-6" />, name: 'Open App' },
        { id: 'video', icon: <Video className="w-6 h-6" />, name: 'Open Video App' },
    ],
    "System": [
        { id: 'screenshot', icon: <Image className="w-6 h-6" />, name: 'Take Screenshot' },
        { id: 'folder', icon: <Folder className="w-6 h-6" />, name: 'Open Folder' },
        { id: 'settings', icon: <Settings className="w-6 h-6" />, name: 'Open Settings' },
        { id: 'power', icon: <Power className="w-6 h-6" />, name: 'Power Options' },
        { id: 'monitor', icon: <Monitor className="w-6 h-6" />, name: 'Switch Display' },
    ],
}

function App() {
    // states
    const draggedItem = useRef<{ category: string; index: number } | null>(null)
    const [tiles, setTiles] = useState(Array(15).fill(null))
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [pendingAction, setPendingAction] = useState<{ targetIndex: number; newAction: any } | null>(null)

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

    const onDragStart = (e: React.DragEvent, category: string, index: number) => {
        draggedItem.current = { category, index }
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', JSON.stringify({ category, index }))
    }

    const onDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault()
        if (!draggedItem.current) return

        const { category, index } = draggedItem.current

        if (category !== 'tile') {
            const newAction = (availableActions as any)[category][index]
            if (tiles[targetIndex]) {
                setPendingAction({ targetIndex, newAction })
                setShowConfirmDialog(true)
            } else {
                const newTiles = [...tiles]
                newTiles[targetIndex] = newAction
                setTiles(newTiles)
            }
        } else {
            const newTiles = [...tiles]
            const draggedTile = newTiles[index]
            newTiles[index] = newTiles[targetIndex]
            newTiles[targetIndex] = draggedTile
            setTiles(newTiles)
        }

        draggedItem.current = null
    }

    const onDropToSidebar = (e: React.DragEvent) => {
        e.preventDefault()
        if (!draggedItem.current || draggedItem.current.category !== 'tile') return

        const { index } = draggedItem.current
        const newTiles = [...tiles]
        newTiles[index] = null
        setTiles(newTiles)
        draggedItem.current = null
    }

    const handleConfirmReplace = () => {
        if (pendingAction) {
            const newTiles = [...tiles]
            newTiles[pendingAction.targetIndex] = pendingAction.newAction
            setTiles(newTiles)
            setShowConfirmDialog(false)
            setPendingAction(null)
        }
    }

    const handleCancelReplace = () => {
        setShowConfirmDialog(false)
        setPendingAction(null)
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
                            tiles.map((tile, index) => (
                                <div
                                    key={index}
                                    className="w-[72px] aspect-square border-2 border-zinc-500 bg-zinc-800 flex-grow-0 flex-shrink-0 rounded-2xl transition transform active:scale-90 active:border-blue-500 cursor-pointer flex items-center justify-center"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, 'tile', index)}
                                    onDrop={(e) => onDrop(e, index)}
                                    onDragOver={allowDrop}
                                    onClick={() => tile && console.log(`Action: ${tile.name}`)}
                                >
                                    <div className="w-full justify-center flex">{tile ? tile.icon : ""}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex-shrink-0 h-[320px] border-t border-gray-900">Details tab</div>
            </div>
            {/* sidebar */}
            <div className="flex-shrink-0 block w-[270px] border-l border-gray-900 h-screen overflow-y-auto overflow-x-hidden">
                <Accordion type="multiple" className="w-full">
                    {
                        Object.entries(availableActions).map(([category, actions]) => (
                            <AccordionItem value={category} key={category}>
                                <AccordionTrigger className="px-4 hover:no-underline hover:bg-accent">{category}</AccordionTrigger>
                                <AccordionContent className="bg-zinc-800 pb-0">
                                    {
                                        actions.map((action, index) => (
                                            <div
                                                className="px-4 py-3 text-left cursor-pointer flex items-center"
                                                onDragStart={(e) => onDragStart(e, category, index)}
                                                onDragOver={allowDrop}
                                                onDrop={onDropToSidebar}
                                                draggable>
                                                {action.icon}
                                                <span className="ml-2 text-sm">{action.name}</span>
                                            </div>
                                        ))
                                    }
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }
                </Accordion>
            </div>
            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Replace Action</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to replace the existing action with "{pendingAction?.newAction.name}"?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancelReplace}>Cancel</Button>
                        <Button onClick={handleConfirmReplace}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default App
