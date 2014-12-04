public var color : Color;
public var playerObj : GameObject;

private var deathMsg : String[] = ["Oh Nos", "Not Again", "Help Me", "It Hurts"];
private var winMsg : String[] = ["Yay", "Winner", "Go Me"];

function Start () {
	
	renderer.material.color = color;
	renderer.material.color.a = 1;

}

function OnEnable () {

	var anyText : String;
	
	if (playerObj.GetComponent(Player).dead != true ) {
		anyText = winMsg[Random.Range(0, winMsg.Length)];
	} else {
		anyText = deathMsg[Random.Range(0, deathMsg.Length)];
	}
	
	GetComponent(TextMesh).text = anyText;
	
}