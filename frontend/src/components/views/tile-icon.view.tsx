import React from 'react';
import { Music, Play, File, SkipForward, SkipBack, Laptop, Volume2, VolumeX, Mic, Video, Image, Folder, Settings, Power, Headphones, Monitor, Speaker } from 'lucide-react'

export function TileIcon({
    icon,
    size = 6,
}: {
    icon: string,
    size?: number,
}) {

    const className = `w-${size} h-${size}`;

    const icons = {
        'play-pause': <Play className={className} />,
        'next': <SkipForward className={className} />,
        'prev': <SkipBack className={className} />,
        'volume-up': <Volume2 className={className} />,
        'volume-down': <VolumeX className={className} />,
        'mic': <Mic className={className} />,
        'headphones': <Headphones className={className} />,
        'speaker': <Speaker className={className} />,
        'music': <Music className={className} />,
        'app': <Laptop className={className} />,
        'video': <Video className={className} />,
        'screenshot': <Image className={className} />,
        'folder': <Folder className={className} />,
        'settings': <Settings className={className} />,
        'power': <Power className={className} />,
        'monitor': <Monitor className={className} />,
        'file': <File className={className} />,
    };

    return (icons as any)[icon] as React.ReactElement;
}