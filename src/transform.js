import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export default class Transform {
	constructor() {
		this.translate = vec3.fromValues(0, 0, 0);
		this.scale = vec3.fromValues(1, 1, 1);
		this.rotationAngleX = 0;
    this.rotationAngleY = 0;
    this.rotationAngleZ = 0;
		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.mvpMatrix = this.modelTransformMatrix;

		this.updateMVPMatrix();
	}

	getMVPMatrix() {
		return this.modelTransformMatrix;
	}

	updateMVPMatrix() {
		mat4.identity(this.modelTransformMatrix);
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleX, vec3.fromValues(1, 0, 0));
    mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleY, vec3.fromValues(0, 1, 0));
    mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngleZ, vec3.fromValues(0, 0, 1));
		mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
	}

	setTranslate(translationVec) {
		this.translate = translationVec;
	}

	getTranslate() {
		return this.translate;
	}

	setScale(scalingVec) {
		this.scale = scalingVec;
	}

	getScale() {
		return this.scale;
	}

	setRotate(rotationAxis, rotationAngle) {
    if(rotationAxis == 'x')
		  this.rotationAngleX = rotationAngle;
    else if(rotationAxis == 'y')
      this.rotationAngleY = rotationAngle;
    else if(rotationAxis == 'z')
      this.rotationAngleZ = rotationAngle;
	}

	getRotate() {
		return this.rotate;
	}
}
