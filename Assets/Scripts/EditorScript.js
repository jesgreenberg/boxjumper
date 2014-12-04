/*@script ExecuteInEditMode ()
//[InitializeOnLoad]

function Start () {
	Debug.Log("Editor Script");
	Debug.Log(Camera.current);
	
	if (Camera.current != null) {
		Camera.current.transform.localEulerAngles = Camera.main.transform.localEulerAngles;
		Camera.current.transform.localPosition = Camera.main.transform.localPosition;
		//camera.current.transform.localEulerAngles = GameObject.Find("Camera").transform.localEulerAngles;
		//camera.current.transform.localPosition = GameObject.Find("Camera").transform.localPosition;
	}
}*/