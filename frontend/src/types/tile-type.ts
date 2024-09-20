export type TileType = {
    id: string;
    name: string;
    category: string;
    config: TileConfig;
}

export type TileConfig = {
    title?: string,
    appLocation?: string,
    appArguments?: string,
}