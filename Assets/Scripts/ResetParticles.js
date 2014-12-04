function Update () {

	if (particleSystem != null && particleSystem.particleCount == 0) {
		transform.parent.SetActive(false);
	}

}