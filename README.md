sesemeMonument
==============

The entire SESEME ecosystem.

#Terminology

BRAINS: Individual computers that store information and communicate to their respective components. (Monument, seedling1-3[pi], XPS). All have the property "online".

COMPONENTS: Electronics, usually with visual output: LED strip, Button, Icon, URL, Hue, Motors, Speakers

INPUTS: External user actions - mostly seedling button presses that lead to XPS socket messages. (reject if not ready, fadeCircle/playSound/lightTrail/moveMotors if ready)

FEEDBACKS: Packaged functions that engage a series of components in response to socket messages from XPS. (url, icon, playSound, fadeCircle,  etc.)

#Set Up Information

1. Connect to ssid:OfficeWifi.
2. SSH into the five brains of the SESEME ecosystem:
    - XPS: mint@10.0.1.241
    - Monument: pi replacement: pi@10.0.1.6; beagle: root@10.0.1.210
    - Seedling1: pi@10.0.1.32
    - Seedling2: pi@10.0.1.33
    - Seedling3: pi@10.0.1.34
    - Password: Finest gourmet dining in SF
3. Use `cdss` command to get into SESEME-System-Alpha folder in each brain.
   - Directory: `~/git/SESEME-System-Alpha`
4. Use `start` command to run the node process in each brain.
   - NOTE: Make sure pillars are fully down and motors are powered before `start` in Monument.

#Crash Behaviors
1. If pillars are up and BOTH XPS and Monument crash, we must unplug the motors from power and manually lower the pillars.
   Do not start up both before doing this because it will tell the motors to go beyond max since it does not remember its state.

#Notes
1. If seedling lights are on and you want them to be off while the seedling program isn't running, just start the program and CTRL-C after console.log("strip initialized").



## Seedling Controller
- Notes:
  - Must wait until it says 'Strip initialized' before activating any led ring functions
  - Command to use 3.5mm jack for speakers: $ `sudo amixer cset numid=3 1`
  - Command to increase volume : $ `amixer -c 0 set PCM playback 100% unmute`

- Lights On / Lights Off
  - Controls light to illuminate back of seedling
  - Time to Fade = parameter for duration of fade animation (default = 3 sec)
- Party On / Party Off
  - Activates party mode for hue bulbs
- seseme.net ON / seseme.net OFF
  - Activates the 12 V led strip illuminating the seseme.net lettering
  - Time to Fade = parameter for duration of fade animation (default = 3 sec)
  - Hex Value of Color = parameter for color of led strip (default = FFFFFF)
- Light Trail
  - Activates the light trail animation for the led ring
  - Max Brightness = parameter for adjusting brightness of color out of 255 (default = 255 [100% brightness])
  - Length of Trail = parameter for number of nodes lit in trail (default = 6 nodes)
  - Revolution Time = parameter for time it takes for trail to complete one (default = 1.5 sec)
  - Number of Revolutions = parameter for number of revolutions completed (default = 5)
  - Note: color of light trail set by sliding RGB variables at bottom of controller (no trail displayed if all colors set to 0)
    - Must update in web controller every time seedling.js is restarted
- Fade Circle
  - Activates the animation to fade the circle starting at the top
  - Fade Duration = parameter for duration of fade animation (default = 20 sec)
  - Fill Duration = parameter for duration of fill animation (default = 20 sec)
  - Factor = parameter for brightness of next diode when current diode goes to 0 (default = 1.5)
    - example when diode 1 goes to 0: if factor == 2, diode 2 = 50% brightness; if factor == 3, diode 2 = 33%; if factor == 4, diode 2 = 25%
  - Start Color = parameter in hex for start color of led ring (default = FFFFFF)
  - Stop Color = parameter in hex for stop color of led ring (default = FFFFFF)
  - Stop Percent = parameter to set percentage of led ring that has faded when animation should stop (must be greater than current start percent)
    - Note: When pressing button, hard coded for 25% increments for 4 part story (0% - 25% - 50% - 75% - 100%)
  - Transition = if "t", "true", or "1", colors should have smooth transition from start color to stop color during animation; else fade is start color and fill is stop color (default = false)
  - Chirp Color = parameter in hex of color used for chirp animation (default = FFFFFF)
  - Chirp Duration = parameter for time taken for chirp to execute (default = 0.5 sec)
- Hue Slider: set hue parameter for Hue Bulbs (0-359)
- Sat Slider: set saturation parameter for Hue Bulbs (0-100)
- Bri Slider: set brightness parameter for Hue Bulbs (0-100)
- Red Slider: set red parameter for color of led ring (0-255)
- Green Slider: set green parameter for color of led ring (0-255)
- Blue Slider: set blue parameter for color of led ring (0-255)
- Brightness Slider: set percent of led ring brightness (0-100)
- Percentage Slider: set percent of led ring illuminated (0-100)
