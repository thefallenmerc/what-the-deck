import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TileType } from '@/types/tile-type';
import { TileIcon } from './tile-icon.view';

export function Tile({
    tile,
    onDragStart,
    onDrop,
    allowDrop,
    onClick,
    size = 28
}: {
    tile: TileType,
    onDragStart?: (e: React.DragEvent) => void,
    onDrop?: (e: React.DragEvent) => void,
    allowDrop?: (e: React.DragEvent<HTMLDivElement>) => void,
    onClick: () => void,
    size?: number,
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={`w-${size} aspect-square border-2 border-zinc-500 bg-zinc-800 flex-grow-0 flex-shrink-0 rounded-2xl transition duration-75 transform active:scale-90 active:border-blue-500 cursor-pointer flex items-center justify-center relative`}
                    draggable
                    onDragStart={onDragStart}
                    onDrop={onDrop}
                    onDragOver={allowDrop}
                    onClick={onClick}
                >
                    <div className="w-full justify-center items-center flex flex-col">
                        {tile ? <TileIcon icon={tile.id} size={(size - 4) * 2} /> : ""}
                        {tile?.config?.title ? <div className="text-sm absolute bottom-1">{tile.config.title}</div> : ""}
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tile ? tile.name : 'Empty Tile'}</p>
            </TooltipContent>
        </Tooltip>
    )
}