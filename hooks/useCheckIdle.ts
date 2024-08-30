import useSolarDataStore from "@/store/useSolarDataStore";
import { useEffect } from "react";

export default () => {
  const { lastTimeChanged, setOnline } = useSolarDataStore();
  useEffect(() => {
    // Function to update the time
    const checkIdle = () => {
      if (lastTimeChanged !== "") {
        const currentTime = new Date();
        const prevTime = new Date(lastTimeChanged.toString());

        // Calculate the time difference in milliseconds
        const timeDifference = currentTime - prevTime;

        // 1 minute is 60,000 milliseconds
        const oneMinuteInMilliseconds = 60 * 1000;

        if (timeDifference >= oneMinuteInMilliseconds) {
          setOnline(false);
        }
      }
    };

    // Set up the interval
    const intervalId = setInterval(checkIdle, 30000); // Runs every 1000 ms (1 second)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
};
