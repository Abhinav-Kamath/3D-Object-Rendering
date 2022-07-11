const fragmentShaderSrc = `      
        precision mediump float;
        uniform vec4 aColor;          
        void main () {               
          gl_FragColor = aColor; 
        }                            
	  `;

export default fragmentShaderSrc;
