public var PlayLabel : GUIText;

function OnMouseOver () {

	PlayLabel.text = "[PLAY]";

}

function OnMouseOut () {

	PlayLabel.text = "PLAY";

}

function OnMouseDown () {

	GameObject.Find("MenuOld").GetComponent(MenuOld).LoadMissions();

}