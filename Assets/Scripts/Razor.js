public var razorObj : GameObject;
public var rate : float;

private var origin : Vector3;

function Start () {

	origin = transform.position;
	
}

function Update () {

	Rotation();

}

function Rotation () {
	
	var rot = transform.eulerAngles.y;
	
	rot = 90*Time.deltaTime;
	rot -= rate;
	
	razorObj.transform.Rotate(0,0,rot);
	
	//Debug.Log ("rotation = " + rotation);

}

