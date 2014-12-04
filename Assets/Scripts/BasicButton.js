public var selected : boolean;

private var guiObj : GameObject;
private var blipAudio : AudioSource;
private var ScaleTo : Vector3 = Vector3(1.1,1.1,1);
private var OriginalScale : Vector3;

function Awake () {
	
	guiObj = GameObject.Find("GUI");
	blipAudio = GameObject.Find("audio_blip").GetComponent(AudioSource);
	OriginalScale = transform.localScale;

}

function Update () {
	
	if (selected == false) {
		iTween.ScaleTo(gameObject,{"scale":OriginalScale,"time":0.5, "easeType":iTween.EaseType.easeOutQuad});
	}

}

function OnMouseDown () {
	
	Debug.Log(gameObject.name + " Pressed");
	
	if (gameObject.name == "ArrowUp") {
        guiObj.GetComponent(MenuGUI).SetScreen(4);
        guiObj.GetComponent(MenuGUI).SetCamera();
    }
    
    if (gameObject.name == "ArrowDown") {
        guiObj.GetComponent(MenuGUI).SetScreen(1);
        guiObj.GetComponent(MenuGUI).SetCamera();
    }
    
    if (gameObject.name == "ArrowLeft") {
        guiObj.GetComponent(MenuGUI).SetScreen(1);
        guiObj.GetComponent(MenuGUI).SetCamera();
    }
    
    if (gameObject.name == "ArrowRight") {
        guiObj.GetComponent(MenuGUI).SetScreen(1);
        guiObj.GetComponent(MenuGUI).SetCamera();
    }
    
	if (gameObject.name == "ScoresButton") {
		GameObject.Find("GUI").GetComponent(MenuGUI).SetScreen(2);
		guiObj.GetComponent(MenuGUI).SetCamera();
	}
	
	if (gameObject.name == "InfoButton") {
		GameObject.Find("GUI").GetComponent(MenuGUI).SetScreen(3);
		guiObj.GetComponent(MenuGUI).SetCamera();
	}
	
	if (gameObject.name == "MapButton") {
        guiObj.GetComponent(MenuGUI).SetScreen(4);
        guiObj.GetComponent(MenuGUI).SetCamera();
	}
	
	if (gameObject.name == "ResultsButton1") {
		GameObject.Find("GUI").GetComponent(GameGUI).LeaveGame();
	}
	
	if (gameObject.name == "ResultsButton2") {
		//delay to load next level
		yield WaitForSeconds (.5);
		GameObject.Find("GUI").GetComponent(GameGUI).LoadLevel(GlobalData.level);
	}
	
	transform.localScale = OriginalScale;

}

function OnMouseEnter () {
	
	if (GlobalData.selected != null) {
		GlobalData.selected.GetComponent(BasicButton).selected = false;
	}
	
	Debug.Log(gameObject.name + " Selected");
	GlobalData.selected = this.gameObject;
	selected = true;
	
	iTween.ScaleTo(gameObject,{"scale":ScaleTo,"time":0.5, "easeType":iTween.EaseType.easeOutQuad});
	blipAudio.Play();
	
}
 
function OnMouseExit () {
 	
    //iTween.ScaleTo(gameObject,{"scale":OriginalScale,"time":0.5, "easeType":iTween.EaseType.easeOutQuad});
    selected = false;
    
}