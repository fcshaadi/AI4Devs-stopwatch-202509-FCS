#LLM: Claude-4.5 sonnet

Primera iteración

#Role: Take the role of an experienced  web developer. 
#Context: I want to create a stopwacht application that gives the user the options of: stopwatch or timer watch. 
Consider that the user of this application will be a person that will want to be able to measure the time it takes to do something or to have a countdown running with a time that has been defined by the user. 
#Desired outcome: The webapp will present the user with the two options to select from, stopwatch or countdown, depending the seleciton, the user will be presented with a stopwatch similar to what is shown in @stopwatch.png where the "start" button will turn into a "pause" button after getting clicked, and then in turn will become a "continue" button; the "Clear" button will reset the clock. On the case the user selects the coundown option, then a similar UI will be presented but with a numeric pad where the user will be allowed to input or delete the desired time; the situation with the "start" and "clear" buttons remains the same. 
#Output style: Do it using@index.html and @@script.js . 
#Q&A: Give me all the questions you need answer before generating the code.

Segunda iteración

Consider the following sentenses to be part of the context:

Time Input for Countdown Timer:
For the countdown timer, the numeric pad will show digits 0 to 9 and as the user inputs each, it will take its place within the position in the format HH:MM:SS:sss. As an example, take the way we input time in a microwave.

The maximum time limit for the countdown will be 99:99:99:000.

Stopwatch Behavior: the stopwatch will display hours, minutes, seconds, and milliseconds (like in the image showing 00:08:00 with 000 milliseconds and it will start from 00:00:00.000.

UI/UX Details: There should be a way to switch between stopwatch and countdown modes after the initial selection.

For the countdown timer, when it reaches 00:00:00, it should show an alert and make a 2 second beep sound.

Button States: When the countdown timer is paused, the "Continue" button will resume from where it left off.

The "Clear" button will reset to 00:00:00

Styling: Create a CSS file to match the visual style shown in the stopwatch.png image.

Additional Features:
- keyboard shortcuts: Space for start/pause, R for reset, numbers can also be typed
- The timer will continue running if the user switches browser tabs.

Let me know when you are ready to create the code.
