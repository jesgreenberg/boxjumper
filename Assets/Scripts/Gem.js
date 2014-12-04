public var emitterObj : GameObject;
private var gemsObj : GameObject;

function OnTriggerEnter (other : Collider) {

	gameObject.SetActive(false);	
	GameObject.Find("Collection").GetComponent(Gems).AddGem();
	//emitterObj.SetActive(true);
	//gemObj.SetActive(false);

}