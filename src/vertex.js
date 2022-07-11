const vertexShaderSrc = `      
        attribute vec3 aPosition;
        uniform mat4 uModelTransformMatrix; 
        uniform mat4 project;
        uniform mat4 view; 
        void main () {             
          gl_Position = project * view * uModelTransformMatrix * vec4(aPosition, 1.0); 
          gl_PointSize = 5.0;  
        }                          
	  `;

export default vertexShaderSrc;