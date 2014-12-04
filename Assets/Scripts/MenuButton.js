private var blipAudio : AudioSource;
private var ScaleTo : Vector3 = Vector3(1.1,1.1,1);
private var OriginalScale : Vector3;

function Awake () {
	
	OriginalScale = transform.localScale;
	blipAudio = GameObject.Find("audio_blip").GetComponent(AudioSource);

}

function OnMouseDown () {
	
	if (gameObject.name == "MenuButton1") {
		Debug.Log("MenuButton1 Pressed");
		GameObject.Find("GUI").GetComponent(GameGUI).Resume();
	}
	
	if (gameObject.name == "MenuButton2") {
		Debug.Log("MenuButton2 Pressed");
		//GameObject.Find("GUI").GetComponent(GameGUI).Resume();
		GameObject.Find("GUI").GetComponent(GameGUI).LeaveGame();
	}
	
	transform.localScale = OriginalScale;

}

function OnMouseEnter () {
	
    iTween.ScaleTo(gameObject,{"scale":ScaleTo,"time":0.01, "easeType":iTween.EaseType.easeOutQuad});
	blipAudio.Play();
	
}
 
function OnMouseExit () {
 	
    iTween.ScaleTo(gameObject,{"scale":OriginalScale,"time":0.01, "easeType":iTween.EaseType.easeOutQuad});
    
}