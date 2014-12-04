private var guiObj : GameObject;

function Start () {

	guiObj = GameObject.Find("GUI");
	
}

function OnMouseOver () {

	guiObj.GetComponent(GameGUI).RestartGame();

}

function OnMouseOut () {

	guiObj.GetComponent(GameGUI).RestartGame();

}

function OnMouseDown () {

	guiObj.GetComponent(GameGUI).RestartGame();

}