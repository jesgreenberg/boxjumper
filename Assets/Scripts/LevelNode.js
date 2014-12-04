public var unlockedObj : GameObject;
public var lockedObj : GameObject;
public var boxObj : GameObject;
public var numObj : GameObject;
public var emitterObj : GameObject;
public var unlocked : boolean;
public var newProgress : boolean;

private var mapObj : GameObject;
private var blipAudio : AudioSource;
private var levelNum : int;
private var selected : boolean;

private var ScaleTo : Vector3 = Vector3(1.2,1.2,1);
private var OriginalScale : Vector3;

function Awake () {

	levelNum = int.Parse(gameObject.name);
	mapObj = GameObject.Find("Map");
	blipAudio = GameObject.Find("audio_blip").GetComponent(AudioSource);
	OriginalScale = transform.localScale;
	
}

function Start () {
	
	numObj.GetComponent(TextMesh).text = "" + (levelNum + 1);
	boxObj.renderer.material.SetColor("_TintColor", mapObj.GetComponent(Map).levelColors[levelNum]);
	emitterObj.renderer.material.SetColor("_TintColor", mapObj.GetComponent(Map).levelColors[levelNum]);
	//boxObj.renderer.material.color = mapObj.GetComponent(Map).levelColors[levelNum];
	//emitterObj.renderer.material.color = mapObj.GetComponent(Map).levelColors[levelNum];
 
}

function Update () {
	
	if (selected == true && unlocked == true) {
		if (Input.GetMouseButtonDown (0)) {
	    	Debug.Log("Button Pressed");
	    	GameObject.Find("GUI").GetComponent(MenuGUI).OpenLevel(levelNum);
	    }
	}
    
}
 
function OnMouseEnter () {
	
	//Debug.Log("level " + levelNum + " selected");
	
	selected = true;
	
	if (unlocked == true) {
	    iTween.Stop(gameObject);
	    iTween.ScaleTo(gameObject,{"scale":ScaleTo,"time":0.5, "easeType":iTween.EaseType.easeOutQuad});
	    mapObj.GetComponent(Map).CenterMap(levelNum);
		blipAudio.Play();
	}
	
}
 
function OnMouseExit () {
 	
 	selected = false;
    iTween.Stop(gameObject);
    iTween.ScaleTo(gameObject,{"scale":OriginalScale,"time":0.5, "easeType":iTween.EaseType.easeOutQuad});
    
}

function CheckStatus () {
 	
 	if (unlocked == true) {
		SetUnlocked();
	} else {
		SetLocked();
	}
	
}

function SetLocked () {
 	
    unlockedObj.SetActive(false);
    lockedObj.SetActive(true);
    unlocked = false;
    
}

function SetUnlocked () {
 	
 	//Debug.Log("levelNum = " + levelNum + " progress = " + GlobalData.progress.length + " newProgress = " + GlobalData.newProgress);
 	
 	if (newProgress == true) {
 	//if ((levelNum + 1) == GlobalData.progress.length && GlobalData.unlocked == true) {
 		emitterObj.SetActive(true);
		yield WaitForSeconds (0.5);
 		//GlobalData.unlocked = !unlocked;
 	}
 	
 	unlocked = true;
 	lockedObj.SetActive(false);
    unlockedObj.SetActive(true);
    
}
