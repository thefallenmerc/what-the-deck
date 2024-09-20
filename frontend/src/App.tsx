import { DragEventHandler, useEffect, useRef, useState } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Laptop, Volume2, VolumeX, Mic, Video, Image, Folder, Settings, Power, Headphones, Monitor, Speaker } from 'lucide-react'
import './App.css';
import { GetTiles, SaveTiles, OpenFileDialog } from "../wailsjs/go/main/App";
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import TileConfiguration from './components/views/tile-configuration.view';
import { TileType } from './types/tile-type';

function getIcon(name: string) {
    const icons = {
        'play-pause': <Play className="w-6 h-6" />,
        'next': <SkipForward className="w-6 h-6" />,
        'prev': <SkipBack className="w-6 h-6" />,
        'volume-up': <Volume2 className="w-6 h-6" />,
        'volume-down': <VolumeX className="w-6 h-6" />,
        'mic': <Mic className="w-6 h-6" />,
        'headphones': <Headphones className="w-6 h-6" />,
        'speaker': <Speaker className="w-6 h-6" />,
        'music': <Music className="w-6 h-6" />,
        'app': <Laptop className="w-6 h-6" />,
        'video': <Video className="w-6 h-6" />,
        'screenshot': <Image className="w-6 h-6" />,
        'folder': <Folder className="w-6 h-6" />,
        'settings': <Settings className="w-6 h-6" />,
        'power': <Power className="w-6 h-6" />,
        'monitor': <Monitor className="w-6 h-6" />,
    };

    return (icons as any)[name] as React.ReactNode;
}

// Available actions grouped by category
const availableActions = {
    "Media Controls": [
        { id: 'play-pause', name: 'Play / Pause' },
        { id: 'next', name: 'Next Track' },
        { id: 'prev', name: 'Previous Track' },
        { id: 'volume-up', name: 'Volume Up' },
        { id: 'volume-down', name: 'Volume Down' },
    ],
    "Audio": [
        { id: 'mic', name: 'Toggle Mic' },
        { id: 'headphones', name: 'Toggle Headphones' },
        { id: 'speaker', name: 'Toggle Speaker' },
    ],
    "Applications": [
        { id: 'music', name: 'Open Music App' },
        { id: 'app', name: 'Open App' },
        { id: 'video', name: 'Open Video App' },
    ],
    "System": [
        { id: 'screenshot', name: 'Take Screenshot' },
        { id: 'folder', name: 'Open Folder' },
        { id: 'settings', name: 'Open Settings' },
        { id: 'power', name: 'Power Options' },
        { id: 'monitor', name: 'Switch Display' },
    ],
}

function App() {
    // states
    const draggedItem = useRef<{ category: string; index: number } | null>(null)
    const [tiles, setTiles] = useState(Array(15).fill(null))
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [pendingAction, setPendingAction] = useState<{ targetIndex: number; newAction: any, category: string } | null>(null)
    const [selectedTile, setSelectedTile] = useState<number | null>(null)

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

    async function getTiles() {
        const stringifiedTiles = await GetTiles();
        const tiles = JSON.parse(stringifiedTiles) as TileType[];
        console.log("tiles", tiles);
        setTiles(tiles);
    }

    async function saveTiles(tiles: TileType[]) {
        SaveTiles(JSON.stringify(tiles, null, 2));
    }

    useEffect(() => {
        getTiles();
    }, []);

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
                setPendingAction({ targetIndex, newAction, category })
                setShowConfirmDialog(true)
            } else {
                const newTiles = [...tiles]
                newTiles[targetIndex] = { ...newAction, category }
                setTiles(newTiles)
                setSelectedTile(targetIndex)
                saveTiles(newTiles);
            }
        } else {
            const newTiles = [...tiles]
            const draggedTile = newTiles[index]
            newTiles[index] = newTiles[targetIndex]
            newTiles[targetIndex] = draggedTile
            setTiles(newTiles)
            saveTiles(newTiles);
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
        setSelectedTile(null)
        draggedItem.current = null
    }

    const handleConfirmReplace = () => {
        if (pendingAction) {
            const newTiles = [...tiles]
            newTiles[pendingAction.targetIndex] = { ...pendingAction.newAction, category: pendingAction.category }
            setTiles(newTiles)
            setSelectedTile(pendingAction.targetIndex)
            setShowConfirmDialog(false)
            setPendingAction(null)
        }
    }

    const handleCancelReplace = () => {
        setShowConfirmDialog(false)
        setPendingAction(null)
    }

    const handleTileClick = (index: number) => {
        setSelectedTile(index)
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
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <div
                                            key={index}
                                            className="w-[72px] aspect-square border-2 border-zinc-500 bg-zinc-800 flex-grow-0 flex-shrink-0 rounded-2xl transition transform active:scale-90 active:border-blue-500 cursor-pointer flex items-center justify-center"
                                            draggable
                                            onDragStart={(e) => onDragStart(e, 'tile', index)}
                                            onDrop={(e) => onDrop(e, index)}
                                            onDragOver={allowDrop}
                                            onClick={() => handleTileClick(index)}
                                        >
                                            <div className="w-full justify-center flex">{tile ? getIcon(tile.id) : ""}</div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{tile ? tile.name : 'Empty Tile'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))
                        }
                    </div>
                </div>
                {/* details tab */}
                <div className="flex-shrink-0 h-[320px] border-t border-gray-900">
                    {
                        selectedTile || selectedTile === 0 ? <TileConfiguration tile={tiles[selectedTile]} /> : <></>
                    }
                </div>
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
                                                {getIcon(action.id)}
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
