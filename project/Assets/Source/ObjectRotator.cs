using UnityEngine;

public class ObjectRotator : MonoBehaviour
{
    public float rotationSpeed = 30f; // Adjust the speed of rotation here

    void Update()
    {
        // Rotate the object around its y-axis
        transform.Rotate(Vector3.up, rotationSpeed * Time.deltaTime);
    }
}