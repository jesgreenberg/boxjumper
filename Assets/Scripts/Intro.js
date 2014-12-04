public var GemsLabel : GUIText;

function Start () {

    //LeaveScene ();

}

function Update () {
	
	if (Input.GetMouseButtonDown(0) || Input.GetKey(KeyCode.Return)) {
		Application.LoadLevel("Game");
	}

}

function LeaveScene () {

    yield WaitForSeconds (25);
    Application.LoadLevel("Game");

}