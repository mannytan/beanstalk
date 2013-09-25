/* 
Paul Kaplan, @ifitdidntwork

Create an ASCII STL file from a THREE.js mesh 
that can be saved save from browser and 3D printed
--------------------------------------------------
See further explanation here:
http://buildaweso.me/project/2013/2/25/converting-threejs-objects-to-stl-files
--------------------------------------------------
Saving the file out of the browser is done using FileSaver.js
find that here: https://github.com/eligrey/FileSaver.js
*/

function stringifyVertex(vec){
  var x = ((vec.x*10000) | 0) / 10000;
  var y = ((vec.y*10000) | 0) / 10000;
  var z = ((vec.z*10000) | 0) / 10000;
  return (x)+" "+ (-z)+" "+(y);
}

// Use FileSaver.js 'saveAs' function to save the string
function saveSTL( geometry, name ){  
  var stlString = generateSTL( geometry );
  
  var blob = new Blob([stlString], {type: 'text/plain'});
  
  saveAs(blob, name + '.stl');
  
}


function generateSTLFromArray(geometryList){
  var geometry, vertices, tris;

  var stl = "solid\n";

  for(var j = 0; j<geometryList.length; j++){
    geometry = geometryList[j].geometry;
    vertices = geometry.vertices;
    tris     = geometry.faces;
  
    for(var i = 0; i<tris.length; i++){
      stl += ("facet normal "+stringifyVertex( tris[i].normal )+" \n");
      stl += ("outer loop \n");
      stl += ("vertex "+stringifyVertex( vertices[ tris[i].a ])+" \n");
      stl += ("vertex "+stringifyVertex( vertices[ tris[i].b ])+" \n");
      stl += ("vertex "+stringifyVertex( vertices[ tris[i].c ])+" \n");
      stl += ("endloop \n");
      stl += ("endfacet \n");

      stl += ("facet normal "+stringifyVertex( tris[i].normal )+" \n");
      stl += ("outer loop \n");
      stl += ("vertex "+stringifyVertex( vertices[ tris[i].c ])+" \n");
      stl += ("vertex "+stringifyVertex( vertices[ tris[i].d ])+" \n");
      stl += ("vertex "+stringifyVertex( vertices[ tris[i].a ])+" \n");
      stl += ("endloop \n");
      stl += ("endfacet \n");
      
    }
  }

  stl += ("endsolid");

  return stl;
}

// Use FileSaver.js 'saveAs' function to save the string
function saveSTLFromArray( geometryList, name ){  
  var stlString = generateSTLFromArray( geometryList );
  
  var blob = new Blob([stlString], {type: 'text/plain'});
  
  saveAs(blob, name + '.stl');
  
}