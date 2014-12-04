public var mainCam : GameObject;
public var cam0 : GameObject;
public var cam1 : GameObject;
public var cam2 : GameObject;
public var cam3 : GameObject;
public var cam4 : GameObject;
public var cam5 : GameObject;
public var gameObj : GameObject;
public var gemObj : GameObject;
public var gemsObj : GameObject;
public var heartsObj : GameObject;
public var scoreObj : GameObject;
public var arrowObj : GameObject;
public var arrowUp : GameObject;
public var arrowDown : GameObject;
public var arrowLeft : GameObject;
public var arrowRight : GameObject;
public var buttonsObj : GameObject;
public var buttonObj1 : GameObject;
public var buttonObj2 : GameObject;
public var buttonObj3 : GameObject;
public var fadeObj : GameObject;
public var titleText : GameObject;
public var subText : GameObject;
public var scoresObj : GameObject;
public var infoObj : GameObject;
public var mapObj : GameObject;

public var scoreText : TextMesh;
public var gemsText : TextMesh;
public var livesText : TextMesh;

private var introAudio : AudioSource;
private var prevScore : int;

function Awake () {
	
	mainCam.transform.localEulerAngles = cam0.transform.localEulerAngles;
	mainCam.transform.localPosition = cam0.transform.localPosition;
	prevScore = GlobalData.score;

}

function Start () {
	
	introAudio = mainCam.GetComponent(AudioSource);
	
	fadeObj.SetActive(true);
	gameObj.SetActive(false); //hide map
	gemsObj.SetActive(false);
	heartsObj.SetActive(false);
	scoreObj.SetActive(false);
	arrowDown.SetActive(false);
	arrowLeft.SetActive(false);
	arrowRight.SetActive(false);
	//arrowUp.collider.enabled = false;
	
	titleText.renderer.material.color.a = 0;
	subText.renderer.material.color.a = 0;
	arrowObj.renderer.material.color.a = 0;
	buttonObj1.renderer.material.color.a = 0;
	buttonObj2.renderer.material.color.a = 0;
	buttonObj3.renderer.material.color.a = 0;
	livesText.text = "" + GlobalData.lives;
	
	//arrowObj.renderer.material.SetColor("_TintColor", Color(.043,.221,.314,0));
	//gemsObj.transform.localPosition.y = 1;
	SetCamera();
	UpdateScore();

}

function Update () {
	
    if (Input.GetMouseButtonDown(0) && GlobalData.screen == 0) {
    	SetScreen(1);
    	SetCamera();
    }
    
    if (Input.GetKeyDown ("return")) {
    	Debug.Log("Return Pressed");
    	Application.LoadLevel("Game");
    }
    
    
    //update score
    /*if (GlobalData.score < (prevScore + GlobalData.newScore)) {
    	GlobalData.score += 5;
    	scoreText.text = GlobalData.score.ToString("000000000");
    }
    
    if (GlobalData.gems < GlobalData.gemsEarned) {
    	GlobalData.gems += 1;
    	gemsText.text = "" + GlobalData.gems;
    }*/
    
    //map controls
    /*if (Input.GetKey(KeyCode.Mouse0)) {
		if (mousePos.x < Screen.width / 2) {
		}
		if (mousePos.x > Screen.width / 2) {
		}
    }*/
}

function UpdateScore () {
	
	while (GlobalData.score < GlobalData.newScore) {
	
    	GlobalData.score += 5;
    	//GlobalData.score = GlobalData.newScore;
    	scoreText.text = GlobalData.score.ToString("000000000");
    	
    	if (GlobalData.gems < GlobalData.gemsEarned) {
    		GlobalData.gems += 1;
    		gemsText.text = "" + GlobalData.gems;
    	}
    	
    	yield;
    }
    
    gemsText.text = "" + GlobalData.gems; //just in case
}

function SetCamera () {

	var arr = new Array ();
	
	//Starting camera position
	if (GlobalData.screen == 0) {
	
		Debug.Log("Screen = " + GlobalData.screen);
		
		arrowUp.SetActive(true);
		introAudio.Play();
		
		iTween.RotateTo(mainCam,{"rotation":cam1.transform.localEulerAngles, "time":4, "easeType":iTween.EaseType.easeOutQuad, "onCompleteTarget":this.gameObject, "onComplete":"SetScreen", "oncompleteparams":0});
		iTween.MoveTo(mainCam,{"position":cam1.transform.localPosition, "time":3, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(fadeObj,{"alpha":0, "time":3, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(titleText,{"alpha":1, "time":4, "delay":4.5, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(subText,{"alpha":1, "time":4, "delay":5, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(arrowObj,{"alpha":.3, "time":1, "delay":2.5, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(buttonObj1,{"alpha":.3, "time":1, "delay":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(buttonObj2,{"alpha":.3, "time":1, "delay":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(buttonObj3,{"alpha":.3, "time":1, "delay":1, "easeType":iTween.EaseType.easeOutQuad});
	}
	
	//Intro Screen
	if (GlobalData.screen == 1) {
	
		Debug.Log("Screen = " + GlobalData.screen);
		
		arr = [gemsObj, heartsObj, scoreObj, arrowDown, arrowLeft, arrowRight];
		
		for (i = 0; i < arr.length; i++) {
    		arr[i].SetActive(false);
		}
		
		arrowUp.SetActive(true);
		buttonsObj.SetActive(true);
		//arrowUp.collider.enabled = true;
		arrowObj.renderer.material.color.a = .3;
		buttonObj1.renderer.material.color.a = .3;
		buttonObj2.renderer.material.color.a = .3;
		buttonObj3.renderer.material.color.a = .3;
		
		iTween.RotateTo(mainCam,{"rotation":cam1.transform.localEulerAngles, "time":1, "easeType":iTween.EaseType.easeOutQuad, "onCompleteTarget":this.gameObject, "onComplete":"SetScreen", "oncompleteparams":1});
		iTween.MoveTo(mainCam,{"position":cam1.transform.localPosition, "time":1, "easeType":iTween.EaseType.easeOutQuad, "onCompleteTarget":this.gameObject, "onComplete":"Hide", "oncompleteparams":gameObj});
		iTween.FadeTo(fadeObj,{"alpha":0, "time":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(titleText,{"alpha":1, "time":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(subText,{"alpha":1, "time":1, "easeType":iTween.EaseType.easeOutQuad});
	
	}
	
	//Scores Screen
	if (GlobalData.screen == 2) {
	
		Debug.Log("Screen = " + GlobalData.screen);
		
		scoresObj.SetActive(true);
		gameObj.SetActive(false);
		arrowUp.SetActive(false);
		buttonsObj.SetActive(false);
		
		iTween.RotateTo(mainCam,{"rotation":cam2.transform.localEulerAngles, "time":1, "easeType":iTween.EaseType.easeOutQuad, "onCompleteTarget":this.gameObject, "onComplete":"SetScreen", "oncompleteparams":2});
		iTween.MoveTo(mainCam,{"position":cam2.transform.localPosition, "time":1, "easeType":iTween.EaseType.easeOutQuad});
	
	}
	
	//Info Screen
	if (GlobalData.screen == 3) {
	
		Debug.Log("Screen = " + GlobalData.screen);
		
		gameObj.SetActive(false);
		arrowUp.SetActive(false);
		buttonsObj.SetActive(false);
		
		iTween.RotateTo(mainCam,{"rotation":cam3.transform.localEulerAngles, "time":1, "easeType":iTween.EaseType.easeOutQuad, "onCompleteTarget":this.gameObject, "onComplete":"SetScreen", "oncompleteparams":3});
		iTween.MoveTo(mainCam,{"position":cam3.transform.localPosition, "time":1, "easeType":iTween.EaseType.easeOutQuad});
	
	}
	
	//Map Screen
	if (GlobalData.screen == 4) {
	
		Debug.Log("Screen = " + GlobalData.screen);
		
		arr = [gameObj, gemsObj, heartsObj, scoreObj, arrowDown];
	
		for (i = 0; i < arr.length; i++) {
    		arr[i].SetActive(true);
		}
		
		scoresObj.SetActive(false);
		arrowUp.SetActive(false);
		buttonsObj.SetActive(false);
		mapObj.GetComponent(Map).CenterMap(GlobalData.level);
		
		iTween.RotateTo(mainCam,{"rotation":cam4.transform.localEulerAngles, "time":1, "easeType":iTween.EaseType.easeOutQuad, "onCompleteTarget":this.gameObject, "onComplete":"SetScreen", "oncompleteparams":4});
		iTween.MoveTo(mainCam,{"position":cam4.transform.localPosition, "time":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(fadeObj,{"alpha":1, "time":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(titleText,{"alpha":0, "time":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(subText,{"alpha":0, "time":1, "easeType":iTween.EaseType.easeOutQuad});
	
	}
	
	//Returning from game
	if (GlobalData.screen == 5) {
	
		Debug.Log("Screen = " + GlobalData.screen);
		
		arr = [gameObj, gemsObj, heartsObj, scoreObj, arrowDown];
		
		for (i = 0; i < arr.length; i++) {
    		arr[i].SetActive(true);
		}
		
		scoresObj.SetActive(false);
		arrowUp.SetActive(false);
		buttonsObj.SetActive(false);
		mapObj.GetComponent(Map).CenterMap(GlobalData.level);
		
		mainCam.transform.localEulerAngles = cam5.transform.localEulerAngles;
		mainCam.transform.localPosition = cam5.transform.localPosition;
		
		iTween.RotateTo(mainCam,{"rotation":cam4.transform.localEulerAngles, "time":1, "easeType":iTween.EaseType.easeOutQuad, "onCompleteTarget":this.gameObject, "onComplete":"SetScreen", "oncompleteparams":5});
		iTween.MoveTo(mainCam,{"position":cam4.transform.localPosition, "time":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(titleText,{"alpha":0, "time":1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.FadeTo(subText,{"alpha":0, "time":1, "easeType":iTween.EaseType.easeOutQuad});
	
	}
	
}

function SetScreen (n : int) {

	Debug.Log("Set Screen");
	GlobalData.screen = n;
	
}

function OpenLevel (l : int) {
	
	//yield WaitForSeconds(25);
	GlobalData.level = l;
	GlobalData.newProgress = 1;
    Application.LoadLevel("Game");

}

function ToggleArrow () {
	
	if (arrowUp.activeSelf == true) {
		arrowUp.SetActive(false);
	} else {
		arrowUp.SetActive(true);
	}
	
	if (arrowDown.activeSelf == true) {
		arrowDown.SetActive(false);
	} else {
		arrowDown.SetActive(true);
	}

}

function Hide (g : GameObject) {
	
	g.SetActive(false);
	
	/*if (g.activeSelf == false) {
		g.SetActive(true);
	} else {
		g.SetActive(false);
	}*/
	
}
