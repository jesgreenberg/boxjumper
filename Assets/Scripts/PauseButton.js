function OnMouseDown () {
	
	if (GlobalData.paused != true) {
		GameObject.Find("GUI").GetComponent(GameGUI).Pause();
	} else {
		GameObject.Find("GUI").GetComponent(GameGUI).Resume();
	}

}