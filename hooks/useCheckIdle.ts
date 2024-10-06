import useSolarDataStore from "@/store/useSolarDataStore";
import { useEffect } from "react";

export default () => {
  const { lastTimeChanged, isOnline, setOnline } = useSolarDataStore();
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
        console.log(
          "time diff: ",
          timeDifference,
          currentTime.getUTCMilliseconds(),
          prevTime.getUTCMilliseconds()
        );

        if (timeDifference >= oneMinuteInMilliseconds) {
          setOnline(false);
        }
      }
    };

    // Set up the interval
    const intervalId = setInterval(checkIdle, 3000); // Runs every 3000 ms (3 seconds)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [lastTimeChanged]);
};
