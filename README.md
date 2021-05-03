# Universal-RPC

If you are a user on Discord, you've probably seen the game activity statuses. Some looked like they should not be games such as YouTube, Visual Studio Code, etc.

The main way to create a custom game activity status is to get an RPC library, create code for it, and run it in the terminal. However, that process can be tedious and tiring if you don't know how to program.

In comes Universal-RPC.

This app uses electron-js to provide a frontend for game activity statuses. You can now create/set a custom game activity status with ease.

# Example

![A custom RPC status running on my discord profile](https://files.kingbri.me/app-assets/Universal-RPC/kingbri-rpc.png)

# Installation

### NOTE:

This app MUST be ran on the same OS Discord desktop is located on! This means that you cannot run it in a VM. This is why there are various OS-specific builds.

### Windows

1. Download the latest .exe from releases
2. Double click on the exe (installation occurs automatically)
3. The app should launch with no errors
4. Done. The app can be launched from the start menu by typing `universal-rpc` in the searchbar.

### MacOS (Will be expanded after testing)

1. Download and extract the zipfile
2. Double-click the `.app` file. The app should launch without issues
3. This `.app` file can be moved anywhere on the system, so you can delete the downloaded zip.

### Linux

1. Download the .deb package
2. Install it by doing `sudo dpkg -i <package path>`
3. launch by typing `universal-rpc` in terminal or by launching it from your desktop

## Setup

### Developer portal

Head to the [Discord developer website](https://discordapp.com/developers) and create a new app. From there, copy the client ID. You will need that later.

### On the client:

1. You will be presented with a screen to enter the client ID. Enter it and hit `submit` button.
2. You will now see six text boxes, here is an overview of what to do for each one:
    - RPC title: The title of what you're doing
    - RPC description: The description of what you're doing
    - Large image key: An image key from the RPC section of your app:
    - Large image hover text: The text shown when hovering over the large image
    - Small image key: Same input as `Large image key`
    - Small image hover text: Same as `Large image hover text` except it's for the small image
    - Display time elapsed: Checkbox to show a stopwatch of time elapsed
    - Buttons: There are two buttons. Each one contains two parameters. BOTH must be filled for the button to show up!
        - Name: The name displayed on the RPC button
        - URL: The URL the button navigates to
3. Hit the `Submit` button. It will take a maximum of 15 seconds for your status to update due to Discord ratelimits.
4. Change any of the fields to update the status, or hit the `reset` button if you want to use a new client ID
5. To quit the app, simply close it.

## Removing the application

### Windows

-   Navigate to Programs and Features
-   Search for `universal-rpc`
-   Uninstall the program. It should be cleared from the system.

### MacOS

-   Delete the folder where the application is contained or the `.app` file.

### Linux

-   Run `dpkg -r universal-rpc`

# Planned Features

Here are some of the planned features for later releases:

-   Prettify the application: Currently, the application is just HTML and there's no CSS whatsoever. I want to make the app function properly before doing this.
-   Save/restore configuration files: Manually inputting the title, image, etc every time you want to use the RPC is time consuming. Instead, add a simple save file system that includes the client ID.

# Portable Builds

I do not see a need for portable builds as of yet. However, if you really need a portable build, open an issue and I'll start working on it.

# Contributing

If you have issues with the app:

-   Describe the issue in detail
-   What step are you having issues with: Installation, client ID verification, RPC setting
-   If possible, use `ctrl + shift + i` and navigate to the console. Paste that output in the issue
-   If you have a feature request, please indicate it as so. Planned features are in a different section of the README, so be sure to read those before submitting.

# Developers and Permissions

This app is 100% free and open source. I do not need to or want to make money from this. However, please follow the rules of the Apache-2.0 license if you plan to fork/modify this repository.

Creator/Developer: Brian Dashore

Developer Discord: kingbri#6666

Join the support server here (get the king-updates role to access the channel): [https://discord.gg/pswt7by](https://discord.gg/pswt7by)
