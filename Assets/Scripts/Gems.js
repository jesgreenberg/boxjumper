public var gemsObj : GameObject;
public var gemCount : int;
public var gemList : List.<GameObject>;


function SetupGems () {

	Debug.Log ("Setting Gems");
	
	transform.localPosition.x = 0;
	
  	for (i = 0; i < gemList.Count; i++) {
  	
  		if (i < GlobalData.gemTotal) {
  			gemList[i].SetActive(true);
  			transform.localPosition.x -= .7;
  		} else {
  			gemList[i].SetActive(false);
  		}
  		
	}
	
}

function SetGemsTo (n : int) {

	Debug.Log ("Gem Collected: " + n);
	
	gemCount = n;
  	
  	for (v = 0; v < gemCount; v++) {
  		if (gemList[v].GetComponent(GemIcon).filled == false) {
    		gemList[v].GetComponent(GemIcon).SetFilled();
    	}
	}
	
	if (gemCount == GlobalData.gemTotal) {
		GameObject.Find("GUI").GetComponent(GameGUI).LevelComplete();
	}
	
}

function ResetGems () {
	
	Debug.Log ("Reset Gems");
	
	gemCount = 0;
  	
  	for (g = 0; g < gemList.Count; g++) {
     	gemList[g].GetComponent(GemIcon).SetEmpty();
	}
  	
}

function AddGem () {
	
	gemCount ++;
	SetGemsTo(gemCount);
	
}