import { vec3, mat4, vec4 } from "https://cdn.skypack.dev/gl-matrix";
import Shader from "./shader.js";
import vertexShaderSrc from "./vertex.js";
import fragmentShaderSrc from "./fragment.js";
import Renderer from "./renderer.js";
import ax_1 from "./ax_1.js";
import ax_2 from "./ax_2.js";
import ax_3 from "./ax_3.js";
import insect from "./insect.js";
import model from "./model.js";
import sphere from "./sphere.js";

const renderer = new Renderer();
const gl = renderer.webGlContext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();
const project = mat4.create();
const view = mat4.create();
init();
let axis = "";
let x = 0;
let scene = [];
let topView = false;
let selected = -1;
let angles_x = [0, 0, 0],
  angles_y = [0, 0, 0],
  angles_z = [0, 0, 0];
let stationary_Flag = true;
let mode = "i";

let difference = 0.0001;

function rotateObj(rotationAxis, rotationAngle, array, selected) {
  array[selected - 3] += rotationAngle;
  scene[selected].transform.setRotate(rotationAxis, array[selected - 3]);
  scene[selected].transform.updateMVPMatrix();
}

function rotateCamera(rotationAxis, rotationAngle) {
  var temp = [window.eye[0], window.eye[1], window.eye[2], 1];
  var transfromMatrix = mat4.create();
  mat4.identity(transfromMatrix);
  mat4.rotate(transfromMatrix, transfromMatrix, rotationAngle, rotationAxis);
  vec4.transformMat4(temp, temp, transfromMatrix);
  window.eye = temp.slice(0, 3);

  temp = [window.up[0], window.up[1], window.up[2], 1];
  mat4.identity(transfromMatrix);
  mat4.rotate(transfromMatrix, transfromMatrix, rotationAngle, rotationAxis);
  vec4.transformMat4(temp, temp, transfromMatrix);
  window.up = temp.slice(0, 3);

  mat4.lookAt(view, window.eye, [0, 0, 0], window.up);
  mat4.perspective(project, 1, 1, 0.1, 100);

  const projectUniform = shader.uniform("project");
  shader.setUniformMatrix4fv(projectUniform, project);

  const viewUniform = shader.uniform("view");
  shader.setUniformMatrix4fv(viewUniform, view);
}

window.onload = () => {
  window.addEventListener(
    "keydown",
    function (e) {
      switch (e.key) {
        case "i":
          window.Mode = "i";
          scene = [];
          scene.push(new ax_1(gl));
          scene.push(new ax_2(gl));
          scene.push(new ax_3(gl));
          rotateCamera([0, 0, 1], 0.03 * 18);
          scene.push(new insect(gl));
          console.log(scene[0].isPicked);
          scene.push(new model(gl));
          scene[3].transform.setTranslate(vec3.fromValues(0, 0, 0));
          scene[3].transform.updateMVPMatrix();
          scene[4].transform.setTranslate(vec3.fromValues(-1, 0, 0));
          scene[4].transform.setScale(
            vec3.fromValues(
              scene[4].transform.getScale()[0] / 10.005,
              scene[4].transform.getScale()[1] / 10.005,
              scene[4].transform.getScale()[2] / 10.005
            )
          );
          scene[4].transform.updateMVPMatrix();
          scene.push(new sphere(gl));
          scene[5].transform.setTranslate(vec3.fromValues(1, 0, 0));
          scene[5].cx += 1;
          scene[5].transform.setScale(
            vec3.fromValues(
              scene[5].transform.getScale()[0] / 7.005,
              scene[5].transform.getScale()[1] / 7.005,
              scene[5].transform.getScale()[2] / 7.005
            )
          );
          scene[5].transform.updateMVPMatrix();

          break;
        case "x":
          window.Cam = "x";
          console.log("camera x");

          break;
        case "y":
          window.Cam = "y";
          console.log("camera y");

          break;
        case "z":
          if (!topView) {
            window.Cam = "z";
            console.log("camera z");
          }

          break;
        case "t":
          if (!topView) {
            topView = true;

            const view = mat4.create();
            mat4.lookAt(
              view,
              vec3.fromValues(0, 0, 2.5),
              vec3.fromValues(0, 0, 0),
              vec3.fromValues(0, 1, 0)
            );
            const viewUniform = shader.uniform("view");
            shader.setUniformMatrix4fv(viewUniform, view);
            console.log("TopView");
          } else {
            topView = false;

            const projectUniform = shader.uniform("project");
            shader.setUniformMatrix4fv(projectUniform, project);

            const viewUniform = shader.uniform("view");
            shader.setUniformMatrix4fv(viewUniform, view);
            console.log("3DView");
            window.Mode = "i";
          }
          break;

        case "ArrowLeft":
          console.log("Left");
          if (axis === "x") rotateObj("x", 0.03, angles_x, selected);
          else if (axis === "y") rotateObj("y", 0.03, angles_y, selected);
          else if (axis === "z") rotateObj("z", 0.03, angles_z, selected);
          break;
        case "ArrowRight":
          console.log("Right");
          if (axis === "x") rotateObj("x", -0.03, angles_x, selected);
          else if (axis === "y") rotateObj("y", -0.03, angles_y, selected);
          else if (axis === "z") rotateObj("z", -0.03, angles_z, selected);
          break;
          break;
        case "X":
          axis = "x";
          console.log();
          break;
        case "Y":
          axis = "y";
          break;
        case "Z":
          axis = "z";
          break;

        case "+":
          if (selected !== -1) {
            scene[selected].transform.setScale(
              vec3.fromValues(
                scene[selected].transform.getScale()[0] * 1.005,
                scene[selected].transform.getScale()[1] * 1.005,
                scene[selected].transform.getScale()[2] * 1.005
              )
            );
            scene[selected].transform.updateMVPMatrix();
          }
          break;
        case "-":
          if (selected !== -1) {
            scene[selected].transform.setScale(
              vec3.fromValues(
                scene[selected].transform.getScale()[0] / 1.005,
                scene[selected].transform.getScale()[1] / 1.005,
                scene[selected].transform.getScale()[2] / 1.005
              )
            );
            scene[selected].transform.updateMVPMatrix();
          }
          break;
        case "a":
          mode = "a";
          console.log("animate mode");
          break;
        case "ArrowUp":
          console.log("speed up");
          if (!stationary_Flag) difference += 0.0005;
          break;
        case "ArrowDown":
          if (!stationary_Flag) {
            console.log("slowdown");
            if (difference - 0.0005 > 0) difference -= 0.0005;
          }
      }
    },
    true
  );
  renderer.getCanvas().addEventListener("mousemove", (e) => {
    if (!topView) {
      if (e.clientX > x) window.theta = 0.03;
      if (e.clientX < x) window.theta = -0.03;
      x = e.clientX;
      if (window.Cam === "x") rotateCamera([1, 0, 0], window.theta);
      else if (window.Cam === "y") rotateCamera([0, 1, 0], window.theta);
      else if (window.Cam === "z") rotateCamera([0, 0, 1], window.theta);
    }
  });
  gl.canvas.addEventListener("mousedown", function (e) {
    if (topView && mode !== "a") {
      let canvas = renderer.getCanvas();
      const rect = canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      let mouseY = e.clientY - rect.top;
      const pixelX = (mouseX * gl.canvas.width) / gl.canvas.clientWidth;
      const pixelY =
        gl.canvas.height -
        (mouseY * gl.canvas.height) / gl.canvas.clientHeight -
        1;
      let pixels = new Uint8Array([255, 255, 0, 1]);

      gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      console.log(pixels);
      if (pixels[0] === 0 && pixels[1] === 255 && pixels[2] === 255) {
        if (selected === -1) selected = 3;
        else scene[selected].isPicked = false;
        scene[3].isPicked = true;
        scene[3].draw(shader);
        selected = 3;

        window.points[0] = renderer.mouseToClipCoord(e.clientX, e.clientY);
      } else if (pixels[0] === 255 && pixels[1] === 0 && pixels[2] === 255) {
        if (selected === -1) selected = 4;
        else scene[selected].isPicked = false;
        scene[4]._isPicked = true;
        scene[4].draw(shader);
        selected = 4;

        window.points[0] = renderer.mouseToClipCoord(e.clientX, e.clientY);
        console.log(window.points[0]);
      } else if (pixels[0] === 255 && pixels[1] === 0 && pixels[2] === 0) {
        if (selected === -1) selected = 4;
        else scene[selected].isPicked = false;
        scene[5]._isPicked = true;
        scene[5].draw(shader);
        selected = 5;

        window.points[0] = [scene[selected].cx, scene[selected].cy];
        console.log(window.points[0]);
      }
    } else if (topView && mode === "a") {
      if (selected !== -1 && points.length <= 3) {
        let [pixelX, pixelY] = renderer.mouseToClipCoord(e.clientX, e.clientY);
        console.log(pixelX, pixelY);
        window.points.push([pixelX, pixelY]);
        console.log("Points of curve");
        console.log(window.points);
        stationary_Flag = false;
      }
    }
  });
};

function init() {
  mat4.perspective(project, 1, 1, 0.1, 100);
  const projectUniform = shader.uniform("project");
  shader.setUniformMatrix4fv(projectUniform, project);

  mat4.lookAt(
    view,
    vec3.fromValues(2, 1.2, 1.5),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 0, 1)
  );
  const viewUniform = shader.uniform("view");
  shader.setUniformMatrix4fv(viewUniform, view);
  window.theta = 0;
  window.t = 0.1;
  window.Mode = "i";

  window.eye = [2, 1.2, 1.5];
  window.up = [0, 0, 1];
  window.points = [];
  window.Cam = "";
  window.factor = 0.15;
}

function animate() {
  renderer.clear();
  if (mode !== "a") window.t = 0;
  if (mode === "a" && window.points.length === 3 && window.t <= 1) {
    window.t += difference;
    let a_x =
        2 * window.points[0][0] -
        4 * window.points[1][0] +
        2 * window.points[2][0],
      b_x =
        -3 * window.points[0][0] +
        4 * window.points[1][0] -
        window.points[2][0],
      c_x = window.points[0][0];
    let a_y =
        2 * window.points[0][1] -
        4 * window.points[1][1] +
        2 * window.points[2][1],
      b_y =
        -3 * window.points[0][1] +
        4 * window.points[1][1] -
        window.points[2][1],
      c_y = window.points[0][1];

    let newX = a_x * window.t * window.t + b_x * window.t + c_x;
    let newY = a_y * window.t * window.t + b_y * window.t + c_y;

    scene[selected].transform.setTranslate(
      vec3.fromValues(newX, newY, scene[selected].transform.getTranslate()[2])
    );
    scene[selected].cx = newX;
    scene[selected].cy = newY;
    scene[selected].transform.updateMVPMatrix();
  }
  if (window.t > 1) {
    mode = "i";
    console.log("stationery mode");
    window.points = [];
    difference = 0.0001;
    stationary_Flag = true;
    scene[selected]._isPicked = false;
    selected = -1;
  }
  scene.forEach((item) => {
    item.draw(shader);
  });
  window.requestAnimationFrame(animate);
}

animate();
