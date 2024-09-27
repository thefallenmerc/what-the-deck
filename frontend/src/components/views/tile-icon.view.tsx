import React from 'react';
import {
    Music, Play, File, SkipForward, SkipBack, Laptop, Volume1,
    Volume2, VolumeX, Mic, Video, Image, Folder, Settings, Power,
    Headphones, Monitor, Speaker, Globe, Maximize,
    X
} from 'lucide-react'

export function TileIcon({
    icon,
    size = 24,
}: {
    icon: string,
    size?: number,
}) {

    const icons = {
        // media
        'play-pause': <Play size={size} />,
        'next': <SkipForward size={size} />,
        'prev': <SkipBack size={size} />,
        'volume-up': <Volume2 size={size} />,
        'volume-down': <Volume1 size={size} />,
        'mute': <VolumeX size={size} />,
        'mic': <Mic size={size} />,
        'headphones': <Headphones size={size} />,
        'speaker': <Speaker size={size} />,
        // window
        'maximize': <Maximize size={size} />,
        'close': <X size={size} />,
        // system
        'music': <Music size={size} />,
        'app': <Laptop size={size} />,
        'video': <Video size={size} />,
        'web': <Globe size={size} />,
        'screenshot': <Image size={size} />,
        'folder': <Folder size={size} />,
        'settings': <Settings size={size} />,
        'power': <Power size={size} />,
        'monitor': <Monitor size={size} />,
        'file': <File size={size} />,
    };

    return (icons as any)[icon] as React.ReactElement;
}