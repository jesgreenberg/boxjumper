public var bg : GameObject;
public var bgSky : GameObject;
public var bgClouds : GameObject;
public var bgColor : Color;

public var points : int;
public var timer : float;
public var heart : GameObject;
public var gemList : List.<GameObject>;

private var levelNum : int;

function Awake () {

	levelNum = int.Parse(gameObject.name); //set level from name
	
}

function OnEnable () {
	
	//Update global data
	GlobalData.timer = timer;
	GlobalData.timeUsed = timer;
	GlobalData.lvlPoints = points;
	GlobalData.gemTotal = gemList.Count;
	
	ShowItems();
	ShowBackground();
	
}

function OnDisable () {

	HideBackground();
	
}

function ShowItems () {

	for (i = 0; i < gemList.Count; i++) {
		if (gemList[i] != null) {
    		gemList[i].SetActive(true);
    	}
	}
	
	if (heart != null) {
    	heart.SetActive(true);
    }
	
}

function ShowBackground () {

	var arr = [bg, bgClouds, bgSky];
	
	for (i = 0; i < arr.length; i++) {
		if (arr[i] != null) {
    		arr[i].SetActive(true);
    	}
	}
	
	GameObject.Find("Camera").camera.backgroundColor = bgColor;
	RenderSettings.fogColor = bgColor;
	
}

function HideBackground () {

	var arr = [bg, bgClouds, bgSky];
	
	for (i = 0; i < arr.length; i++) {
		if (arr[i] != null) {
    		arr[i].SetActive(false);
    	}
	}
	
}