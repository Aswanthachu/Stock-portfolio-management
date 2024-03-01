import { setApiLimitError } from "@/Redux/Features/core";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import WarningOpen from "@/assets/audio/WarningOpen.wav";

import { Howl } from "howler";

export const playSound = (soundUrl) => {
  const sound = new Howl({
    src: [soundUrl],
  });
  sound.play();
};

export default function ApiLimitWarning() {
  const buttonRef = useRef(null);

  const { toast } = useToast();
  const dispatch = useDispatch();

  const apiLimitError = useSelector((state) => state.core.apiLimitError);

  const closeApiLimitError = () => {
    dispatch(setApiLimitError(false));
  };

  useEffect(() => {
    if (apiLimitError) {
      playSound(WarningOpen);
      buttonRef.current.click();
    }
    return closeApiLimitError();
  }, [apiLimitError, closeApiLimitError]);

  return (
    <>
      <Button
        variant="outline"
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true)
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request,Too many requests, please try again later.",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => window.location.reload()}
              >
                Try again
              </ToastAction>
            ),
          });
        }}
        className="hidden"
      />
    </>
  );
}
