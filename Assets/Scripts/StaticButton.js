private var guiObj : GameObject;

function Awake () {
	
	guiObj = GameObject.Find("GUI");

}

function OnMouseDown () {
	
	Debug.Log("Screen = " + GlobalData.screen);
	if (gameObject.name == "Intro") {
		if (GlobalData.screen == 1) {
			Debug.Log("Map Pressed");
        	guiObj.GetComponent(MenuGUI).SetScreen(4);
        	guiObj.GetComponent(MenuGUI).SetCamera();
        } else {
			Debug.Log("Intro Pressed");
        	guiObj.GetComponent(MenuGUI).SetScreen(1);
        	guiObj.GetComponent(MenuGUI).SetCamera();
        }
    }
}

function OnMouseEnter () {
	
	if (GlobalData.selected != null) {
		GlobalData.selected.GetComponent(BasicButton).selected = false;
	}
	
}