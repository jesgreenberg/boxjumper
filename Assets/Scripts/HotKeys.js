@MenuItem ("HotKeys/Align View To Selected _g")
//@script ExecuteInEditMode ()
//[InitializeOnLoad]

/*static function Start () {
	Debug.Log("TEST");
	if (Camera.current != null) {
		Camera.current.transform.localEulerAngles = GameObject.Find("Camera").transform.localEulerAngles;
		Camera.current.transform.localPosition = GameObject.Find("Camera").transform.localPosition;
	}
}*/

static function AlignViewToSelected () {
    EditorApplication.ExecuteMenuItem("GameObject/Align View to Selected");
}