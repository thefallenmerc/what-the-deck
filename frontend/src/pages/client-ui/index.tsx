import React, { useEffect, useState } from 'react';

// shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// views
import { Tile } from '@/components/views/tile.view';
import { TileType } from '@/types/tile-type';
import { VerticalSlider } from '@/components/ui/vertical-slider';
import { ExpandIcon, XIcon } from 'lucide-react';
import { CheckIcon } from '@radix-ui/react-icons';

export function ClientUI() {
    // states
    const [tiles, setTiles] = useState<TileType[]>(Array(15).fill(null))
    const [volume, setVolume] = useState<number>(0);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [confirmIndex, setConfirmIndex] = useState<number>(-1);
    useEffect(() => {
        fetchTiles();
        fetchVolume();
    }, []);

    async function fetchTiles() {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/tiles");
        const data = await response.json();
        setTiles(data as TileType[]);
    }

    async function fetchVolume() {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/volume");
        const data = await response.json();
        setVolume(data.level);
    }

    async function executeTile(index: number) {
        await fetch(import.meta.env.VITE_API_URL + `/api/action/${index}/execute`);
        // if event is volume up or down or mute, then fetch volume
        if (tiles[index].id === "volume-up" || tiles[index].id === "volume-down" || tiles[index].id === "volume-mute") {
            await fetchVolume();
        }
    }

    async function handleTileClick(index: number) {
        // check if confirm first is true
        if (tiles[index].config?.confirmFirst) {
            // show confirm dialog
            setConfirmOpen(true);
            setConfirmIndex(index);
        } else {
            executeTile(index);
        }
    }

    async function toggleFullscreen(e: React.MouseEvent<HTMLDivElement>) {
        if (!document.fullscreenElement) {
            document.documentElement?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    async function changeVolume(volume: number) {
        await fetch(import.meta.env.VITE_API_URL + `/api/volume/${volume}`);
    }

    return (
        <div id="client-ui" className="ClientUI flex h-screen items-center justify-center">
            <div className="slider flex flex-col gap-4 items-center pr-8 pl-4">
                <div className="flex items-center" onClick={toggleFullscreen}>
                    <ExpandIcon className="w-6 h-6 cursor-pointer text-background" />
                </div>
                <VerticalSlider
                    key={volume}
                    defaultValue={[volume]}
                    max={100}
                    step={1}
                    className="relative flex h-48 w-4 touch-none select-none"
                    onClick={e => e.stopPropagation()}
                    onValueCommit={(value) => changeVolume(value[0])} />
            </div>
            <div className="grid grid-cols-5 gap-4" onClick={e => e.stopPropagation()}>
                {
                    tiles.map((tile, index) => (
                        <Tile
                            key={index}
                            tile={tile}
                            onClick={() => handleTileClick(index)}
                            size={28} />
                    ))
                }
            </div>
            {/* confirm dialog */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-4xl text-center">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-3xl text-center py-4">
                            This will execute the action.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row gap-4 w-full justify-center sm:justify-center">
                        <AlertDialogCancel className="h-24 w-24 text-xl">
                            <XIcon className="w-12 h-12" />
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="h-24 w-24 text-xl"
                            onClick={() => executeTile(confirmIndex)}>
                            <CheckIcon className="w-12 h-12" />
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
