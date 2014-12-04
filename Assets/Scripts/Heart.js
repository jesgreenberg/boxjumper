public var emitterObj : GameObject;
public var heartObj : GameObject;

function Start () {
	
	heartObj.SetActive(true);
	emitterObj.SetActive(false);
	
}

function OnTriggerEnter (other : Collider) {

	emitterObj.SetActive(true);
	heartObj.SetActive(false);
	GameObject.Find("GUI").GetComponent(GameGUI).AddLife();
	
}