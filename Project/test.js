async function load_mesh(string) {
    var lines = string.split("\n");
    var positions = [];
    var normals = [];
    var textures = [];
    var vertices = [];
   
    for ( var i = 0 ; i < lines.length ; i++ ) {
      var parts = lines[i].trimRight().split(' ');
      if ( parts.length > 0 ) {
        switch(parts[0]) {
          case 'v':  positions.push(
            glMatrix.vec3.fromValues(
              parseFloat(parts[1]),
              parseFloat(parts[2]),
              parseFloat(parts[3])
            ));
            break;
          case 'vn':
            normals.push(
              glMatrix.vec3.fromValues(
                parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])
            ));
            break;
          case 'vt':
            textures.push(
              glMatrix.vec2.fromValues(
                parseFloat(parts[1]),
                parseFloat(parts[2])
            ));
            break;
          case 'f': {
            // f = vertex/texture/normal vertex/texture/normal vertex/texture/normal
            var f1 = parts[1].split('/');
            var f2 = parts[2].split('/');
            var f3 = parts[3].split('/');
            // Push vertex 1 of the face
            Array.prototype.push.apply(
              vertices, positions[parseInt(f1[0]) - 1]
            );
            Array.prototype.push.apply(
              vertices, textures[parseInt(f1[1]) - 1]
            );
            Array.prototype.push.apply(
              vertices, normals[parseInt(f1[2]) - 1]
            );
            // Push vertex 2 of the face
            Array.prototype.push.apply(
              vertices, positions[parseInt(f2[0]) - 1]
            );
            Array.prototype.push.apply(
              vertices, textures[parseInt(f2[1]) - 1]
            );
            Array.prototype.push.apply(
              vertices, normals[parseInt(f2[2]) - 1]
            );
            // Push vertex 3 of the face
            Array.prototype.push.apply(
              vertices, positions[parseInt(f3[0]) - 1]
            );
            Array.prototype.push.apply(
              vertices, textures[parseInt(f3[1]) - 1]
            );
            Array.prototype.push.apply(
              vertices, normals[parseInt(f3[2]) - 1]
            );
            break;
          }
        }
      }
    }
    var vertexCount = vertices.length / 8;
    console.log("Loaded mesh with " + vertexCount + " vertices");
    return {
      buffer: new Float32Array(vertices),
      num_triangles: vertexCount 
    };
  }


  async function load_mesh(string) {​​​​​
    let vertices = [];
    let textures = [];
    let normals = [];
    let faces = [];
    let vertexCount = 0;
    let lines = string.split("\n");

    for ( let i = 0; i < lines.length ; i++ ) {​​​​​
      let elem = lines[i].split(" ");
      if(elem[0] === "v"){
        ​​​​​vertices.push([elem[1],elem[2],elem[3]]);
      }​​​​​
      else if(elem[0] === "vt"){
        ​​​​textures.push([elem[1],elem[2]]);
      }
      ​​​​​else if(elem[0] === "vn"){​​​​​
        normals.push([elem[1],elem[2],elem[3]]);
      }
      ​​​​​else if(elem[0] === "f"){​​​​​
        faces.push([elem[1],elem[2],elem[3]]);
      }​​​​​
    }​​​​​
    let result = [];
    for(let i = 0; i < faces.length; i++){​​​​​
      for (let j = 0; j < 3; j++){​​​​​
        vertexCount ++;
        values = faces[i][j].split("/");
        Array.prototype.push.apply(result, vertices[values[0] - 1]);
        Array.prototype.push.apply(result, textures[values[1] - 1]);
        Array.prototype.push.apply(result, normals[values[2] - 1]);
            }​​​​​
        }​​​​​
      
    return {​​​​​
      buffer: new Float32Array(result),
      num_triangles: vertexCount
          }​​​​​;
        }​​​​​