import {
  Avatar as Avtr,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function Avatar({ img, fallback,main }) {
  return (
    <Avtr className={cn(main ? "bolck":"hidden md:block","w-14 h-14 ")}>
      {img && <AvatarImage src={img} alt="avatar" />}
      {fallback && (
        <AvatarFallback className="font-bold text-xl text-darkGreen">{fallback}</AvatarFallback>
      )}
    </Avtr>
  );
}
