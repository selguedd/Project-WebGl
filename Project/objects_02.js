var load_obj = async function(name = 'bunny_small.obj') {
  async function load_mesh(string) {
    let vertices = [];
    let textures = [];
    let normals = [];
    let faces = [];
    let vertexCount = 0;
    let lines = string.split("\n");

    for ( var i = 0 ; i < lines.length ; i++ ) {
      let elem = lines[i].split(" ");
      if (elem[0] === 'v'){
        vertices.push([elem[1],elem[2],elem[3]]);
      }
      else if (elem[0] === 'vt'){
        textures.push([elem[1],elem[2]]);
      }
      else if (elem[0] === 'vn'){
        normals.push([elem[1],elem[2],elem[3]]);
      }
      else if(elem[0] === 'f'){
        faces.push([elem[1],elem[2],elem[3]]);
      }
    }
    let result = [];
    for (let i = 0; i < faces.length; i++){
      for (let j = 0; j < 3; j++){
        vertexCount ++;
        values = faces[i][j].split("/");
        Array.prototype.push.apply(result, vertices[values[0] - 1]);
        Array.prototype.push.apply(result, textures[values[1] - 1]);
        Array.prototype.push.apply(result, normals[values[2] - 1]);
      }
    }

    console.log("Loaded mesh with " + vertexCount + " vertices");
    return {
      buffer: new Float32Array(result),
      num_triangles: (vertexCount)
    };
  }
  
  const response = await fetch(name);
  const text = await response.text();
  
  const ret = await load_mesh(text);

  return ret;
}
    

var make_object = async function(gl, obj) {
    // We need the object to be ready to proceed:
    obj = await obj;
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, obj.buffer, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var Model = glMatrix.mat4.create();
    Model = glMatrix.mat4.translate(Model, Model, glMatrix.vec3.fromValues(0.5, -0.5, -1.0));

    function activate(shader) {
        // these object have all 3 positions + 2 textures + 3 normals
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const sizeofFloat = Float32Array.BYTES_PER_ELEMENT;
        const att_pos = gl.getAttribLocation(shader.program, 'position');
        gl.enableVertexAttribArray(att_pos);
        gl.vertexAttribPointer(att_pos, 3, gl.FLOAT, false, 8 * sizeofFloat, 0 * sizeofFloat);

        const att_textcoord = gl.getAttribLocation(shader.program, "texcoord");
        gl.enableVertexAttribArray(att_textcoord);
        gl.vertexAttribPointer(att_textcoord, 2, gl.FLOAT, false, 8 * sizeofFloat, 3 * sizeofFloat);
    
        const att_nor = gl.getAttribLocation(shader.program, 'normal');
        gl.enableVertexAttribArray(att_nor);
        gl.vertexAttribPointer(att_nor, 3, gl.FLOAT, false, 8 * sizeofFloat, 5 * sizeofFloat);
        
    }

    function draw() {
        x = obj.num_triangles ;
        gl.drawArrays(gl.TRIANGLES, 0, x);
    }

    return {
        buffer: buffer,
        model: Model,
        activate: activate,
        draw: draw,
    }

}




