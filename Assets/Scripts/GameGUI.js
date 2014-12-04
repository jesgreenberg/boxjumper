public var mainCam : GameObject;

public var gemAudio : AudioSource;
public var dieAudio : AudioSource;
public var lvlAudio : AudioSource;

public var livesText : TextMesh;
public var timerText : TextMesh;
public var mainText : TextMesh;
public var resultsText : TextMesh;
public var scoreText : TextMesh;
public var timeText : TextMesh;
public var bestText : TextMesh;

public var playerObj : GameObject;
public var levelsObj : GameObject;
public var pauseObj : GameObject;
public var livesObj : GameObject;
public var gemsObj : GameObject;
public var textObj : GameObject;
public var timerObj : GameObject;
public var modalObj : GameObject;

public var resultsScreen : GameObject;
public var pauseMenu : GameObject;

private var lifeCount : int;
private var pointsEarned : int;
private var displayTime = "00:00";
private var pauseTimer : boolean;


function Awake () {
	
	GlobalData.lives = 3;
	GlobalData.gemsEarned = GlobalData.gems;
	textObj.SetActive(false);
	timerObj.SetActive(true);
	resultsScreen.SetActive(false);
	pauseMenu.SetActive(false);
	modalObj.SetActive(false);
	
}

function Start () {
	
	livesText.text = "" + GlobalData.lives;
	LoadLevel(GlobalData.level);
	
}

function Update () { 
	
	//Cheat buttons
	if (Input.GetKeyDown ("w")) {
		gemsObj.GetComponent(Gems).SetGemsTo(GlobalData.gemTotal);
	}
	
	if (Input.GetKeyDown ("l")) {
		GameOver();
	}
	
	if (Input.GetKeyDown ("r")) {
		GlobalData.screen = 1;
   		Application.LoadLevel("Menu");
	}
	
	StartTimer();
	
}

function LoadLevel (n : int) {
	
	Debug.Log ("Current Level: " + GlobalData.level);
	Debug.Log ("Total Levels: "+ levelsObj.GetComponent(Levels).levelList.Count);
	
	if (GlobalData.level < levelsObj.GetComponent(Levels).levelList.Count) {
		
		//Hide results
		resultsScreen.SetActive(false);
		modalObj.SetActive(false);
		
		//Show new level
		levelsObj.GetComponent(Levels).ShowLevel(GlobalData.level);
		playerObj.GetComponent(Player).ShowPlayer();
		gemsObj.GetComponent(Gems).SetupGems();
		modalObj.renderer.material.color = GameObject.Find("Camera").camera.backgroundColor;
		modalObj.renderer.material.color.a = .6;
		pauseObj.SetActive(true);
		livesObj.SetActive(true);
		
		ShowTimer();
		StartTimer();
		
	} else {
	
		//Check if winner
		StartCoroutine(YouWin());
		
	}
	
}

function LevelComplete () {
	
	Debug.Log ("Level Completed");
	
	lvlAudio.Play();
	
	//Hide level
	HideTimer();
	levelsObj.GetComponent(Levels).HideLevels();
	playerObj.GetComponent(Player).HidePlayer();
	pauseObj.SetActive(false);
	livesObj.SetActive(false);
	textObj.SetActive(false);
	
	yield WaitForSeconds(1);
	
	//Show results
	GlobalData.gemsEarned += gemsObj.GetComponent(Gems).gemCount;
	gemsObj.GetComponent(Gems).ResetGems();
	resultsText.text = "level " + (GlobalData.level + 1) + " complete";
	modalObj.renderer.material.color.a = 1;
	resultsScreen.SetActive(true);
	modalObj.SetActive(true);
    
    
    //Set results
	pointsEarned = GlobalData.GetSetScore();
	Debug.Log("pointsEarned = " + pointsEarned + " GlobalData.newScore = " + GlobalData.newScore + " Level Points = " + GlobalData.lvlPoints + " Score = " + GlobalData.score);
	timeText.text = "time: " + FormatTime(GlobalData.timer - GlobalData.timeUsed);
	bestText.text = "best: " + FormatTime(GlobalData.timer - (GlobalData.scores[GlobalData.level] * GlobalData.timer));
	
    //Update global data
    //var s : int;
    var s = GlobalData.newScore;
    GlobalData.UpdateProgress();
	GlobalData.newScore = GlobalData.newScore + pointsEarned;
    
    //Animate results
    //while (s < pointsEarned) {
    //while (s < (GlobalData.timeUsed / GlobalData.timer * GlobalData.lvlPoints)) {
    while (s < (GlobalData.newScore)) {
    	s += 5;
    	//scoreText.text = s.ToString("00000");
    	scoreText.text = "" + s;
		
		yield;
    }
    
    //scoreText.text = "" + pointsEarned; //just in case
    scoreText.text = "" + GlobalData.newScore; //just in case
    

}

function Pause () {
	
	Debug.Log("Paused");
	
	HideTimer();
	GlobalData.paused = true;
	playerObj.GetComponent(InputController).clicked = false;
	pauseObj.renderer.material.color.a = 1;
	modalObj.renderer.material.color.a = .6;
	pauseMenu.SetActive(true);
	modalObj.SetActive(true);
	mainCam.audio.Pause();
	Time.timeScale = 0.05;
	
}

function Resume () {
	
	ShowTimer();
	GlobalData.paused = false;
	playerObj.GetComponent(InputController).clicked = true;
	pauseMenu.SetActive(false);
	modalObj.SetActive(false);
	pauseObj.renderer.material.color.a = .3;
	mainCam.audio.Play();
	Time.timeScale = 1;
	
}

function YouWin () {
	
	Debug.Log ("You Win");
	
	HideTimer();
	lvlAudio.Play();
	mainText.text = "you are winner";
	textObj.SetActive(true);
	
	yield WaitForSeconds(2);
	
	RestartGame();
	
}

function GameOver () {
	
	Debug.Log ("Game Over");
	mainText.text = "game over";
	textObj.SetActive(true);
	
	HideTimer();
	playerObj.GetComponent(Player).HidePlayer();
	levelsObj.GetComponent(Levels).HideLevels();
	
	yield WaitForSeconds(2);
	
	textObj.SetActive(false);
	GlobalData.ResetData();
	RestartGame();
	
}

function StartTimer () {
	
	if (pauseTimer == false) {
		if (GlobalData.timeUsed > 0) {
			Timer();
			timerText.text = displayTime;
		}
		
		if (GlobalData.timeUsed <= 0) {
			Debug.Log ("Times Up");
			pauseTimer = true;
			timerText.text = "0:00";
			GameOver();
		}
	}
	
}

function Timer () {
	
	GlobalData.timeUsed -= Time.deltaTime;
	displayTime = FormatTime(GlobalData.timeUsed);
	
}

function FormatTime (t : float) {
	
	var min : int;
	var sec : int;
	
	min = Mathf.FloorToInt(t / 60F);
    sec = Mathf.FloorToInt(t - min * 60);
    
	return String.Format("{0:0}:{1:00}", min, sec);
	
}

function SetLives (n : int) {

	Debug.Log ("Lives = " + GlobalData.lives);
	
	GlobalData.lives = n;
	livesText.text = "" + GlobalData.lives;
	
}

function ResetPlayer () {
	
	ShowTimer();
	
	GlobalData.timeUsed = GlobalData.timer;
	SetLives(GlobalData.lives);
}

function LeaveGame () {
	
	Resume();
	GlobalData.screen = 5;
	Application.LoadLevel("Menu");
	
}

function RestartGame () {
	
	Application.LoadLevel("Menu");

}

function LoseLife () {
	
	HideTimer();
	GlobalData.lives -= 1;
	dieAudio.Play();
	
	//out of lives
	if (GlobalData.lives < 0) {
		GameOver();
	}
	
}

function AddLife () {
	
	GlobalData.lives += 1;
	SetLives(GlobalData.lives);
	
}

function HideTimer () {
	
	pauseTimer = true;
	timerObj.SetActive(false);
	
}

function ShowTimer () {
	
	pauseTimer = false;
	timerObj.SetActive(true);
	
}