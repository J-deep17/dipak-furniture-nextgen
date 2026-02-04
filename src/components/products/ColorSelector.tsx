import { Color } from "@/types";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColorSelectorProps {
    colors: Color[];
    selectedColor: string;
    onColorSelect: (color: string) => void;
}

const ColorSelector = ({ colors, selectedColor, onColorSelect }: ColorSelectorProps) => {
    if (!colors || colors.length === 0) return null;

    return (
        <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] text-muted-foreground font-medium">Finishes:</span>
            <div className="flex flex-wrap gap-1.5">
                <TooltipProvider>
                    {colors.map((color, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onColorSelect(color.name);
                                    }}
                                    className={cn(
                                        "w-3.5 h-3.5 rounded-full border border-gray-300 transition-all duration-200 relative",
                                        selectedColor === color.name
                                            ? "ring-1 ring-primary ring-offset-1 scale-110"
                                            : "hover:scale-110 hover:border-gray-400"
                                    )}
                                    style={{ backgroundColor: color.hex || "#808080" }}
                                    aria-label={`Select ${color.name}`}
                                >
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="py-1 px-2">
                                <p className="text-[10px] font-semibold">{color.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ColorSelector;
