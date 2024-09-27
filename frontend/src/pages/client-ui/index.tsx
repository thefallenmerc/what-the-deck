import React, { useEffect, useState } from 'react';

// shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// views
import { Tile } from '@/components/views/tile.view';
import { TileType } from '@/types/tile-type';

export function ClientUI() {
    // states
    const [tiles, setTiles] = useState<TileType[]>(Array(15).fill(null))

    useEffect(() => {
        fetchTiles();
    }, []);

    async function fetchTiles() {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/tiles");
        const data = await response.json();
        setTiles(data as TileType[]);
    }

    async function executeTile(index: number) {
        await fetch(import.meta.env.VITE_API_URL + `/api/action/${index}/execute`);
    }

    async function handleTileClick(index: number) {
        executeTile(index);
    }
    
    async function toggleFullscreen(e: React.MouseEvent<HTMLDivElement>) {

        if (!document.fullscreenElement) {
            e.currentTarget.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    return (
        <div className="ClientUI flex h-screen items-center justify-center" onClick={toggleFullscreen}>
            <div className="grid grid-cols-5 gap-4" onClick={e => e.stopPropagation()}>
                {
                    tiles.map((tile, index) => (
                        <Tile
                            key={index}
                            tile={tile}
                            onClick={() => handleTileClick(index)}
                            size={120} />
                    ))
                }
            </div>
        </div>
    )
}