public var platformObj : GameObject;

public var rate : float;
public var distance : float;

public var hor : boolean;
public var vert : boolean;
public var lat : boolean;
public var rot : boolean;
public var flipped : boolean;
public var delay : float;

private var origin : Vector3;
private var pos : Vector3;
private var angle : float;
private var timer : float;
private var pause : boolean;
private var check : boolean;

function Start () {

	origin = platformObj.transform.position;
	timer = delay;
	
}

function Update () {
	
	//Debug.Log ("pause = " + pause);
	//Debug.Log ("timer = " + timer);
	
	if (pause == false) {
		
        //delta is time between last and current frame
		angle += rate*Time.deltaTime;
		
		if (angle >= 360) {
			angle -= 360;
		}
		
		pos = origin;
		
		if (hor) {
			pos.x = MovePlatform(origin.x, pos.x);
		}
		if (vert) {
			pos.y = MovePlatform(origin.y, pos.y);
		}
		if (lat) {
			pos.z = MovePlatform(origin.z, pos.z);
		}
		if (rot) {
			//needs rotation code
		}
		
		platformObj.transform.position = pos;
	
	} else {
	
		//CheckTimer();
		timer -= Time.deltaTime;
		
		if (timer <= 0) {
			pause = false;
			timer = delay;
		}
	}
	
	WakeUp();
	
}

function MovePlatform (originX : float, posX : float) {
	
	//Debug.Log ("originX = " + originX + " posX = " + posX);
	
	if (flipped) {
		posX += Mathf.Sin(angle*Mathf.Deg2Rad) * distance * -1;
	} else {
		posX += Mathf.Sin(angle*Mathf.Deg2Rad) * distance;
	}
	
	if (posX >= originX + distance - 0.1) {
		if (check == true) { 
			posX = originX + distance;
			pause = true;
			check = false;
		}
	}
	
	if (posX <= originX - distance + 0.1) {
		if (check == false) {
			posX = originX - distance;
			pause = true;
			check = true;
		}
	}
	
	return posX;
}

function WakeUp () {

	if ((rigidbody != null) && rigidbody.IsSleeping()) {
		Debug.Log ("TEST!");
        rigidbody.WakeUp();
    }
    
}
