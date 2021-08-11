import { useEffect, RefObject } from "react";

/**
 * Hook that runs a callback function if the user clicks outside a particular referenced element
 */
export default function useUserClickedOutsideElement(
  ref: RefObject<HTMLDivElement>,
  callback: () => void
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: Event) {
      if (ref && ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
