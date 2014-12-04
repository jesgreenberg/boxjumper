public var player : Transform;
public var offset : float;

private var cameraPos : Vector3;
private var playerPos : Vector3;

private var xDiff : float;
private var yDiff : float;


function Start () {

	cameraPos = transform.position;
	
}

function Update () {

    playerPos = player.position;
    playerPos.z = cameraPos.z + playerPos.z / 2;
    
    //Center on player for vert
    if (playerPos.y > 8) {
    
    	transform.position = playerPos;
    	
    } else if (playerPos.y < 8 && playerPos.y > 0) {
    
    	if (playerPos.y > 5) {
    		playerPos.y -= .1;
    		transform.position = playerPos;
    	}
    	
    	if (playerPos.y < 5.1 && playerPos.y > 0) {
    		playerPos.y = 5;
    		//playerPos.y += .1;
    		transform.position = playerPos;
    	}
    		
    } else if (playerPos.y < 0) {
    
    	/*if (playerPos.y < 0 && playerPos.y > -5.1) {
    		//iTween.MoveTo(transform.position.y,{"y":playerPos.y, "time":1, "easeType":iTween.EaseType.easeOutQuad});
    		playerPos.y -= .1;
    		transform.position = playerPos;
    	}*/
    	
    }
    
}