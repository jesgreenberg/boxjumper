public var textObj : GameObject;
public var timerObj : GameObject;
public var mainText : TextMesh;

function Start () {
	
	textObj.SetActive(true);
	timerObj.SetActive(false);
	mainText.text = "use arrow keys to move";
	
}

function Update () {

	if (Input.GetKey(KeyCode.LeftArrow) || Input.GetKey(KeyCode.RightArrow) || Input.GetKey(KeyCode.UpArrow) || Input.GetKey(KeyCode.DownArrow) || Input.GetKey(KeyCode.Mouse0)) {
		mainText.text = "collect gems to win";
	}
	
}