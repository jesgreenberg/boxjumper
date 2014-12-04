private var motor : CharacterMotor;

// Use this for initialization
function Awake () {
	spawn = transform.position;
	motor = GetComponent(CharacterMotor);
}

// Update is called once per frame
function Update () {
	
	// Get the input vector from kayboard or analog stick
	var directionVector = new Vector3(0, 0, 0);
	var mousePos = Input.mousePosition;
	var jump = false; 
	
	if (Input.GetKey(KeyCode.LeftArrow)) {
		directionVector.x = -1;
	}
	
	if (Input.GetKey(KeyCode.RightArrow)) {
		directionVector.x += 1;
	}
	
	if (Input.GetKey(KeyCode.Mouse0)) {
	
		if (mousePos.x < Screen.width / 2) {
			directionVector.x = -1;
		}
		
		if (mousePos.x > Screen.width / 2 + 50) {
			directionVector.x += 1;
		}
		
		if (mousePos.y > Screen.height / 2) {
			jump = true;
		}
		
	}
	
	if (Input.GetKey(KeyCode.Space)) {
		jump = true;
	}
	
	/*var directionVector = new Vector3(Input.GetAxis("Horizontal"), 0, 0);
	
	if (directionVector != Vector3.zero) {
		// Get the length of the directon vector and then normalize it
		// Dividing by the length is cheaper than normalizing when we already have the length anyway
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		
		// Make sure the length is no bigger than 1
		directionLength = Mathf.Min(1, directionLength);
		
		// Make the input vector more sensitive towards the extremes and less sensitive in the middle
		// This makes it easier to control slow speeds when using analog sticks
		directionLength = directionLength * directionLength;
		
		// Multiply the normalized direction vector by the modified length
		directionVector = directionVector * directionLength;
	}*/
	 
	/*Debug.Log (directionVector);
	 
	// Control particle system
	 particleSystem.enableEmission = false;
	
	if (directionLength > 0) {
		particleSystem.enableEmission = true;
	}
	
	if (directionLength == 0) {
		particleSystem.enableEmission = false;
	}*/
	
	// Apply the direction to the CharacterMotor
	motor.inputMoveDirection = transform.rotation * directionVector;
	
	//motor.inputJump = Input.GetButton("Jump");
	//motor.inputJump = Input.GetKeyDown(KeyCode.Space);
	motor.inputJump = jump;
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")
