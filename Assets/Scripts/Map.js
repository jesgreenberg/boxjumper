public var levelList : List.<GameObject>;
public var levelColors : List.<Color>;

function Start () {

	UpdateLevels();
	
}

function UpdateLevels () {

	var n : int;
	
	for (i = 0; i < GlobalData.progress.length; i++) {

		n = GlobalData.progress[i];
		
		if (i > (GlobalData.progress.length - GlobalData.newProgress)) {
	    	levelList[n].GetComponent(LevelNode).newProgress = true;
	    }
	    
		//unlock levels from progress list
	    //levelList[n].GetComponent(LevelNode).unlocked = true; //this seems to matter
	    levelList[n].GetComponent(LevelNode).SetUnlocked();
	}
	
}

function CenterMap (l : int) {
	
	var v : Vector3;
	v = levelList[l].transform.parent.localPosition * -1;
	
	//Debug.Log("v = : " + v + " mapPos = " + GlobalData.mapPos);
	
	if (v != GlobalData.mapPos) {
		iTween.MoveTo(gameObject,{"islocal":true, "position":v, "time":1, "easeType":iTween.EaseType.easeOutQuad});
		GlobalData.mapPos = v;
	} else {
		transform.localPosition =  GlobalData.mapPos;
	}

}