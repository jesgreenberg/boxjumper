public var mainCam : GameObject;
public var pause : GameObject;
public var lives : GameObject;
public var gems : GameObject;
public var timer : GameObject;
public var text : GameObject;

function Update () {
	
	pause.transform.position = Camera.main.ViewportToWorldPoint(Vector3(0,1,10));
	lives.transform.position = Camera.main.ViewportToWorldPoint(Vector3(0,1,10));
	gems.transform.position = Camera.main.ViewportToWorldPoint(Vector3(1,1,10));
	timer.transform.position = Camera.main.ViewportToWorldPoint(Vector3(.5,1,10));
	text.transform.position = Camera.main.ViewportToWorldPoint(Vector3(.5,.5,10));
	
}