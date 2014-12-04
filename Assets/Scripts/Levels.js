public var testLevel : int;
public var levelList : List.<GameObject>;

function Awake () {
	
	//for testing
	if (testLevel != 0) {
		GlobalData.level = testLevel;
	}
	
	ShowLevel(GlobalData.level);
	
}

function OnEnable () {

	ShowLevel(GlobalData.level);
	
}

public function ShowLevel (n : int) {
	
	Debug.Log ("Show Level: " + n);
	
	GlobalData.level = n;
	var l = levelList[n];
	
	HideLevels();
	l.SetActive(true);
	l.GetComponent(Level).ShowBackground();
	
}

public function HideLevels () {
	
	Debug.Log ("Hiding Level");
	
	for (i = 0; i < levelList.Count; i++) {
		levelList[i].SetActive(false);
	}
	
}