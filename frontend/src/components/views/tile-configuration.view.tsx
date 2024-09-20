import { TileConfig, TileType } from '@/types/tile-type'
import { TileIcon } from './tile-icon.view'
import { Tile } from './tile.view'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { OpenFileDialog } from '../../../wailsjs/go/main/App'

export default function TileConfiguration({
  tile,
  updateConfiguration,
}: {
  tile: TileType,
  updateConfiguration: (tileId: string, newConfig: TileConfig) => void,
}) {

  return (
    <div>
      {
        tile ? (
          <div>
            {/* header */}
            <div className="flex p-4 border-b">
              <div className="font-semibold pr-4">{tile.category}:</div>
              <div>{tile.name}</div>
            </div>
            {/* body */}
            <div className="flex mx-auto w-[480px] py-4 gap-4">
              {/* left side */}
              <div className="pr-12">
                <Tile
                  tile={tile}
                  onDragStart={() => { }}
                  onDrop={() => { }}
                  allowDrop={() => { }}
                  onClick={() => { }} />
              </div>
              {/* right side */}
              <div className="flex-grow">
                {/* title */}
                <div className="flex items-center gap-4 w-full justify-end pb-4">
                  <label className="text-foreground w-[150px] text-left">Title:</label>
                  <Input className="" value={tile.config?.title} onChange={e => {
                    const newConfig = { ...(tile.config ?? {}) };
                    newConfig["title"] = e.target.value;
                    updateConfiguration(tile.id, newConfig)
                  }} />
                </div>
                {/* open/focus app */}
                {
                  tile.id === "app" ? (
                    <>
                      {/* app location */}
                      <div className="flex items-center gap-4 w-full pb-4">
                        <label className="text-foreground w-[150px] text-left">Location:</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input className="" value={tile.config?.appLocation} onChange={e => {
                              const newConfig = { ...(tile.config ?? {}) };
                              newConfig["appLocation"] = e.target.value;
                              updateConfiguration(tile.id, newConfig)
                            }} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tile.config?.appLocation ?? ""}</p>
                          </TooltipContent>
                        </Tooltip>
                        <button
                          className="border p-2 rounded-lg cursor-pointer hover:border-blue-500"
                          onClick={async () => {
                            const location = await OpenFileDialog();
                            if (location) {
                              const newConfig = { ...(tile.config ?? {}) };
                              newConfig["appLocation"] = location;
                              updateConfiguration(tile.id, newConfig)
                            }
                          }}>
                          <TileIcon icon="file" size={4} />
                        </button>
                      </div>
                      {/* app arguments */}
                      <div className="flex items-center gap-4 w-full">
                        <label className="text-foreground w-[150px] text-left">Arguments:</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input className="" value={tile.config?.appArguments} onChange={e => {
                              const newConfig = { ...(tile.config ?? {}) };
                              newConfig["appArguments"] = e.target.value;
                              updateConfiguration(tile.id, newConfig)
                            }} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tile.config?.appArguments ?? ""}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </>
                  ) : <></>
                }
              </div>
            </div>
          </div>
        ) : <></>
      }
    </div>
  )
}
