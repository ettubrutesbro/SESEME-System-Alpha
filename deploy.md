# SESEME Deployment Documentation
###### ⚠️ Notice: When starting the system for the first time, start the web server (XPS Mint) first and make sure the monument pillars are fully down and motors are powered on before `deploy`ing the monument Raspberry Pi.

## Contents
_On Mac/Linux_
* [Downloading the Deploy Scripts](#downloading-the-deploy-scripts)
* [Deploying the Main Server](#deploy-server)
* [Deploying the Seedlings](#deploy-seedlings)
* [Deploying the Monument](#deploy-monument)
* [Manual Deployment on Mac/Linux using the Terminal](#Linux)

_On Windows_
* [Manual Deployment on Windows using PuTTY](#Windows)

<a name="downloading-the-deploy-scripts"></a>
## Downloading the Deploy Scripts
Run the command on the terminal:

`git clone https://gist.github.com/5e148dcc65bee7e1ff9172216d00e6aa.git deploy-scripts`
> This downloads the deployment scripts into a folder called `deploy-scripts`

<a name="deploy-server"></a>
## Deploying the Main Server
Run the following commands on the terminal:
* `cd deploy-scripts`
* `chmod +x deploy-server.sh`
* `./deploy-server.sh`
> This logs into the XPS machine and deploys the server.

<a name="deploy-seedlings"></a>
## Deploying the Seedlings
Run the following commands on the terminal:
* `cd deploy-scripts`
* `chmod +x deploy-seedlings.sh`
* `./deploy-server.sh`
> This logs into all of the seedling Raspberry Pis and each individual seedling server.

<a name="deploy-monument"></a>
## Deploying the Monument
Run the following commands on the terminal:
* `cd deploy-scripts`
* `chmod +x deploy-monument.sh`
* `./deploy-server.sh`
> This logs into the monument motors & monument lights Raspberry Pis and starts their individual server.

<a name="Linux"></a>
## Manual Deployment on Mac/Linux using the Terminal
1. In the terminal, ssh into the desired machine using the command `ssh -p (port) (host-name)`.
> For example: To ssh into the XPS, run `ssh -p 22 mint@seseme.net`

| Computer 		  | host-name | port  |
| -------------   |:-------------:	| -----:|
| XPS Mint        | mint@seseme.net	| 22 	|
| Seedling 1      | pi@seseme.net   | 2000  |
| Seedling 2      | pi@seseme.net   | 2001  |
| Seedling 3      | pi@seseme.net   | 2002  |
| Monument Motors | pi@seseme.net   | 2003  |
| Monument Lights | pi@seseme.net   | 2004  |

2. If a prompt appears regarding the "authenticity of the host", simply type in `yes` and press `<Enter>` to continue.
3. If the computer is online, a password prompt like the image below will appear. Type in the password (inputted text will be invisible).
4. Upon a successful login, type `deploy` into the terminal and press `Enter`.

<a name="Windows"></a>
## Manual Deployment on Windows using PuTTY
1. On Windows, download, install, and run [PuTTY](http://the.earth.li/~sgtatham/putty/latest/x86/putty.exe), to see this window:

<img src="https://www.dropbox.com/s/tuxz04cfb9mlqs4/putty.png?dl=1" alt="Drawing" style="width: 500px;"/>

2. In the `Host Name (or IP address)` and `Port` field, type in one of the following to log in to the desired computer:

| Computer 		  | Host Name (or IP address) | Port  |
| -------------   |:-------------:	| -----:|
| XPS Mint        | mint@seseme.net	| 22 	|
| Seedling 1      | pi@seseme.net   | 2000  |
| Seedling 2      | pi@seseme.net   | 2001  |
| Seedling 3      | pi@seseme.net   | 2002  |
| Monument Motors | pi@seseme.net   | 2003  |
| Monument Lights | pi@seseme.net   | 2004  |

3. (Optional) In the `Saved Sessions` input field, type in the computer name, then click `Save` to simply `Load` the login session later for convenience.
4. Click `Open` to start the terminal.
5. Upon a potential security alert such as the following, simply click `Yes`.

<img src="https://www.dropbox.com/s/zahet5050dej9u3/sec%20alert.png?dl=1" alt="Drawing" style="width: 400px;"/>

6. If the computer is online, a password prompt like the image below will appear. Type in the password (inputted text will be invisible).

<img src="https://www.dropbox.com/s/cn8l2c11wlvoiwx/pw%20prompt.png?dl=1" alt="Drawing" style="width: 500px;"/>

7. Upon a successful login, type `deploy` into the terminal and press `Enter`.

### Done! 😁
