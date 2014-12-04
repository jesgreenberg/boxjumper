public var cam : Camera;
public var bumpAudio : AudioSource;
public var jumpAudio : AudioSource;
public var clicked : boolean;
public var jump : boolean;
public var foreignObj : GameObject;

private var motor : CharacterMotor;

function Awake () {

	motor = GetComponent(CharacterMotor);
	
}

function Start () {

	var zooming: boolean;
	var zoomSpeed: float;

	if (zooming) {
	    var ray: Ray = camera.ScreenPointToRay(Input.mousePosition);
	    zoomDistance = zoomSpeed * Input.GetAxis("Vertical") * Time.deltaTime;
	    camera.transform.Translate(ray.direction * zoomDistance, Space.World);
	}

}

function Update () {
	
	var directionVector = new Vector3(0, 0, 0);
	var mousePos = Input.mousePosition;
	var playerPos = cam.WorldToScreenPoint(transform.position);
	
	
	if (GlobalData.paused != true) {
	
		if (Input.GetKey(KeyCode.LeftArrow)) {
			directionVector.x = -1;
		}
		if (Input.GetKey(KeyCode.RightArrow)) {
			directionVector.x += 1;
		}
		if (Input.GetKeyDown(KeyCode.UpArrow) || Input.GetKeyDown(KeyCode.Space)) {
			Jump();
		}
		if (Input.GetKeyDown(KeyCode.DownArrow)) {
			//down pressed
		}
		
		//Mouse controls
		if (Input.GetKey(KeyCode.Mouse0)) {
		
			if (mousePos.x < Screen.width / 2) {
				directionVector.x = -1;
			}
			if (mousePos.x > Screen.width / 2) {
				directionVector.x += 1;
			}
			if (mousePos.y > Screen.height / 2 || mousePos.y > playerPos.y) {
				//check if clicked
				//if (clicked != true) {
					Jump();
				//}
			}
			if (mousePos.y < Screen.height / 2 || mousePos.y < playerPos.y) {
				//down pressed
			}
			
		}
			
	}
	
	//Apply direction to the CharacterMotor
	motor.inputMoveDirection = transform.rotation * directionVector;
	motor.inputJump = jump;
	
	RestrictMovement(); //prevent accidental falls
	
}

function OnMouseDown () {
	
	clicked = !clicked; //prevent other clicks
	
	/*if (GlobalData.paused == true)  {
	
		if (Input.GetKey(KeyCode.Mouse0)) {
		
			//press anywhere to resume
			GameObject.Find("GUI").GetComponent(GameGUI).Resume();
		}
	}*/
	
}

function OnControllerColliderHit (hit : ControllerColliderHit) {
	
	//landing from jump
	if (jump == true) {
		jump = false;
		bumpAudio.Play();
		iTween.ScaleTo(gameObject,{"y":.98, "time":.1, "easeType":iTween.EaseType.easeOutQuad});
		iTween.ScaleTo(gameObject,{"y":1, "time":.1, "delay":.1, "easeType":iTween.EaseType.easeOutQuad});
	}
	
	if (GetComponent(Player).dead == false) {
	
		foreignObj = hit.gameObject;
		GlobalData.platform = foreignObj.transform.parent.name;
		
		Debug.Log ("Platform = " + GlobalData.platform);
		Debug.Log ("Collision with: " + foreignObj.tag);
		
		if (GlobalData.platform == "MovingPlatformVert") {
			//Debug.Log ("TEST!");
 			//transform.position.y = foreignObj.transform.position.y;
 		}
 		
	} else {
		foreignObj = null;
	}
	
}

function Jump () {

	//Debug.Log ("playerPos.y = " + playerPos.y + " mousePos.y = " + mousePos.y);
	
	jump = true;
	foreignObj = null;
	jumpAudio.Play();
	
	iTween.ScaleTo(gameObject,{"x":.96, "time":.2, "easeType":iTween.EaseType.easeOutQuad});
	iTween.ScaleTo(gameObject,{"x":1, "time":.2, "delay":.2, "easeType":iTween.EaseType.easeOutQuad});
	iTween.ScaleTo(gameObject,{"y":1.14, "time":.2, "easeType":iTween.EaseType.easeOutQuad});
	iTween.ScaleTo(gameObject,{"y":1, "time":.2, "delay":.2, "easeType":iTween.EaseType.easeOutQuad});
}

function RestrictMovement () {
	
	var p = transform.position.z;
	
	//lock player to lateral platforms
	if (GlobalData.platform == "MovingPlatformLat") {
		if ((p > 0.3 && p < 9.7) || (p > 10.3 && p < 19.7)) {
			motor.movingPlatform.movementTransfer = MovementTransferOnJump.PermaLocked;
		} else {
			motor.movingPlatform.movementTransfer = MovementTransferOnJump.PermaTransfer;
		}
	} else if (GlobalData.platform == "MovingPlatformHor") {
		motor.movingPlatform.movementTransfer = MovementTransferOnJump.InitTransfer;
	} else {
		motor.movingPlatform.movementTransfer = MovementTransferOnJump.PermaTransfer;
	}
	
	/*if ((p > 0.1 && p < 9.9) || (p > 10.1 && p < 19.9)) {
		motor.movingPlatform.movementTransfer = MovementTransferOnJump.PermaLocked;
	} else {
		motor.movingPlatform.movementTransfer = MovementTransferOnJump.PermaTransfer;
	}*/
	
	//snap player to platform z
	if (foreignObj != null && foreignObj.tag == "Platform") {
 		transform.position.z = foreignObj.transform.position.z;
	}
	

}

//Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")
