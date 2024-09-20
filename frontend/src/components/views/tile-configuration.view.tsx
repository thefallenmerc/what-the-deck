import { TileType } from '@/types/tile-type'

export default function TileConfiguration({ tile }: { tile: TileType }) {
  return (
    <div>
      {
        tile ? (
          <div>
            <div className="flex p-4 border-b">
              <div className="font-semibold pr-4">{tile.category}:</div>
              <div>{tile.name}</div>
            </div>
          </div>
        ) : <></>
      }
    </div>
  )
}
