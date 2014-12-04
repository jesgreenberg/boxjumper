import System.Collections.Generic;

static var current : GlobalData;
static var selected : GameObject; //track buttons
static var screen : int;
static var level : int;
static var lives : int;
static var score : int;
static var gems : int;
static var timer : float;
static var unlocked : boolean;
static var paused : boolean;

static var newScore : int;
static var lvlPoints : int;
static var gemsEarned : int;
static var gemTotal : int; //current gem total
static var newProgress : int;
static var timeUsed : float;
static var mapPos : Vector3;
static var platform : String;

static var progress = new Array();
static var scores = new Array();

public var setLevel : int;
public var setLives : int;
public var setGems : int;

function Awake () {
	
	//CheatCode();
	
	if (level == 0) {
		progress = [0];
	}
	
	if (level == 0) {
		//scores = [0];
	}
	
	if (lives == 0) {
		lives = setLives;
	}
	
	if (gems == 0) {
		gems = setGems;
	}
	
	//make object permanent
    if (current != null && current != this) {
        Destroy(gameObject);
    } else {
        DontDestroyOnLoad(gameObject);
        current = this;
    }
}

static function UpdateProgress () {
	
	Debug.Log ("Updating Progress");
	
	var b : boolean;
	level ++;
	
	//check if level completed
	for (i = 0; i < progress.length; i++) {
		if (level == progress[i]) {
			b = true;
	    }
	}
	
	//add level to progress array
	if (b != true) {
		progress.Add(level);
		newProgress ++;
		//unlocked = !unlocked;
	}
	
}

static function GetSetScore () {
	
	Debug.Log ("Timer: " + timer + ", Time Used: " + timeUsed);
	
	var s : float;
	var p : float;
	
	s = timeUsed / timer; //get percent completion
	
	if (level >= scores.length) {
		scores.Add(s); //store best 
		p = s * lvlPoints;
	} else if (s > scores[level]) {
		p = (s - scores[level]) * lvlPoints;
		scores[level] = s;
	}
	
	return Mathf.Round(p / 5) * 5; //round points

}

//needs fixing
static function ResetData () {
	
	Debug.Log ("Data Wiped");
	
	screen = 0;
	level = 0;
	lives = 0;
	score = 0;
	gems = 0;
	scores = [0];
	progress = [0];
	
}

function CheatCode () {
	
	level = setLevel;
	gems = setGems;
	
	for (v = 0; v < level; v++) {
		progress.Add(v);
	}
}
	