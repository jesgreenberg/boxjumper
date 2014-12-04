private var pushPower = 2.0;
 
function OnControllerColliderHit (hit : ControllerColliderHit) {

    var body : Rigidbody = hit.collider.attachedRigidbody;
 
    //no rigidbody
    if (body == null || body.isKinematic) {
    	return;
    }
    
    //don't push below us
    if (hit.moveDirection.y < -0.3) {
    	return;
    }
 
    //calculate direction from move, only push sides
    var pushDir = Vector3 (hit.moveDirection.x, 0, hit.moveDirection.z);
 
    //apply push
    body.velocity = pushDir * pushPower;
    
}