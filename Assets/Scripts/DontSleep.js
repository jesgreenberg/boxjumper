function Update () {

	DontSleep();
	
}

function DontSleep () {

	if ((rigidbody != null) && rigidbody.IsSleeping()) {
		Debug.Log ("Wake Up");
        rigidbody.WakeUp();
    }
    
}