import { DragEventHandler, useEffect, useRef, useState } from 'react';
import { GetTiles, SaveTiles, OpenFileDialog } from "../wailsjs/go/main/App";
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import TileConfiguration from './components/views/tile-configuration.view';
import { TileConfig, TileType } from './types/tile-type';
import { TileIcon } from './components/views/tile-icon.view';
import { Tile } from './components/views/tile.view';

import './App.css';

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
        { id: 'mic', name: 'Toggle Mic', disabled: true },
        { id: 'headphones', name: 'Toggle Headphones', disabled: true },
        { id: 'speaker', name: 'Toggle Speaker', disabled: true },
    ],
    "Applications": [
        { id: 'music', name: 'Open Music App', disabled: true },
        { id: 'app', name: 'Open App' },
        { id: 'video', name: 'Open Video App', disabled: true },
    ],
    "System": [
        { id: 'screenshot', name: 'Take Screenshot', disabled: true },
        { id: 'folder', name: 'Open Folder', disabled: true },
        { id: 'settings', name: 'Open Settings', disabled: true },
        { id: 'power', name: 'Power Options', disabled: true },
        { id: 'monitor', name: 'Switch Display', disabled: true },
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

    const updateConfiguration = (tileId: string, newConfig: TileConfig) => {
        const targetIndex = tiles.findIndex(t => t?.id === tileId);
        if (targetIndex > -1) {
            const newTiles = [...tiles]
            const newTile = newTiles[targetIndex];
            newTiles[targetIndex] = { ...newTile, config: newConfig };
            setTiles(newTiles);
            saveTiles(newTiles);
        }
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
                                        <Tile
                                            tile={tile}
                                            onDragStart={(e) => onDragStart(e, 'tile', index)}
                                            onDrop={(e) => onDrop(e, index)}
                                            allowDrop={allowDrop}
                                            onClick={() => handleTileClick(index)} />
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
                        selectedTile || selectedTile === 0
                            ? <TileConfiguration
                                key={selectedTile}
                                tile={tiles[selectedTile]}
                                updateConfiguration={updateConfiguration} />
                            : <></>
                    }
                </div>
            </div>
            {/* sidebar */}
            <div className="flex-shrink-0 block w-[270px] border-l border-gray-900 h-screen overflow-y-auto overflow-x-hidden">
                <Accordion type="multiple" className="w-full" defaultValue={Object.keys(availableActions)}>
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
                                                <TileIcon icon={action.id} />
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
