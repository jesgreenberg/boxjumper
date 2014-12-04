CT Tool Box
===========

* Description:

	CTToolBox is a Unity tool that allows you to easily download, install, 
update and manage gloops Core Tech tools and middleware within your Unity 
project. The tool box window can be found in the gloops menu in Unity.


* How to add a project to the tool box:

    1) Create a .ctmanifest file in the root of your project (see below).
    2) Make a Bitbucket repository for your project.
    3) Add a line to the ctconfig.txt file with the group/repository name of 
       the Bitbucket project.


* Example .ctmanifest file for DLL projects:

TYPE=DLL
VERSION=0.0.1
DEBUG=Library/CTChat/bin/Debug
RELEASE=Library/CTChat/bin/Release
# Files
CTChat.dll
MiniJson.dll


* Example .ctmanifest file for UnityPackage projects:

TYPE=UnityPackage
VERSION=0.9.0
# Package
cttoolbox.unitypackage
