public var mainCam : GameObject;
public var gems : GameObject;
public var hearts : GameObject;
public var score : GameObject;

public var arrowUp : GameObject;
public var arrowDown : GameObject;
public var arrowLeft : GameObject;
public var arrowRight : GameObject;
public var scoresBtn : GameObject;
public var infoBtn : GameObject;
public var buttons : GameObject;

public var gemsObj : GameObject;
public var heartsObj : GameObject;
public var scoreObj : GameObject;

function Awake () {
	
	ShowScore();
	
}

function Update () {
	
	ShowScore();
	
	gems.transform.position = Camera.main.ViewportToWorldPoint(Vector3(0,1,10));
	hearts.transform.position = Camera.main.ViewportToWorldPoint(Vector3(0,1,10));
	score.transform.position = Camera.main.ViewportToWorldPoint(Vector3(1,1,10));
	arrowUp.transform.position = Camera.main.ViewportToWorldPoint(Vector3(.5,1,6));
	arrowDown.transform.position = Camera.main.ViewportToWorldPoint(Vector3(.5,0,6));
	arrowLeft.transform.position = Camera.main.ViewportToWorldPoint(Vector3(0,.5,6));
	arrowRight.transform.position = Camera.main.ViewportToWorldPoint(Vector3(1,.5,6));
	buttons.transform.position = Camera.main.ViewportToWorldPoint(Vector3(0,0,10));
	//scoresBtn.transform.position = Camera.main.ViewportToWorldPoint(Vector3(0,0,10));
	infoBtn.transform.position = Camera.main.ViewportToWorldPoint(Vector3(1,0,10));	
	
}

function ShowScore () {
	
	if (GlobalData.gems == 0) {
		gemsObj.SetActive(false);
		heartsObj.transform.localPosition.x = 1;
	} else {
		gemsObj.SetActive(true);
		heartsObj.transform.localPosition.x = 3;
	}
	
	if (GlobalData.score == 0) {
		scoreObj.SetActive(false);
	} else {
		scoreObj.SetActive(true);
	}
	
}
