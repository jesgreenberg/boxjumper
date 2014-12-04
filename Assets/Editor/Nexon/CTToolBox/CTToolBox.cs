/**
 * @file CTToolBox.cs
 * 
 * Copyright (C) 2013 Nexon M - Core Tech
 */

using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;

/**
 * Editor window for managing external Core Tech projects.
 */
public class CTToolBox : EditorWindow
{
	[MenuItem("NexonM/Tool Box...")]
	private static void OpenToolBoxWindow()
	{
		EditorWindow.FocusWindowIfItsOpen(typeof(CTToolBox));
		
		CTToolBox toolboxWindow = EditorWindow.GetWindow<CTToolBox>("CT Tool Box", true, typeof(SceneView));	// make the window dockable
		toolboxWindow.Init();
		toolboxWindow.Show();
		toolboxWindow.position = new Rect(100, 100, 650, 500);		// undock the window from the SceneView tab
	}
	
	private enum ToolType
	{
		Unknown,
		UnityPackage,
		DLL
	}
	
	private enum DownloadStatus
	{
		Unknown,		// status hasn't been checked yet
		NotDownloaded,	// project has not been downloaded
		NeedsUpdate,	// project has already been downloaded, but an updated version is now available
		LocalChanges,	// project has local changes
		UpToDate,		// latest version is currently downloaded
	}
	
	private enum InstallStatus
	{
		Unknown,		// install state hasn't been checked yet
		NotInstalled,	// project is not installed
		Imported,		// the package has been imported (if this project hosts a .unitypackage)
		Debug,			// debug version is installed (if this is a DLL)
		Release,		// release version is installed (if this is a DLL)
		Updated			// the project is installed, but an updated version was downloaded
	}
	
	private class ToolConfig
	{
		public string name;
		public string repoName;
		public string path;
		public int currentBranch;
		public List<string> branches;
		public DownloadStatus download;
		public InstallStatus install;
		public ToolManifest manifest;
	}
	
	private class ToolManifest
	{
		public ToolType type;
		public string version;
		public string debugPath;
		public string releasePath;
		public List<string> files = new List<string>();
	}
	
	private bool _settingsExpanded = true;
	private bool _verbose = false;
	private string _pathToRoot = "/path/to/repositories";
	private string _pathToGit = "/usr/local/git/bin/git";
	private string _bitbucketUser = "";
	private string _bitbucketPasswd = "";
	private List<ToolConfig> _toolConfigs = new List<ToolConfig>();
	
	private const string PREFS_ROOT		= "NEXON_CT_ROOT";
	private const string PREFS_USER		= "NEXON_CT_BBUSER";
	private const string PREFS_PASSWD	= "NEXON_CT_BBPASS";
	private const string PREFS_VERBOSE	= "NEXON_CT_VERBOSE";
	
	private const string PATH_TO_PLUGINS = "Assets/Plugins";
	private const string PATH_TO_CONFIG = "Assets/Editor/Nexon/CTToolBox/ctconfig.txt";
	private const string MANIFEST = ".ctmanifest";
	private const string MANIFEST_TYPE_PREFIX = "TYPE=";
	private const string MANIFEST_VERSION_PREFIX = "VERSION=";
	private const string MANIFEST_DEBUG_PREFIX = "DEBUG=";
	private const string MANIFEST_RELEASE_PREFIX = "RELEASE=";
	
#region Project Management
	
	public void Init()
	{
		LoadPrefs();
		LoadGit();
		LoadToolBox();
	}
	
	private void SavePrefs()
	{
		PlayerPrefs.SetString(PREFS_ROOT, _pathToRoot);
		PlayerPrefs.SetString(PREFS_USER, _bitbucketUser);
		PlayerPrefs.SetString(PREFS_PASSWD, _bitbucketPasswd);
		PlayerPrefs.SetInt(PREFS_VERBOSE, (_verbose ? 1 : 0));
		PlayerPrefs.Save();
	}
	
	private void LoadPrefs()
	{
		_pathToRoot = PlayerPrefs.GetString(PREFS_ROOT);
		_bitbucketUser = PlayerPrefs.GetString(PREFS_USER);
		_bitbucketPasswd = PlayerPrefs.GetString(PREFS_PASSWD);
		int verbose = PlayerPrefs.GetInt(PREFS_VERBOSE);
		_verbose = (verbose == 0 ? false : true);
	}
	
	private void LoadGit()
	{
		if (!File.Exists(_pathToGit))
		{
			_pathToGit = "";
			
			List<string> whichGit = ExecuteCommand("/usr/bin/which", new string[] { "git" });
			if (whichGit.Count > 0 && File.Exists(whichGit[0]))
			{
				_pathToGit = whichGit[0];
			}
		}
	}
	
	private void LoadToolBox()
	{
		_toolConfigs.Clear();
		
		List<string> toolNames = new List<string>();
		
		if (!File.Exists(PATH_TO_CONFIG))
		{
			UnityEngine.Debug.LogError("Missing CTToolBox config file: " + PATH_TO_CONFIG);
			return;
		}
		
		// read list of all available tools
		using (StreamReader streamReader = new StreamReader(PATH_TO_CONFIG))
		{
			string line;
			while ((line = streamReader.ReadLine()) != null)
			{
				if (!string.IsNullOrEmpty(line))
				{
					toolNames.Add(line);
				}
			}
		}
		
		// check the status of each tool
		foreach (string toolName in toolNames)
		{
			ToolConfig config = LoadToolConfig(toolName);
			_toolConfigs.Add(config);
		}
		
		UnityEngine.Debug.Log("Loaded Tool Box");
	}
	
	private ToolConfig LoadToolConfig(string toolName)
	{
		ToolConfig config = new ToolConfig();
		
		config.name = toolName;
		config.repoName = toolName.Substring(toolName.IndexOf('/') + 1);
		config.path = _pathToRoot + "/" + config.repoName;
		config.branches = GetListOfBranches(config, out config.currentBranch);
		config.download = GetDownloadStatus(config);
		config.install = GetInstallStatus(config);
		config.manifest = GetToolManifest(config);
		
		return config;
	}
	
	private ToolManifest GetToolManifest(ToolConfig config)
	{
		ToolManifest manifest = new ToolManifest();
		
		string pathToManifest = config.path + "/" + MANIFEST;
		
		if (File.Exists(pathToManifest))
		{
			using (StreamReader streamReader = new StreamReader(pathToManifest))
			{
				string line;
				while ((line = streamReader.ReadLine()) != null)
				{
					if (line.StartsWith("#"))
					{
						continue;	// ignore comments
					}
					
					if (line.StartsWith(MANIFEST_TYPE_PREFIX))
					{
						line = line.Replace(MANIFEST_TYPE_PREFIX, "");
						foreach (ToolType checkType in System.Enum.GetValues(typeof(ToolType)) as ToolType[])
						{
							if (line == checkType.ToString())
							{
								manifest.type = checkType;
								break;
							}
						}
					}
					else if (line.StartsWith(MANIFEST_VERSION_PREFIX))
					{
						manifest.version = line.Replace(MANIFEST_VERSION_PREFIX, "");
					}
					else if (line.StartsWith(MANIFEST_DEBUG_PREFIX))
					{
						manifest.debugPath = line.Replace(MANIFEST_DEBUG_PREFIX, "");
					}
					else if (line.StartsWith(MANIFEST_RELEASE_PREFIX))
					{
						manifest.releasePath = line.Replace(MANIFEST_RELEASE_PREFIX, "");
					}
					else if (!string.IsNullOrEmpty(line))
					{
						manifest.files.Add(line);
					}
				}
			}
		}
		
		return manifest;
	}
	
	private List<string> GetListOfBranches(ToolConfig config, out int currentBranch)
	{
		currentBranch = 0;
		List<string> listOfBranches = new List<string>();
		
		List<string> branches;
		if (ExecuteGitCommand("branch", config.path, out branches))
		{
			for (int i = 0; i < branches.Count; i++)
			{
				string line = branches[i];
				
				if (line.Contains("* "))
				{
					currentBranch = i;
				}
				
				string branchName = line.Trim().Replace("* ", "");	// cleanup the git output
				
				listOfBranches.Add(branchName);
			}
		}
		
		return listOfBranches;
	}
	
	private DownloadStatus GetDownloadStatus(ToolConfig config)
	{
		DownloadStatus status = DownloadStatus.NotDownloaded;
		
		if (Directory.Exists(config.path))
		{
			List<string> output;
			
			if (File.Exists(config.path + "/" + MANIFEST))
			{
				status = DownloadStatus.UpToDate;
			}
			
			if (ExecuteGitCommand("fetch", config.path, out output))
			{
				//if (ExecuteGitCommand("status -u no", config.path, out output))
				if (ExecuteGitCommand("status", config.path, out output))
				{
					status = DownloadStatus.UpToDate;
					
					foreach (string line in output)
					{
						if (line.Contains("Changes not staged") ||
							line.Contains("branch is ahead"))
						{
							status = DownloadStatus.LocalChanges;
							// don't break here, check all output and give priority to LocalChanges
						}
						else if (line.Contains("branch is behind"))
						{
							status = DownloadStatus.NeedsUpdate;
						}
					}
				}
			}
		}
		
		return status;
	}
	
	private InstallStatus GetInstallStatus(ToolConfig config)
	{
		InstallStatus status = InstallStatus.NotInstalled;
		
		string installKey = GetPrefsInstallKey(config);
		if (PlayerPrefs.HasKey(installKey))
		{
			string val = PlayerPrefs.GetString(installKey);
			foreach (InstallStatus checkStatus in System.Enum.GetValues(typeof(InstallStatus)) as InstallStatus[])
			{
				if (val == checkStatus.ToString())
				{
					status = checkStatus;
					break;
				}
			}
		}
		
		return status;
	}
	
	private void SetInstallStatus(ToolConfig config, InstallStatus status)
	{
		config.install = status;
		
		string installKey = GetPrefsInstallKey(config);
		PlayerPrefs.SetString(installKey, status.ToString());
		PlayerPrefs.Save();
	}
	
	private string GetPrefsInstallKey(ToolConfig config)
	{
		string[] projectPath = Application.dataPath.Split('/');
		string projectName = projectPath[projectPath.Length - 2];
		string installKey = "NEXON_CT_" + projectName + "_" + config.repoName;
		return installKey;
	}
	
	private void DownloadTool(ToolConfig config)
	{
		if (string.IsNullOrEmpty(_bitbucketUser) ||
			string.IsNullOrEmpty(_bitbucketPasswd) )
		{
			UnityEngine.Debug.LogError("Missing Bitbucket credentials! Please enter your Bitbucket username and password in the settings.");
			EditorUtility.DisplayDialog("Missing Bitbucket Credentials", "Please enter your Bitbucket username and password in the settings.", "Ok");
			return;
		}
		
		bool wasDownloaded = (config.download != DownloadStatus.Unknown && config.download != DownloadStatus.NotDownloaded);
		
		config.download = DownloadStatus.NotDownloaded;
		
		List<string> output;
		if (ExecuteGitCommand("clone https://" + _bitbucketUser + ":" + _bitbucketPasswd + "@bitbucket.org/" + config.name, _pathToRoot, out output))
		{
			UnityEngine.Debug.Log("Downloaded project " + config.repoName);
			
			if (wasDownloaded || (config.install != InstallStatus.Unknown && config.install != InstallStatus.NotInstalled))
			{
				SetInstallStatus(config, InstallStatus.Updated);
			}
			
			config.download = GetDownloadStatus(config);
			config.manifest = GetToolManifest(config);
			config.branches = GetListOfBranches(config, out config.currentBranch);
			
			if (config.name == "cttoolbox")
			{
				LoadToolBox();	// reload the entire toolbox in case our ctconfig.txt was updated
			}
		}
	}
	
	private void UpdateTool(ToolConfig config)
	{
		List<string> output;
		if (ExecuteGitCommand("pull", config.path, out output))
		{
			UnityEngine.Debug.Log("Updated project " + config.repoName);
			
			if (config.download != DownloadStatus.Unknown && config.download != DownloadStatus.NotDownloaded)
			{
				SetInstallStatus(config, InstallStatus.Updated);
			}
			
			config.download = DownloadStatus.UpToDate;
			config.manifest = GetToolManifest(config);
		}
	}
	
	private void SwitchToBranch(ToolConfig config, int selectedIndex)
	{
		List<string> output;
		if (ExecuteGitCommand("checkout -q -f " + config.branches[selectedIndex], config.path, out output))
		{
			UnityEngine.Debug.Log(config.repoName + " switched branch to " + config.branches[selectedIndex]);
			
			config.currentBranch = selectedIndex;
			config.download = GetDownloadStatus(config);
		}
	}
	
	private void InstallTool(ToolConfig config, InstallStatus installMethod)
	{
		if (config.manifest == null ||
			config.manifest.files.Count <= 0)
		{
			UnityEngine.Debug.LogError("Failed to install package: manifest is corrupted");
			return;
		}
		
		if (installMethod == InstallStatus.Imported)
		{
			// we could make this interactive, but there is no way to query the user's choice, and we could end up with a bad install status
			AssetDatabase.ImportPackage(config.path + "/" + config.manifest.files[0], false);
			
			SetInstallStatus(config, InstallStatus.Imported);
			
			UnityEngine.Debug.Log("Imported package " + config.repoName);
		}
		else if (installMethod == InstallStatus.Debug || installMethod == InstallStatus.Release)
		{
			string srcPath = config.path + "/" + (installMethod == InstallStatus.Debug ? config.manifest.debugPath : config.manifest.releasePath);
			
			if (Directory.Exists(srcPath))
			{
				try
				{
					if (!Directory.Exists(PATH_TO_PLUGINS))
					{
						Directory.CreateDirectory(PATH_TO_PLUGINS);
					}
					
					foreach (string file in config.manifest.files)
					{
						string src = srcPath + "/" + file;
						string dest = PATH_TO_PLUGINS + "/" + file;
						
						if (_verbose)
						{
							UnityEngine.Debug.Log(" > cp " + src + " " + dest);
						}
						
						File.Copy(src, dest, true);
					}
					
					SetInstallStatus(config, installMethod);
					
					UnityEngine.Debug.Log("Installed project " + config.repoName);
					
					AssetDatabase.Refresh();
				}
				catch (System.Exception err)
				{
					UnityEngine.Debug.LogError("Failed to install package: " + err.Message);
				}
			}
			else
			{
				UnityEngine.Debug.LogError("Failed to install package: " + installMethod + " path not found (" + srcPath + ")");
			}
		}
	}
	
	private void UninstallTool(ToolConfig config)
	{
		if (config.install == InstallStatus.Debug ||
			config.install == InstallStatus.Release)
		{
			if (config.manifest != null && config.manifest.files.Count > 0)
			{
				try
				{
					foreach (string file in config.manifest.files)
					{
						string src = PATH_TO_PLUGINS + "/" + file;
						
						if (_verbose)
						{
							UnityEngine.Debug.Log(" > rm " + src);
						}
						
						File.Delete(src);
					}
					
					SetInstallStatus(config, InstallStatus.NotInstalled);
					
					AssetDatabase.Refresh();
					
					UnityEngine.Debug.Log("Uninstalled project " + config.repoName);
				}
				catch (System.Exception err)
				{
					UnityEngine.Debug.LogError("Failed to install package: " + err.Message);
				}
			}
			else
			{
				UnityEngine.Debug.LogError("Failed to uninstall package: manifest is corrupted");
			}
		}
		else
		{
			UnityEngine.Debug.LogWarning("Uninstall not yet supported for this package type.");
			EditorUtility.DisplayDialog("Uninstall not supported!", "Uninstall not yet supported for this package type.", "Ok");
		}
	}
	
	private void OpenInFinder(ToolConfig config)
	{
		ExecuteCommand("/usr/bin/open", new string[] { config.path }, false);
	}
	
#endregion
	
#region GUI
	
	private void OnFocus()
	{
		if (_toolConfigs.Count <= 0)
		{
			LoadToolBox();
		}
	}
	
	private void OnGUI()
	{
		/*
		if (Event.current.type != EventType.Layout &&
			_toolConfigs.Count <= 0)
		{
			LoadToolBox();
			return;
		}
		*/
		
		_settingsExpanded = EditorGUILayout.Foldout(_settingsExpanded, "Settings");
		if (_settingsExpanded)
		{
			EditorGUI.indentLevel += 2;
			
			OnSettingsGUI();
			
			EditorGUI.indentLevel -= 2;
		}
		
		EditorGUILayout.Separator();
		EditorGUILayout.Separator();
		
		GUILayout.BeginHorizontal();
		EditorGUILayout.Foldout(true, "Tool Box");
		if (GuiButton("Refresh All", true, 100))
		{
			LoadToolBox();
		}
		GUILayout.EndHorizontal();
		
		if (_toolConfigs.Count > 0)
		{
			EditorGUILayout.Separator();
			
			foreach (ToolConfig config in _toolConfigs)
			{
				OnToolConfigGUI(config);
				
				EditorGUILayout.Separator();
			}
		}
		else
		{
			GUI.color = Color.red;
			EditorGUILayout.LabelField("No tools found, check your config file: " + PATH_TO_CONFIG);
			GUI.color = Color.white;
		}
	}
	
	private void OnSettingsGUI()
	{
		GUILayout.BeginHorizontal();
		{
			GUI.color = Directory.Exists(_pathToRoot) ? Color.white : Color.red;
			_pathToRoot = EditorGUILayout.TextField("Download Path", _pathToRoot, GUILayout.MinWidth(450), GUILayout.MaxWidth(450));
			GUI.color = Color.white;
			
			if (GUILayout.Button("...", GUILayout.MinWidth(30), GUILayout.MaxWidth(30)))
			{
				string newRoot = EditorUtility.OpenFolderPanel("Select the download location of NexonM CT projects:", _pathToRoot, "");
				if (!string.IsNullOrEmpty(newRoot))
				{
					_pathToRoot = newRoot;
					GUI.FocusControl("");
					LoadToolBox();
				}
			}
		}
		GUILayout.EndHorizontal();
		
		_verbose = EditorGUILayout.Toggle("Verbose Output", _verbose);
		
		EditorGUILayout.Separator();
		
		if (string.IsNullOrEmpty(_pathToGit))
		{
			if (GuiButton("Install git"))
			{
				Application.OpenURL("http://git-scm.com/downloads");
			}
		}
		else
		{
			EditorGUILayout.LabelField("Bitbucket Settings");
			EditorGUI.indentLevel += 1;
			_bitbucketUser = EditorGUILayout.TextField("Username", _bitbucketUser, GUILayout.MinWidth(300), GUILayout.MaxWidth(300));
			_bitbucketPasswd = EditorGUILayout.PasswordField("Password", _bitbucketPasswd, GUILayout.MinWidth(300), GUILayout.MaxWidth(300));
			EditorGUI.indentLevel -= 1;
		}
		
		EditorGUILayout.Separator();
		
		if (GuiButton("Save Settings"))
		{
			SavePrefs();
			UnityEngine.Debug.Log("Saved CTToolBox Settings!");
		}
	}
	
	private void OnToolConfigGUI(ToolConfig config)
	{
		GUILayout.BeginHorizontal();
		{
			//ToolLabel(config.repoName, Color.white, 120, TextAnchor.MiddleLeft, FontStyle.Bold);
			if (ToolButton(config.repoName, Color.white, 120, TextAnchor.MiddleLeft, FontStyle.Bold))
			{
				// reload the tool
				for (int i = 0; i < _toolConfigs.Count; i++)
				{
					if (config == _toolConfigs[i])
					{
						_toolConfigs[i] = LoadToolConfig(config.name);
						UnityEngine.Debug.Log("Refreshed project " + config.repoName);
						break;
					}
				}
			}
			
			string version = "";
			if (config.manifest != null && !string.IsNullOrEmpty(config.manifest.version))
			{
				version = "v" + config.manifest.version;
			}
			ToolLabel(version, Color.white, 60);
			
			//GUILayout.Button("", EditorStyles.toolbarButton, GUILayout.MaxWidth(6));	// vertical separator hack
			ToolLabel("", Color.white, 16);
			
			switch (config.download)
			{
				case DownloadStatus.Unknown:
				{
					ToolLabel("Unknown", Color.red, 120);
				} break;
				
				case DownloadStatus.NotDownloaded:
				{
					int choice = ToolDropdown("Not Downloaded", new string[] { "", "Download" }, 0, Color.grey);
					if (choice == 1)
					{
						DownloadTool(config);
					}
				} break;
				
				case DownloadStatus.NeedsUpdate:
				{
					int choice = ToolDropdown("Update Available", new string[] { "", "Update", "Open In Finder" }, 0, Color.cyan);
					if (choice == 1)
					{
						UpdateTool(config);
					}
					else if (choice == 1)
					{
						OpenInFinder(config);
					}
				} break;
				
				case DownloadStatus.LocalChanges:
				{
					int choice = ToolDropdown("Local Changes", new string[] { "", "Open In Finder" }, 0, Color.yellow);
					if (choice == 1)
					{
						OpenInFinder(config);
					}
				} break;
				
				case DownloadStatus.UpToDate:
				{
					int choice = ToolDropdown("Downloaded", new string[] { "", "Open In Finder" }, 0, Color.green);
					if (choice == 1)
					{
						OpenInFinder(config);
					}
				} break;
			}
			GUI.color = Color.white;
			
			ToolLabel("", Color.white, 16);
			
			switch (config.install)
			{
				case InstallStatus.NotInstalled:
				{
					if (config.download == DownloadStatus.Unknown ||
						config.download == DownloadStatus.NotDownloaded)
					{
						//ToolLabel("Not Installed", Color.grey, 120);
						ToolLabel("", Color.white, 140);
					}
					else if (config.manifest == null ||
							 config.manifest.type == ToolType.Unknown)
					{
						ToolLabel("Missing Manifest", Color.red, 120);
					}
					else if (config.manifest.type == ToolType.UnityPackage)
					{
						int choice = ToolDropdown("Not Installed", new string[] { "", "Import" }, 0, Color.grey);
						if (choice == 1)
						{
							InstallTool(config, InstallStatus.Imported);
						}
					}
					else if (config.manifest.type == ToolType.DLL)
					{
						int choice = ToolDropdown("Not Installed", new string[] { "", "Install (Debug DLL)", "Install (Release DLL)" }, 0, Color.grey);
						if (choice == 1)
						{
							InstallTool(config, InstallStatus.Debug);
						}
						else if (choice == 2)
						{
							InstallTool(config, InstallStatus.Release);
						}
					}
					else
					{
						ToolLabel("Unsupported", Color.red, 120);
					}
				} break;
				
				case InstallStatus.Imported:
				{
					int choice = ToolDropdown("Installed (UnityPackage)", new string[] { "", "Uninstall", "Reinstall" }, 0, Color.green);
					if (choice == 1)
					{
						UninstallTool(config);
					}
					else if (choice == 2)
					{
						InstallTool(config, InstallStatus.Imported);
					}
				} break;
					
				case InstallStatus.Debug:
				{
					int choice = ToolDropdown("Installed (Debug DLL)", new string[] { "", "Uninstall", "Reinstall" }, 0, Color.green);
					if (choice == 1)
					{
						UninstallTool(config);
					}
					else if (choice == 2)
					{
						InstallTool(config, InstallStatus.Debug);
					}
				} break;
					
				case InstallStatus.Release:
				{
					int choice = ToolDropdown("Installed (Release DLL)", new string[] { "", "Uninstall", "Reinstall" }, 0, Color.green);
					if (choice == 1)
					{
						UninstallTool(config);
					}
					else if (choice == 2)
					{
						InstallTool(config, InstallStatus.Release);
					}
				} break;
				
				case InstallStatus.Updated:
				{
					int choice = ToolDropdown("Update Available", new string[] { "", "Uninstall", "Reinstall" }, 0, Color.cyan);
					if (choice == 1)
					{
						UninstallTool(config);
					}
					else if (choice == 2)
					{
						InstallTool(config, InstallStatus.Imported);
					}
				} break;
			}
			GUI.color = Color.white;
			
			ToolLabel("", Color.white, 16);
			
			if (config.branches.Count > 0)
			{
				int selectedBranch = ToolDropdown(config.branches.ToArray(), config.currentBranch, Color.white, 100);
				if (selectedBranch != config.currentBranch)
				{
					if (EditorUtility.DisplayDialog("WARNING!", "Are you sure you want to switch branches? This is a destructive operation!", "Switch Branches", "Cancel"))
					{
						SwitchToBranch(config, selectedBranch);
					}
				}
			}
			else
			{
				ToolLabel("", Color.white, 100);
			}
			
			ToolLabel("", Color.white, 128);
		}
		GUILayout.EndHorizontal();
	}
	
	private int ToolDropdown(string label, string[] options, int selectedIndex, Color color)
	{
		ToolLabel(label, color, 120);
		return ToolDropdown(options, selectedIndex, color);
	}
	
	private int ToolDropdown(string[] options, int selectedIndex, Color color, int width=20)
	{
		return EditorGUILayout.Popup(selectedIndex, options, EditorStyles.toolbarDropDown, GUILayout.MinWidth(width), GUILayout.MaxWidth(width));
	}
	
	private void ToolLabel(string label, Color color=default(Color), int width=100, TextAnchor alignment=TextAnchor.MiddleCenter, FontStyle fontStyle=FontStyle.Normal)
	{
		GUIStyle style = EditorStyles.toolbar;
		style.alignment = alignment;
		style.fontStyle = fontStyle;
		GUI.color = color;
		GUILayout.Label(label, style, GUILayout.MinWidth(width), GUILayout.MaxWidth(width));
	}
	
	private bool ToolButton(string label, Color color=default(Color), int width=100, TextAnchor alignment=TextAnchor.MiddleCenter, FontStyle fontStyle=FontStyle.Normal)
	{
		GUIStyle style = EditorStyles.toolbarButton;
		style.alignment = alignment;
		style.fontStyle = fontStyle;
		GUI.color = color;
		if (GUILayout.Button(label, style, GUILayout.MinWidth(width), GUILayout.MaxWidth(width)))
		{
			return true;
		}
		return false;
	}
	
	private bool GuiButton(string label, bool rightAligned=false, int minWidth=120)
	{
		bool didPress = false;
		
		GUILayout.BeginHorizontal();
		{
			if (rightAligned)
			{
				GUILayout.FlexibleSpace();
			}
			else
			{
				GUILayout.Space(EditorGUI.indentLevel * 14);
			}
			
			if (GUILayout.Button(label, GUILayout.MinWidth(minWidth)))
			{
				didPress = true;
			}
			
			if (!rightAligned)
			{
				GUILayout.FlexibleSpace();
			}
		}
		GUILayout.EndHorizontal();
		
		return didPress;
	}
	
#endregion
	
#region Command Line Interface
	
	private bool ExecuteGitCommand(string args, string pwd, out List<string> output)
	{
		output = ExecuteCommand(_pathToGit, new string[] { args }, false, pwd);
		
		foreach (string line in output)
		{
			if (line.Contains("fatal"))
			{
				UnityEngine.Debug.LogError("git command failed: " + Obfuscate(line));
				EditorUtility.DisplayDialog("git command failed!", Obfuscate(line), "Ok");
				return false;
			}
		}
		
		return true;
	}
	
	private List<string> ExecuteCommand(string cmd, string[] args=null, bool echo=true, string pwd=default(string))
	{
		List<string> output = new List<string>();
		
		string workingDir = (string.IsNullOrEmpty(pwd) ? _pathToRoot : pwd);
		
		if (echo || _verbose)
		{
			UnityEngine.Debug.Log(workingDir + "> " + cmd + " " + Obfuscate(AppendArgs(args)));
		}
		
		ProcessStartInfo processInfo = new ProcessStartInfo();
		processInfo.WorkingDirectory = workingDir;
		processInfo.FileName = cmd;
		processInfo.Arguments = AppendArgs(args);
		processInfo.UseShellExecute = false;
		processInfo.RedirectStandardOutput = true;
		processInfo.RedirectStandardError = true;
		
		try
		{
			using (Process runningProcess = Process.Start(processInfo))
			{
				string stderr = runningProcess.StandardError.ReadToEnd();		// this seems to be necessary to flush stderr in some cases,
				string stdout = runningProcess.StandardOutput.ReadToEnd();		// reading directly from runningProcess.StandardOutput doesn't always work
				
				runningProcess.WaitForExit();
				runningProcess.Close();
				
				ReadLines(stdout, echo, ref output);
				ReadLines(stderr, echo, ref output);
			}
		}
		catch (System.Exception err)
		{
			UnityEngine.Debug.LogError("Command failed: " + Obfuscate(err.Message));
		}
		
		return output;
	}
	
	private void ReadLines(string s, bool echo, ref List<string> output)
	{
		string[] lines = s.Split('\n');
		foreach (string line in lines)
		{
			if (!string.IsNullOrEmpty(line))
			{
				if (echo || _verbose)
				{
					UnityEngine.Debug.Log(line);
				}
				
				output.Add(line);
			}
		}
	}
	
	private string AppendArgs(string[] args)
	{
		if (args == null || args.Length <= 0)
		{
			return "";
		}
		
		string append = "";
		
		foreach (string arg in args)
		{
			if (append.Length > 0)
			{
				append += " ";		// space delimiter
			}
			
			append += arg;
		}
		
		return append;
	}
	
	private string Obfuscate(string s)
	{
		return s.Replace(":" + _bitbucketPasswd, "");
	}
	
#endregion
}
