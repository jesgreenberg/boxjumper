public var cubeObj : GameObject;
public var cubeBurst : GameObject;
public var cubeLoop : GameObject;
public var dead : boolean;

private var spawn : Vector3;
private var xdif : float;
private var ydif : float;

function Awake () {

	spawn = transform.position;

}

function Start () {

	dead = false;
	cubeLoop.particleSystem.enableEmission = false;
	cubeBurst.particleSystem.enableEmission = false;

}

function Update () {
	
	var xpos : float = transform.position.x;
	var ypos : float = transform.position.y;
	
	//Control particle system
	if (xpos != xdif || ypos != ydif) {
		cubeLoop.particleSystem.enableEmission = true;
	} else {
		cubeLoop.particleSystem.enableEmission = false;
	}
    
	//Record position
	xdif = xpos;
	ydif = ypos;
	
}

function FixedUpdate () {

	if (GetComponent(CharacterMotor).movement.velocity.y > 1.5) {
		//Debug.Log ("Y Velocity " + GetComponent(CharacterMotor).movement.velocity.y);
		Physics.IgnoreLayerCollision(LayerMask.NameToLayer("Player"), LayerMask.NameToLayer("Platform"));
	} else {
		Physics.IgnoreLayerCollision(LayerMask.NameToLayer("Player"), LayerMask.NameToLayer("Platform"), false);
	}
	
	
}

function OnControllerColliderHit (hit : ControllerColliderHit) {
	
	if (hit.gameObject.tag == "Enemy" && dead == false) {
 		Die();
	}
	
}

function HidePlayer () {
	
	if (transform.position.y < -5) {
		//transform.position.y = -5; //show fall death
	}
	
	dead = true;
	cubeObj.SetActive(false);
	cubeLoop.particleSystem.Clear(true);
	cubeBurst.particleSystem.enableEmission = true;
	cubeBurst.SetActive(true);
	
}

function ShowPlayer () {
	
	dead = false;
	transform.position = spawn;
	cubeObj.SetActive(true);
	cubeBurst.particleSystem.enableEmission = false;
	cubeBurst.SetActive(false);
    cubeBurst.particleSystem.Clear(true);
    
}

function Die () {
	
	HidePlayer();
	GetComponent(InputController).foreignObj = null; //stop platform locking
	GameObject.Find("GUI").GetComponent(GameGUI).LoseLife();
	
	if (GlobalData.lives >= 0) {
		Respawn();
	}
	
}

function Respawn () {

	Debug.Log ("Remaining Lives: " + GlobalData.lives);
		
	//delay script
	yield WaitForSeconds (.5);
	
	//update lives
	GameObject.Find("GUI").GetComponent(GameGUI).ResetPlayer();
	ShowPlayer();
	
}