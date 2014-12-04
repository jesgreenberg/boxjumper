public var gemObj : GameObject;
public var slotObj : GameObject;
public var emitterObj : GameObject;
public var filled : boolean;

function SetFilled () {
	
	filled = true;
	slotObj.SetActive(false);
	gemObj.SetActive(true);
	emitterObj.SetActive(true);
	
}

function SetEmpty () {
	
	filled = false;
	gemObj.SetActive(false);
	slotObj.SetActive(true);
	emitterObj.SetActive(false);
	
}