import { TileConfig, TileType } from '@/types/tile-type'
import { TileIcon } from './tile-icon.view'
import { Tile } from './tile.view'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { OpenFileDialog } from '../../../wailsjs/go/main/App'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { Switch } from '../ui/switch'

export default function TileConfiguration({
  index,
  tile,
  updateConfiguration,
}: {
  index: number,
  tile: TileType,
  updateConfiguration: (index: number, newConfig: TileConfig) => void,
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
                    updateConfiguration(index, newConfig)
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
                              updateConfiguration(index, newConfig)
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
                              updateConfiguration(index, newConfig)
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
                              updateConfiguration(index, newConfig)
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
                {/* web */}
                {
                  tile.id === "web" ? (
                    <div className="flex items-center gap-4 w-full justify-end pb-4">
                      <label className="text-foreground w-[150px] text-left">Launch URL:</label>
                      <Input className="" value={tile.config?.launchUrl} onChange={e => {
                        const newConfig = { ...(tile.config ?? {}) };
                        newConfig["launchUrl"] = e.target.value;
                        updateConfiguration(index, newConfig)
                      }} />
                    </div>
                  ) : <></>
                }
                {/* power */}
                {
                  tile.id === "power" ? (
                    <div className="flex items-center gap-4 w-full justify-end pb-4">
                      <label className="text-foreground w-[150px] text-left">Action:</label>
                      <Select value={tile.config?.action ?? ""} onValueChange={value => {
                        const newConfig = { ...(tile.config ?? {}) };
                        newConfig["action"] = value;
                        updateConfiguration(index, newConfig)
                      }}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Shutdown Action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shutdown">Shutdown</SelectItem>
                          <SelectItem value="restart">Restart</SelectItem>
                          <SelectItem value="sleep">Sleep</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : <></>
                }
                {/* confirm */}
                <div className="flex items-center gap-4 w-full justify-end pb-4">
                  <label className="text-foreground w-[150px] text-left cursor-pointer" htmlFor="confirm">Confirm First:</label>
                  <Switch id="confirm" checked={tile.config?.confirmFirst ?? false} onCheckedChange={checked => {
                    const newConfig = { ...(tile.config ?? {}) };
                    newConfig["confirmFirst"] = checked;
                    updateConfiguration(index, newConfig)
                  }} />
                </div>
              </div>
            </div>
          </div>
        ) : <></>
      }
    </div>
  )
}
