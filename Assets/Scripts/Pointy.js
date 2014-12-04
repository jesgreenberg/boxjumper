public var enemyObj : GameObject;

public var rate : float;
public var distance : float;

private var origin : Vector3;
private var angle : float;

function Start () {

	origin = enemyObj.transform.position;
	
}

function Update () {
	
	//delta is time between last and current frame
	angle += rate*Time.deltaTime;
	
	if (angle >= 360) {
		angle -= 360;
	}
	
	var pos : Vector3;
	pos = origin;
	
	pos.x += Mathf.Sin(angle*Mathf.Deg2Rad) * distance;
	
	enemyObj.transform.position.x = pos.x;
	//enemyObj.transform.Position(Vector3.left);

}