//schemas

const glTF_OCES_eyes_schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "glTF.OCES_eyes.schema.json",
    "title": "OCES_eyes glTF Document Extension",
    "type": "object",
    //: "This defines version 0.3.0",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
      "version": {
        "description": "The version of the OCES_eyes extension standard this file is built against. Must be in the format major.minor.fix and must match an extant OOCES version.",
        "type": "string",
        "pattern": "^[0-9]+.[0-9]+.[0-9]+$"
      },
      "generator": {
        "description": "The name and model number of the tool that generated the OCES-specific (or all) parts of this file.",
        "type": "object",
        "properties": {
          "name": {
            "description": "The name of the tool that generated the OCES-specific (or all) parts of this file.",
            "type": "string"
          },
          "version": {
            "description": "The version of the tool that generated the OCES-specific (or all) parts of this file.",
            "type": "string"
          }
        }
      },
      "creationDatetime": {
        "description": "The date and time when the file was created.",
        "type": "string",
        "format": "date-time"
      },
      "maximumRenderDistance": {
        "description": "Somewhat implementation-specific: The maximum distance from an eye at which objects are still rendered (in top-level worldspace).",
        "type": "number",
        "exclusiveMinimum": 0
      },
      "extensions": {},
      "extensionsUsed": {},
      "extensionsRequired": {},
      "extras": {},
      "mirrorPlanes": {
        "description": "A list of mirror planes (in an arbitrary coordinate system that is interpreted by an individual eye as matching it's associated head's coordinate system) that are used to mirror eye objects. To be referenced by eye objects via index",
        "type": "array",
        "items": {"$ref": "OCES_eyes.mirrorPlane.schema.json"},
        "minItems": 1
      },
      "ommatidialProperties": {
        "description": "A list of ommatidial properties (in the local ommatidial coordinate space) that describe the surface property distribution of a specified feature over an eye",
        "type": "array",
        "items": {"$ref": "OCES_eyes.ommatidialProperty.schema.json"},
        "minItems": 1
      },
      "eyes": {
        "description": "A list of eyes objects to be attached to nodes via index reference.",
        "type": "array",
        "items": {"$ref": "OCES_eyes.eye.schema.json"},
        "minItems": 1
      }
    },
    "required": ["version", "eyes"]
},

eye_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "OCES_eyes.eye.schema.json",
  "title": "OCES_eyes Top-level eye properties definition",
  "description": "The top-level schema for an eye, defining the structure that all eyes must follow.",
  // This is the top-level schema for an eye - all eyes must have these properties, and specify an eye type that indicates further required properties",
  "type": "object",
  "allOf": [
    {
      "$ref": "OCES_eyes.eye.shared.schema.json",
      // Include all the properties that every eye type shares"
    }
  ],
  "oneOf": [
    { "$ref": "OCES_eyes.eye.point_ommatidial.schema.json"},
    { "$ref": "OCES_eyes.eye.surface.schema.json" },
    { "$ref": "OCES_eyes.eye.spherical.schema.json" }
  ]
},

eye_shared_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "OCES_eyes.eye.shared.schema.json",
  "title": "OCES_eyes Shared eye properties definition",
  "description": "This schema defines all properties that all eyes must have.",
  "type": "object",
  "allOf": [
    { "$ref": "glTFChildOfRootProperty.schema.json"},// "All eyes are defined as the child of a root property
    { "required": ["type"]} // "All eyes must define their type
  ],
  "properties": {
    "name": {
      "description": "The user-defined name of this set of eye data",
      "type": "string",
      "default": ""
    },
    "enabled": {
      "description": "Whether this eye is enabled or not",
      "type": "boolean",
      "default": true
    },
    "mirrorPlanes": {
      "description": "An array of the id(s) of the mirror plane(s) to use to mirror this eye's data across (in the Head Coordinate Space of this eye's closest Head ancestor)",
      "type": "array",
      "items": {
        "allOf": [ { "$ref": "glTFid.schema.json" } ],
        "description": "The id of a mirror plane to use to mirror this eye's data across (in the Head Coordinate Space of this eye's closest and only Head ancestor)"
      },
      "minItems": 1
    },
    "ommatidialProperties": {
      //!! 原来是descrtiption
      "description": "An JSON key-value object that acts as a named list of the id(s) of the property set(s) to use to describe this eye's per-ommatidial data (in the Local Ommatidial Coordinate Space, defined relative to this eye's origin. The properties describe this eye's per-ommatidial data (such as position, orientation, facet diameter etc., depending on the type of eye data defined).",
      //More complex schema that actually layout which properties of each eye data type are defined in their individual schema files - this schema just specifies that they are of the eyeProperty type
      "type": "object"
    }
  },
  "required": ["type"]
},

eye_point_ommatidial_schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "OCES_eyes.eye.point_ommatidial.schema.json",
    "title": "OCES_eyes Point-ommatidial eye data properties definition",
    "description": "This schema defines all properties that are unique to point-ommatidial eye datasets.",
    "type": "object",
    "properties": {
      "type": {
        "description": "The type of eye. This schema defines the point-ommatidial type.",
        "const": "POINT_OMMATIDIAL"
      },
      "ommatidialProperties": {
        "description": "Point-ommatidial eyes require these ommatidial properties to be defined.",
        "type": "object",
        // 这四项需是object才可被required
        "properties": {
          "POSITION": {
            "description":"3D Vector",
            "type":"array",
            "items": {"type" : "number"},
            "minItems": 3,
            "maxItems": 3
          },
          "ORIENTATION": {
            "description":"3D Vector",
            "type":"array",
            "items": {"type" : "number"},
            "minItems": 3,
            "maxItems": 3
          },
          "FOCAL_OFFSET": {
            "oneOf":[
              {"description":"3D Vector",
              "type":"array",
              "items": {"type" : "number"},
              "minItems": 3,
              "maxItems": 3},
              {"type":"number"}
            ]
          },
          "DIAMETER": {"type":"number"}
        },
        "required": ["POSITION", "ORIENTATION", "FOCAL_OFFSET", "DIAMETER"]
      },
    },
    // "Point-ommatidial eyes have no unique properties outside of those defined in the base eye schema."
},

eye_surface_schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "OCES_eyes.eye.surface.schema.json",
    "title": "OCES_eyes Surface mesh eye data properties definition",
    "description": "This schema defines all properties that are unique to surface mesh-based eye datasets.",
    "type": "object",
    "properties": {
      "type": {
        "description": "The type of eye. This schema defines the surface mesh type.",
        "const": "SURFACE"
      },
      "ommatidialCount": {
        "description": "The number of ommatidia in the eye.",
        "type": "integer",
        "minimum": 1
      },
      "ommatidialProperties": {
        "description": "Surface mesh eyes require these ommatidial properties to be defined.",
        "type": "object",
        "required": ["DIAMETER", "FOCAL_OFFSET"]
      },
      "surface": {
        "description": "Defines the surface mesh of the eye. Similar to glTF's mesh 'attributes' property, but simplified.",
        "type": "object",
        // The first properties set bewlo defines the 3 required attributes: 'POSITION', 'NORMAL' and 'INDICES'
        "properties": {
          "POSITION": {
            "description": "A reference to a glTF accessor that stores the 3D vertex positions of the eye surface, must be the same length as the NORMAL accessor.",
            
          },
          "NORMAL": {
            "description": "A reference to a glTF accessor that stores the 3D vertex normals of the eye surface, must be the same length as the POSITION accessor.",
            
          },
          "INDICES": {
            "description": "A reference to a glTF accessor that stores the indices of the 3D eye surface triangles, interpreted as triplets of indices to indicate the vertex/normal pair that make up each corner of the triangles, in counter-clockwise winding order.",
            "type": "integer",
            "multipleOf": 3
            //!!原来是multple
          }
        },
        "required": ["POSITION", "NORMAL", "INDICES"],
        //"$comment": "This 'anyOf'/'not' combination enforces that if either one of 'TEXTURE_COORD' or 'TEXTURE_INDICES' is defined, the other is also defined.",
        "anyOf":[
          {
            //"$comment": "This block fails if any of 'TEXTURE_COORD' or 'TEXTURE_INDICES' are defined, meaning that if any are defined, the next block has to succeed for the file to be valid.",
            "not": {
              "anyOf": [
                { "required": ["TEXTURE_COORD"] },
                { "required": ["TEXTURE_INDICES"] }
              ]
            }
          },
          {
            //"$comment": "This block only succeeds if both 'TEXTURE_COORD' and 'TEXTURE_INDICES' are defined.",
            "properties": {
              "TEXTURE_COORD": {
                "description": "Reference to a glTF accessor that stores the 2D texture coordinates of the eye surface, must be the same length as the POSITION and NORMAL accessors, i.e. defined for each vertex on the mesh.",
                "allOf": [ { "$ref": "glTFid.schema.json" } ]
              },
              "TEXTURE_INDICES": {
                "description": "Reference to a glTF accessor that stores the indices of the 2D triangles in texture coordinate space of the eye surface, must be the same length as the INDICES accessor, i.e. each 3D triangle defined in INDICES must have an associated 2D triangle.",
                "allOf": [ { "$ref": "glTFid.schema.json" } ]
              }
            },
            "required": ["TEXTURE_COORD", "TEXTURE_INDICES"]
          }
        ]
      }
    },
    "required": ["ommatidialCount", "surface"]
},

eye_spherical_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "OCES_eyes.eye.spherical.schema.json",
  "title": "OCES_eyes Spherical eye data properties definition",
  "description": "This schema defines all properties that are unique to spherically-defined eye datasets.",
  "type": "object",
  "properties": {
    "type": {
      "description": "The type of eye. This schema defines the spherical type.",
      "const": "SPHERICAL"
    },
    "ommatidialCount": {
      "description": "The number of ommatidia in the eye.",
      "type": "integer",
      "minimum": 1
    },
    "radius": {
      "description": "The radius of this eye, if it were taken as a literal sphere.",
      "type": "number",
      "minimum": 0,
      "default": 1
    },
    "ommatidialProperties": {
      // TODO 这一块还需要定义吗？
      "type": "object",
      "description": "Spherical eyes require these ommatidial properties to be defined.",
      "required": ["DIAMETER", "FOCAL_OFFSET"]
    }
  },
  "required": ["ommatidialCount"]
},

mirrorPlane_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "OCES_eyes.mirrorPlane.schema.json",
  "title": "OCES_eyes Mirror Plane definition",
  "description": "A plane that is used to describe a mirror (and duplicate) operation across itself in the related Head Coordinate Space. Eyes can reference (by index in the global `mirrorPlanes` array) a mirror plane to mirror their data across in relation to their associated head.",
  "type": "object",
  "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
  "properties": {
    "name": {
      "description": "The user-defined name of this object. Used only for user reference.",
      "type": "string",
      "default": ""
    },
    "position": {
      "description": "The position of the mirror plane in the Head Coordinate Space.",
      "description": "A directly-specified 3D normal direction vector.",
      "type": "array",
      "items": { "type": "number" },
      "minItems": 3,
      "maxItems": 3,
      "default": [ 0, 0, 0 ]
    },
    "normal": {
      "description": "The normal of the mirror plane in the Head Coordinate Space.",
      "default": [ 1, 0, 0 ],
      "oneOf": [
        {
          "description": "A directly-specified 3D normal direction vector.",
          "type": "array",
          "items": { "type": "number" },
          "minItems": 3,
          "maxItems": 3
        },
        {
          "description": "An alias for a normal along the HCS X axis.",
          "enum": ["X", "FRONTAL", "LEFT", "RIGHT"]
        },
        {
          "description": "An alias for a normal along the HCS Y axis.",
          "enum": ["Y", "TRANSVERSE", "DORSOVENTRAL", "UP", "DOWN"]
        },
        {
          "description": "An alias for a normal along the HCS Z axis.",
          "enum": ["Z", "SAGITTAL", "ANTERIOR", "POSTERIOR", "ANTEPOSTERIOR", "FORWARD", "BACKWARD", "FRONT", "BACK"]
        }
      ]
    }
  }
},

ommatidialProperty_schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "OCES_eyes.ommatidialProperty.schema.json",
    "title": "OCES_eyes Ommatidial property definition",
    "description": "Ommatidial properties are the property 'layers' that can be used to describe the distribution of a value over the ommatidia in an eye. This schema defines a list of these layers that can be applied to any type of eye.",
    "type": "object",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "oneOf": [
      { "$ref": "OCES_eyes.ommatidialProperty.coarse.schema.json" },
      { "$ref": "OCES_eyes.ommatidialProperty.accessor.schema.json" },
      { "$ref": "OCES_eyes.ommatidialProperty.texture.schema.json" }
    ],
    "properties": {
      "name": {
        "description": "The user-defined name of this ommatidial property. Used only for user reference to differentiate between ommatidial property sets in the list of all property sets, not to define how the property is applied to any specific eye.",
        "type": "string",
        "default": ""
      }
    },
    // Type and value must be specified for every eye property, regardless of which type it is
    "required": ["type", "value"]
},

ommatidialProperty_accessor_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "OCES_eyes.ommatidialProperty.accessor.schema.json",
  "description": "An ommatidial property set stored as an accessor, referenced via a glTF id.",
  "type": "object",
  "properties": {
    "type": {
      "description": "Specifies that the ommatidial property set is stored in an accessor.",
      "const": "ACCESSOR"
    },
    "value": {
      "description": "The id of the accessor or texture storing the eye properties.",
      "anyOf": [ { "$ref": "glTFid.schema.json" } ]
    },
    "dataStride": {
      "description": "It may be necessary to use custom data that does not fit the glTF types of SCALAR, VEC2/3/4 or MAT2/3/4, for instance, when a time-series is required or polygons defined by an arbitrarily long list of VEC2s. This allows that data to be specified alongside regular eye properties.",
      "default": 1
    }
  }
},

ommatidialProperty_coarse_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "OCES_eyes.ommatidialProperty.coarse.schema.json",
  "description": "A directly-specified coarse ommatidial property value.",
  "type": "object",
  "properties": {
    "type": {
      "description": "Specifies that the eye property is stored directly as a coarse value.",
      "type": "string",
      "const": "COARSE"
    },
    "value": {
      "description": "The raw value of the eye property, stored as a single datapoint of the same type that would be stored in the accessor or texture. Typically a 1/2/3/4-D vector in the case of textures where there can be up to 4 channels, and an ND vector in the case of accessor arrays, where the accessor can reference an array of any length, which can then in-turn be interpreted as an array of some multiple of objects",
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "description": "A single-dimensional array of numbers.",
                "type": "number"
              },
              {
                "description": "A 2D array of numbers of arbitrary length, but all sub-arrays must be of the same length and between 2 and 16 values long.",
                "type": "array",
                "items": {
                  "type": "number"
                },
                "minItems": 2,
                "maxItems": 16
              }
            ]
          },
          "minItems": 2
        }
      ]
    }
  }
},

ommatidialProperty_texture_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "OCES_eyes.ommatidialProperty.texture.schema.json",
  "title": "OCES_eyes TEXTURE ommatidial properties definition.",
  "description": "An ommatidial property set stored as a texture, referenced via a glTF id.",
  "type": "object",
  "properties": {
    "type": {
      "description": "Specifies whether the eye properties are stored in an accessor or a texture.",
      "const": "TEXTURE"
    },
    "value": {
      "description": "The id of the accessor or texture storing the eye properties.",
      "anyOf": [ { "$ref": "glTFid.schema.json" } ]
    },
    "textureScale": {
      "description": "A scaling factor to apply to the retrieved texture values. 1-4 dimensional. Recommended 1 dimensional. Must be either 1 dimensional (applied to all dimensions of returned texture values) or match the dimensionality of the texture referenced by this ommatidialProperty (i.e. an RGB image can have a texture scale that is a singular number or a 3D vector of 3 numbers).",
      // 没必要 "anyOf" in "type"
      "anyOf": [
          { "type": "number" },
          { "type": "array", "items": { "type": "number" }, "minItems": 2, "maxItems": 4 }
        ]
    },
    "textureCenter": {
      "description": "An offset value that is subtracted from all retrieved texture values before being scaled by the textureScale value. Must be either 1 dimensional (applied to all dimensions of returned texture values) or match the dimensionality of the texture referenced by this ommatidialProperty (i.e. an RGB image can have a texture scale that is a singular number or a 3D vector of 3 numbers).",
      // 这里一样
      "anyOf": [
          { "type": "number" },
          { "type": "array", "items": { "type": "number" }, "minItems": 2, "maxItems": 4 }
      ]
    }
  }
},

node_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "node.schema.json",
    "title": "Node",
    "type": "object",
    "description": "A node in the node hierarchy.  When the node contains `skin`, all `mesh.primitives` **MUST** contain `JOINTS_0` and `WEIGHTS_0` attributes.  A node **MAY** have either a `matrix` or any combination of `translation`/`rotation`/`scale` (TRS) properties. TRS properties are converted to matrices and postmultiplied in the `T * R * S` order to compose the transformation matrix; first the scale is applied to the vertices, then the rotation, and then the translation. If none are provided, the transform is the identity. When a node is targeted for animation (referenced by an animation.channel.target), `matrix` **MUST NOT** be present.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "camera": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the camera referenced by this node."
        },
        "children": {
            "type": "array",
            "description": "The indices of this node's children.",
            "items": {
                "$ref": "glTFid.schema.json"
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "skin": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the skin referenced by this node.",
            // "The index of the skin referenced by this node. When a skin is referenced by a node within a scene, all joints used by the skin **MUST** belong to the same scene. When defined, `mesh` **MUST** also be defined."
        },
        "matrix": {
            "type": "array",
            "description": "A floating-point 4x4 transformation matrix stored in column-major order.",
            "items": {
                "type": "number"
            },
            "minItems": 16,
            "maxItems": 16,
            "default": [ 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0 ],
            // "`uniformMatrix4fv()` with the transpose parameter equal to false"
        },
        "mesh": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the mesh in this node."
        },
        "rotation": {
            "type": "array",
            "description": "The node's unit quaternion rotation in the order (x, y, z, w), where w is the scalar.",
            "items": {
                "type": "number",
                "minimum": -1.0,
                "maximum": 1.0
            },
            "minItems": 4,
            "maxItems": 4,
            "default": [ 0.0, 0.0, 0.0, 1.0 ]
        },
        "scale": {
            "type": "array",
            "description": "The node's non-uniform scale, given as the scaling factors along the x, y, and z axes.",
            "items": {
                "type": "number"
            },
            "minItems": 3,
            "maxItems": 3,
            "default": [ 1.0, 1.0, 1.0 ]
        },
        "translation": {
            "type": "array",
            "description": "The node's translation along the x, y, and z axes.",
            "items": {
                "type": "number"
            },
            "minItems": 3,
            "maxItems": 3,
            "default": [ 0.0, 0.0, 0.0 ]
        },
        "weights": {
            "type": "array",
            "description": "The weights of the instantiated morph target. The number of array elements **MUST** match the number of morph targets of the referenced mesh. When defined, `mesh` **MUST** also be defined.",
            "minItems": 1,
            "items": {
                "type": "number"
            }
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "dependencies": {
        "weights": [ "mesh" ],
        "skin": [ "mesh" ]
    },
    "not": {
        "anyOf": [
            { "required": [ "matrix", "translation" ] },
            { "required": [ "matrix", "rotation" ] },
            { "required": [ "matrix", "scale" ] }
        ]
    }
},

node_OCES_eyes_schema = {
    //!! 这个schema是用在node下extensions中的OCES_eyes模块的
    //!! enabled属性并没出现啊？
    //!! 应该有referenced 的 eye 的对应id, 加上
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "node.OCES_eyes.schema.json",
  "title": "OCES_eyes glTF Node Extension, allowing the addition of heads and eyes to a glTF model",
  //: "Extends the glTF node with the ability to (exclusively) link to head or eye objects. Also controls enabled/disabled state.",
  "type": "object",
  "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
  "oneOf": [
    //!!需要在properties下
      {"head": 
      //!! head不需要glTF id吗？
          {
              "description": "Defines where or not this node is a head (in practice, this will always be 'true' if present).",
              "type": "boolean"
          }
      },
      {"eye": 
          {
              "description": "An indexed reference to an eye to associate to this node.",
              "allOf":[{"$ref": "glTFid.schema.json"}]
          }
      }
    ],//!oneOf should not be put into properties
  "properties": {
    "enabled": {
      "description": "Whether the specified head or eye is enabled or not.",
      "type": "boolean",
      "default": true
    },
    //!!
    "extensions": {},
    "extras": {}
  }
},

accessor_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "accessor.schema.json",
    "title": "Accessor",
    "type": "object",
    "description": "A typed view into a buffer view that contains raw binary data.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "bufferView": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the bufferView.",
            //// "The index of the buffer view. When undefined, the accessor **MUST** be initialized with zeros; `sparse` property or extensions **MAY** override zeros with actual values."
        },
        "byteOffset": {
            "type": "integer",
            "description": "The offset relative to the start of the buffer view in bytes.",
            "minimum": 0,
            "default": 0,
            //// "The offset relative to the start of the buffer view in bytes.  This **MUST** be a multiple of the size of the component datatype. This property **MUST NOT** be defined when `bufferView` is undefined.",
            // "`vertexAttribPointer()` offset parameter"
        },
        "componentType": {
            "description": "The datatype of the accessor's components.",
            //// "The datatype of the accessor's components.  UNSIGNED_INT type **MUST NOT** be used for any accessor that is not referenced by `mesh.primitive.indices`.",
            // "`type` parameter of `vertexAttribPointer()`.  The corresponding typed arrays are `Int8Array`, `Uint8Array`, `Int16Array`, `Uint16Array`, `Uint32Array`, and `Float32Array`.",
            "anyOf": [
                {
                    "const": 5120,
                    "description": "BYTE",
                    "type": "integer"
                },
                {
                    "const": 5121,
                    "description": "UNSIGNED_BYTE",
                    "type": "integer"
                },
                {
                    "const": 5122,
                    "description": "SHORT",
                    "type": "integer"
                },
                {
                    "const": 5123,
                    "description": "UNSIGNED_SHORT",
                    "type": "integer"
                },
                {
                    "const": 5125,
                    "description": "UNSIGNED_INT",
                    "type": "integer"
                },
                {
                    "const": 5126,
                    "description": "FLOAT",
                    "type": "integer"
                },
                {
                    "type": "integer"
                }
            ]
        },
        "normalized": {
            "type": "boolean",
            "description": "Specifies whether integer data values are normalized before usage.",
            "default": false,
            // "Specifies whether integer data values are normalized (`true`) to [0, 1] (for unsigned types) or to [-1, 1] (for signed types) when they are accessed. This property **MUST NOT** be set to `true` for accessors with `FLOAT` or `UNSIGNED_INT` component type.",
            // "`normalized` parameter of `vertexAttribPointer()` "
        },
        "count": {
            "type": "integer",
            "description": "The number of elements referenced by this accessor.",
            "minimum": 1,
            // "The number of elements referenced by this accessor, not to be confused with the number of bytes or number of components."
        },
        "type": {
            "description": "Specifies if the accessor's elements are scalars, vectors, or matrices.",
            "anyOf": [
                {
                    "const": "SCALAR"
                },
                {
                    "const": "VEC2"
                },
                {
                    "const": "VEC3"
                },
                {
                    "const": "VEC4"
                },
                {
                    "const": "MAT2"
                },
                {
                    "const": "MAT3"
                },
                {
                    "const": "MAT4"
                },
                {
                    "type": "string"
                }
            ]
        },
        "max": {
            "type": "array",
            "description": "Maximum value of each component in this accessor.",
            "items": {
                "type": "number"
            },
            "minItems": 1,
            "maxItems": 16,
            // "Maximum value of each component in this accessor.  Array elements **MUST** be treated as having the same data type as accessor's `componentType`. Both `min` and `max` arrays have the same length.  The length is determined by the value of the `type` property; it can be 1, 2, 3, 4, 9, or 16.\n\n`normalized` property has no effect on array values: they always correspond to the actual values stored in the buffer. When the accessor is sparse, this property **MUST** contain maximum values of accessor data with sparse substitution applied."
        },
        "min": {
            "type": "array",
            "description": "Minimum value of each component in this accessor.",
            "items": {
                "type": "number"
            },
            "minItems": 1,
            "maxItems": 16,
            // "Minimum value of each component in this accessor.  Array elements **MUST** be treated as having the same data type as accessor's `componentType`. Both `min` and `max` arrays have the same length.  The length is determined by the value of the `type` property; it can be 1, 2, 3, 4, 9, or 16.\n\n`normalized` property has no effect on array values: they always correspond to the actual values stored in the buffer. When the accessor is sparse, this property **MUST** contain minimum values of accessor data with sparse substitution applied."
        },
        "sparse": {
            "allOf": [ { "$ref": "accessor.sparse.schema.json" } ],
            "description": "Sparse storage of elements that deviate from their initialization value."
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "dependencies": {
        "byteOffset": [ "bufferView" ]
    },
    "required": [ "componentType", "count", "type" ]
}
, 
accessor_sparse_indices_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "accessor.sparse.indices.schema.json",
    "title": "Accessor Sparse Indices",
    "type": "object",
    "description": "An object pointing to a buffer view containing the indices of deviating accessor values. The number of indices is equal to `accessor.sparse.count`. Indices **MUST** strictly increase.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "bufferView": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the buffer view with sparse indices. The referenced buffer view **MUST NOT** have its `target` or `byteStride` properties defined. The buffer view and the optional `byteOffset` **MUST** be aligned to the `componentType` byte length."
        },
        "byteOffset": {
            "type": "integer",
            "description": "The offset relative to the start of the buffer view in bytes.",
            "minimum": 0,
            "default": 0
        },
        "componentType": {
            "description": "The indices data type.",
            "anyOf": [
                {
                    "const": 5121,
                    "description": "UNSIGNED_BYTE",
                    "type": "integer"
                },
                {
                    "const": 5123,
                    "description": "UNSIGNED_SHORT",
                    "type": "integer"
                },
                {
                    "const": 5125,
                    "description": "UNSIGNED_INT",
                    "type": "integer"
                },
                {
                    "type": "integer"
                }
            ]
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "bufferView", "componentType" ]
}
, 
accessor_sparse_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "accessor.sparse.schema.json",
    "title": "Accessor Sparse",
    "type": "object",
    "description": "Sparse storage of accessor values that deviate from their initialization value.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "count": {
            "type": "integer",
            "description": "Number of deviating accessor values stored in the sparse array.",
            "minimum": 1
        },
        "indices": {
            "allOf": [ { "$ref": "accessor.sparse.indices.schema.json" } ],
            "description": "An object pointing to a buffer view containing the indices of deviating accessor values. The number of indices is equal to `count`. Indices **MUST** strictly increase."
        },
        "values": {
            "allOf": [ { "$ref": "accessor.sparse.values.schema.json" } ],
            "description": "An object pointing to a buffer view containing the deviating accessor values."
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "count", "indices", "values" ]
}
, 
accessor_sparse_values_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "accessor.sparse.values.schema.json",
    "title": "Accessor Sparse Values",
    "type": "object",
    "description": "An object pointing to a buffer view containing the deviating accessor values. The number of elements is equal to `accessor.sparse.count` times number of components. The elements have the same component type as the base accessor. The elements are tightly packed. Data **MUST** be aligned following the same rules as the base accessor.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "bufferView": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the bufferView with sparse values. The referenced buffer view **MUST NOT** have its `target` or `byteStride` properties defined."
        },
        "byteOffset": {
            "type": "integer",
            "description": "The offset relative to the start of the bufferView in bytes.",
            "minimum": 0,
            "default": 0
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "bufferView" ]
}
, 
animation_channel_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "animation.channel.schema.json",
    "title": "Animation Channel",
    "type": "object",
    "description": "An animation channel combines an animation sampler with a target property being animated.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "sampler": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of a sampler in this animation used to compute the value for the target.",
            // "The index of a sampler in this animation used to compute the value for the target, e.g., a node's translation, rotation, or scale (TRS)."
        },
        "target": {
            "allOf": [ { "$ref": "animation.channel.target.schema.json" } ],
            "description": "The descriptor of the animated property."
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "sampler", "target" ]
}
, 
animation_channel_target_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "animation.channel.target.schema.json",
    "title": "Animation Channel Target",
    "type": "object",
    "description": "The descriptor of the animated property.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "node": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the node to animate. When undefined, the animated object **MAY** be defined by an extension."
        },
        "path": {
            "description": "The name of the node's TRS property to animate, or the `\"weights\"` of the Morph Targets it instantiates. For the `\"translation\"` property, the values that are provided by the sampler are the translation along the X, Y, and Z axes. For the `\"rotation\"` property, the values are a quaternion in the order (x, y, z, w), where w is the scalar. For the `\"scale\"` property, the values are the scaling factors along the X, Y, and Z axes.",
            "anyOf": [
                {
                    "const": "translation"
                },
                {
                    "const": "rotation"
                },
                {
                    "const": "scale"
                },
                {
                    "const": "weights"
                },
                {
                    "type": "string"
                }
            ]
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "path" ]
}
, 
animation_sampler_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "animation.sampler.schema.json",
    "title": "Animation Sampler",
    "type": "object",
    "description": "An animation sampler combines timestamps with a sequence of output values and defines an interpolation algorithm.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "input": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of an accessor containing keyframe timestamps.",
            // "The index of an accessor containing keyframe timestamps. The accessor **MUST** be of scalar type with floating-point components. The values represent time in seconds with `time[0] >= 0.0`, and strictly increasing values, i.e., `time[n + 1] > time[n]`."
        },
        "interpolation": {
            "description": "Interpolation algorithm.",
            "default": "LINEAR",
            // "Interpolation algorithm.",
            "anyOf": [
                {
                    "const": "LINEAR",
                    "description": "The animated values are linearly interpolated between keyframes. When targeting a rotation, spherical linear interpolation (slerp) **SHOULD** be used to interpolate quaternions. The number of output elements **MUST** equal the number of input elements."
                },
                {
                    "const": "STEP",
                    "description": "The animated values remain constant to the output of the first keyframe, until the next keyframe. The number of output elements **MUST** equal the number of input elements."
                },
                {
                    "const": "CUBICSPLINE",
                    "description": "The animation's interpolation is computed using a cubic spline with specified tangents. The number of output elements **MUST** equal three times the number of input elements. For each input element, the output stores three elements, an in-tangent, a spline vertex, and an out-tangent. There **MUST** be at least two keyframes when using this interpolation."
                },
                {
                    "type": "string"
                }
            ]
        },
        "output": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of an accessor, containing keyframe output values."
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "input", "output" ]
}
, 
animation_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "animation.schema.json",
    "title": "Animation",
    "type": "object",
    "description": "A keyframe animation.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "channels": {
            "type": "array",
            "description": "An array of animation channels. An animation channel combines an animation sampler with a target property being animated. Different channels of the same animation **MUST NOT** have the same targets.",
            "items": {
                "$ref": "animation.channel.schema.json"
            },
            "minItems": 1
        },
        "samplers": {
            "type": "array",
            "description": "An array of animation samplers. An animation sampler combines timestamps with a sequence of output values and defines an interpolation algorithm.",
            "items": {
                "$ref": "animation.sampler.schema.json"
            },
            "minItems": 1
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "required": [ "channels", "samplers" ]
}
, 
asset_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "asset.schema.json",
    "title": "Asset",
    "type": "object",
    "description": "Metadata about the glTF asset.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "copyright": {
            "type": "string",
            "description": "A copyright message suitable for display to credit the content creator."
        },
        "generator": {
            "type": "string",
            "description": "Tool that generated this glTF model.  Useful for debugging."
        },
        "version": {
            "type": "string",
            "description": "The glTF version in the form of `<major>.<minor>` that this asset targets.",
            "pattern": "^[0-9]+\\.[0-9]+$"
        },
        "minVersion": {
            "type": "string",
            "description": "The minimum glTF version in the form of `<major>.<minor>` that this asset targets. This property **MUST NOT** be greater than the asset version.",
            "pattern": "^[0-9]+\\.[0-9]+$"
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "version" ]
}
, 
buffer_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "buffer.schema.json",
    "title": "Buffer",
    "type": "object",
    "description": "A buffer points to binary geometry, animation, or skins.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "uri": {
            "type": "string",
            "description": "The URI (or IRI) of the buffer.",
            //"format": "iri-reference",
            // "The URI (or IRI) of the buffer.  Relative paths are relative to the current glTF asset.  Instead of referencing an external file, this field **MAY** contain a `data:`-URI.",
            //"gltf_uriType": "application"
        },
        "byteLength": {
            "type": "integer",
            "description": "The length of the buffer in bytes.",
            "minimum": 1
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "required": [ "byteLength" ]
}
, 
bufferView_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "bufferView.schema.json",
    "title": "Buffer View",
    "type": "object",
    "description": "A view into a buffer generally representing a subset of the buffer.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "buffer": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the buffer."
        },
        "byteOffset": {
            "type": "integer",
            "description": "The offset into the buffer in bytes.",
            "minimum": 0,
            "default": 0
        },
        "byteLength": {
            "type": "integer",
            "description": "The length of the bufferView in bytes.",
            "minimum": 1
        },
        "byteStride": {
            "type": "integer",
            "description": "The stride, in bytes.",
            "minimum": 4,
            "maximum": 252,
            "multipleOf": 4,
            // "The stride, in bytes, between vertex attributes.  When this is not defined, data is tightly packed. When two or more accessors use the same buffer view, this field **MUST** be defined.",
            // "`vertexAttribPointer()` stride parameter"
        },
        "target": {
            "description": "The hint representing the intended GPU buffer type to use with this buffer view.",
            // "`bindBuffer()`",
            "anyOf": [
                {
                    "const": 34962,
                    "description": "ARRAY_BUFFER",
                    "type": "integer"
                },
                {
                    "const": 34963,
                    "description": "ELEMENT_ARRAY_BUFFER",
                    "type": "integer"
                },
                {
                    "type": "integer"
                }
            ]
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "required": [ "buffer", "byteLength" ]
}
, 
camera_orthographic_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "camera.orthographic.schema.json",
    "title": "Camera Orthographic",
    "type": "object",
    "description": "An orthographic camera containing properties to create an orthographic projection matrix.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "xmag": {
            "type": "number",
            "description": "The floating-point horizontal magnification of the view. This value **MUST NOT** be equal to zero. This value **SHOULD NOT** be negative."
        },
        "ymag": {
            "type": "number",
            "description": "The floating-point vertical magnification of the view. This value **MUST NOT** be equal to zero. This value **SHOULD NOT** be negative."
        },
        "zfar": {
            "type": "number",
            "description": "The floating-point distance to the far clipping plane. This value **MUST NOT** be equal to zero. `zfar` **MUST** be greater than `znear`.",
            "exclusiveMinimum": 0.0
        },
        "znear": {
            "type": "number",
            "description": "The floating-point distance to the near clipping plane.",
            "minimum": 0.0
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "xmag", "ymag", "zfar", "znear" ]
}
, 
camera_perspective_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "camera.perspective.schema.json",
    "title": "Camera Perspective",
    "type": "object",
    "description": "A perspective camera containing properties to create a perspective projection matrix.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "aspectRatio": {
            "type": "number",
            "description": "The floating-point aspect ratio of the field of view.",
            "exclusiveMinimum": 0.0,
            // "The floating-point aspect ratio of the field of view. When undefined, the aspect ratio of the rendering viewport **MUST** be used."
        },
        "yfov": {
            "type": "number",
            "description": "The floating-point vertical field of view in radians. This value **SHOULD** be less than π.",
            "exclusiveMinimum": 0.0
        },
        "zfar": {
            "type": "number",
            "description": "The floating-point distance to the far clipping plane.",
            "exclusiveMinimum": 0.0,
            // "The floating-point distance to the far clipping plane. When defined, `zfar` **MUST** be greater than `znear`. If `zfar` is undefined, client implementations **SHOULD** use infinite projection matrix."
        },
        "znear": {
            "type": "number",
            "description": "The floating-point distance to the near clipping plane.",
            "exclusiveMinimum": 0.0,
            // "The floating-point distance to the near clipping plane."
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "yfov", "znear" ]
}
, 
camera_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "camera.schema.json",
    "title": "Camera",
    "type": "object",
    "description": "A camera's projection.  A node **MAY** reference a camera to apply a transform to place the camera in the scene.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "orthographic": {
            "allOf": [ { "$ref": "camera.orthographic.schema.json" } ],
            "description": "An orthographic camera containing properties to create an orthographic projection matrix. This property **MUST NOT** be defined when `perspective` is defined."
        },
        "perspective": {
            "allOf": [ { "$ref": "camera.perspective.schema.json" } ],
            "description": "A perspective camera containing properties to create a perspective projection matrix. This property **MUST NOT** be defined when `orthographic` is defined."
        },
        "type": {
            "description": "Specifies if the camera uses a perspective or orthographic projection.",
            // "Specifies if the camera uses a perspective or orthographic projection.  Based on this, either the camera's `perspective` or `orthographic` property **MUST** be defined.",
            "anyOf": [
                {
                    "const": "perspective"
                },
                {
                    "const": "orthographic"
                },
                {
                    "type": "string"
                }
            ]
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "required": [ "type" ],
    "not": {
        "required": [ "perspective", "orthographic" ]
    }
}
, 
extension_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "extension.schema.json",
    "title": "Extension",
    "type": "object",
    "description": "JSON object with extension-specific objects.",
    "properties": {
    },
    "additionalProperties": {
        "type": "object"
    }
}
, 
extras_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "extras.schema.json",
    "title": "Extras",
    "description": "Application-specific data."
    //"gltf_sectionDescription": "Although `extras` **MAY** have any type, it is common for applications to store and access custom data as key/value pairs. Therefore, `extras` **SHOULD** be a JSON object rather than a primitive value for best portability."
}
, 
glTF_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "glTF.schema.json",
    "title": "glTF",
    "type": "object",
    "description": "The root object for a glTF asset.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "extensionsUsed": {
            "type": "array",
            "description": "Names of glTF extensions used in this asset.",
            "items": {
                "type": "string"
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "extensionsRequired": {
            "type": "array",
            "description": "Names of glTF extensions required to properly load this asset.",
            "items": {
                "type": "string"
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "accessors": {
            "type": "array",
            "description": "An array of accessors.",
            "items": {
                "$ref": "accessor.schema.json"
            },
            "minItems": 1,
            // "An array of accessors.  An accessor is a typed view into a bufferView."
        },
        "animations": {
            "type": "array",
            "description": "An array of keyframe animations.",
            "items": {
                "$ref": "animation.schema.json"
            },
            "minItems": 1
        },
        "asset": {
            "allOf": [ { "$ref": "asset.schema.json" } ],
            "description": "Metadata about the glTF asset."
        },
        "buffers": {
            "type": "array",
            "description": "An array of buffers.",
            "items": {
                "$ref": "buffer.schema.json"
            },
            "minItems": 1,
            // "An array of buffers.  A buffer points to binary geometry, animation, or skins."
        },
        "bufferViews": {
            "type": "array",
            "description": "An array of bufferViews.",
            "items": {
                "$ref": "bufferView.schema.json"
            },
            "minItems": 1,
            // "An array of bufferViews.  A bufferView is a view into a buffer generally representing a subset of the buffer."
        },
        "cameras": {
            "type": "array",
            "description": "An array of cameras.",
            "items": {
                "$ref": "camera.schema.json"
            },
            "minItems": 1,
            // "An array of cameras.  A camera defines a projection matrix."
        },
        "images": {
            "type": "array",
            "description": "An array of images.",
            "items": {
                "$ref": "image.schema.json"
            },
            "minItems": 1,
            // "An array of images.  An image defines data used to create a texture."
        },
        "materials": {
            "type": "array",
            "description": "An array of materials.",
            "items": {
                "$ref": "material.schema.json"
            },
            "minItems": 1,
            // "An array of materials.  A material defines the appearance of a primitive."
        },
        "meshes": {
            "type": "array",
            "description": "An array of meshes.",
            "items": {
                "$ref": "mesh.schema.json"
            },
            "minItems": 1,
            // "An array of meshes.  A mesh is a set of primitives to be rendered."
        },
        "nodes": {
            "type": "array",
            "description": "An array of nodes.",
            "items": {
                "$ref": "node.schema.json"
            },
            "minItems": 1
        },
        "samplers": {
            "type": "array",
            "description": "An array of samplers.",
            "items": {
                "$ref": "sampler.schema.json"
            },
            "minItems": 1,
            // "An array of samplers.  A sampler contains properties for texture filtering and wrapping modes."
        },
        "scene": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the default scene.",
            // "The index of the default scene.  This property **MUST NOT** be defined, when `scenes` is undefined."
        },
        "scenes": {
            "type": "array",
            "description": "An array of scenes.",
            "items": {
                "$ref": "scene.schema.json"
            },
            "minItems": 1
        },
        "skins": {
            "type": "array",
            "description": "An array of skins.",
            "items": {
                "$ref": "skin.schema.json"
            },
            "minItems": 1,
            // "An array of skins.  A skin is defined by joints and matrices."
        },
        "textures": {
            "type": "array",
            "description": "An array of textures.",
            "items": {
                "$ref": "texture.schema.json"
            },
            "minItems": 1
        },
        "extensions": { 
            // changed 入点
            "type": "object",
            "properties": {
                "OCES_eyes": {
                    "$ref": "glTF.OCES_eyes.schema.json"
                }
            }
        },
        "extras": { }
    },
    "dependencies": {
        "scene": [ "scenes" ]
    },
    "required": [ "asset" ]
}
, 
glTFChildOfRootProperty_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "glTFChildOfRootProperty.schema.json",
    "title": "glTF Child of Root Property",
    "type": "object",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "name": {
            "type": "string",
            "description": "The user-defined name of this object."
            // "The user-defined name of this object.  This is not necessarily unique, e.g., an accessor and a buffer could have the same name, or two accessors could even have the same name."
        }
    }
}
, 
glTFid_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "glTFid.schema.json",
    "title": "glTF Id",
    "type": "integer",
    "minimum": 0
}
, 
glTFProperty_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "glTFProperty.schema.json",
    "title": "glTF Property",
    "type": "object",
    "properties": {
        "extensions": {
            "$ref": "extension.schema.json"
        },
        "extras": {
            "$ref": "extras.schema.json"
        }
    }
}
, 
image_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "image.schema.json",
    "title": "Image",
    "type": "object",
    "description": "Image data used to create a texture. Image **MAY** be referenced by an URI (or IRI) or a buffer view index.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "uri": {
            "type": "string",
            "description": "The URI (or IRI) of the image.",
            // TODO
            //"format": "iri-reference",
            // "The URI (or IRI) of the image.  Relative paths are relative to the current glTF asset.  Instead of referencing an external file, this field **MAY** contain a `data:`-URI. This field **MUST NOT** be defined when `bufferView` is defined.",
            //"gltf_uriType": "image"
        },
        "mimeType": {
            "anyOf": [
                {
                    "const": "image/jpeg"
                },
                {
                    "const": "image/png"
                },
                {
                    "type": "string"
                }
            ],
            "description": "The image's media type. This field **MUST** be defined when `bufferView` is defined."
        },
        "bufferView": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the bufferView that contains the image. This field **MUST NOT** be defined when `uri` is defined."
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "dependencies": {
        "bufferView": [ "mimeType" ]
    },
    "oneOf": [
        { "required": [ "uri" ] },
        { "required": [ "bufferView" ] }
    ]
}
, 
material_normalTextureInfo_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "material.normalTextureInfo.schema.json",
    "title": "Material Normal Texture Info",
    "type": "object",
    "allOf": [ { "$ref": "textureInfo.schema.json" } ],
    "properties": {
        "index": { },
        "texCoord": { },
        "scale": {
            "type": "number",
            "description": "The scalar parameter applied to each normal vector of the normal texture.",
            "default": 1.0,
            // "The scalar parameter applied to each normal vector of the texture. This value scales the normal vector in X and Y directions using the formula: `scaledNormal =  normalize((<sampled normal texture value> * 2.0 - 1.0) * vec3(<normal scale>, <normal scale>, 1.0))`."
        },
        "extensions": { },
        "extras": { }
    }
}, 
material_occlusionTextureInfo_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "material.occlusionTextureInfo.schema.json",
    "title": "Material Occlusion Texture Info",
    "type": "object",
    "allOf": [ { "$ref": "textureInfo.schema.json" } ],
    "properties": {
        "index": { },
        "texCoord": { },
        "strength": {
            "type": "number",
            "description": "A scalar multiplier controlling the amount of occlusion applied.",
            "default": 1.0,
            "minimum": 0.0,
            "maximum": 1.0,
            // "A scalar parameter controlling the amount of occlusion applied. A value of `0.0` means no occlusion. A value of `1.0` means full occlusion. This value affects the final occlusion value as: `1.0 + strength * (<sampled occlusion texture value> - 1.0)`."
        },
        "extensions": { },
        "extras": { }
    }
}, 
material_pbrMetallicRoughness_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "material.pbrMetallicRoughness.schema.json",
    "title": "Material PBR Metallic Roughness",
    "type": "object",
    "description": "A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "baseColorFactor": {
            "type": "array",
            "items": {
                "type": "number",
                "minimum": 0.0,
                "maximum": 1.0
            },
            "description": "The factors for the base color of the material.",
            "default": [ 1.0, 1.0, 1.0, 1.0 ],
            "minItems": 4,
            "maxItems": 4,
            // "The factors for the base color of the material. This value defines linear multipliers for the sampled texels of the base color texture."
        },
        "baseColorTexture": {
            "allOf": [ { "$ref": "textureInfo.schema.json" } ],
            "description": "The base color texture.",
            // "The base color texture. The first three components (RGB) **MUST** be encoded with the sRGB transfer function. They specify the base color of the material. If the fourth component (A) is present, it represents the linear alpha coverage of the material. Otherwise, the alpha coverage is equal to `1.0`. The `material.alphaMode` property specifies how alpha is interpreted. The stored texels **MUST NOT** be premultiplied. When undefined, the texture **MUST** be sampled as having `1.0` in all components."
        },
        "metallicFactor": {
            "type": "number",
            "description": "The factor for the metalness of the material.",
            "default": 1.0,
            "minimum": 0.0,
            "maximum": 1.0,
            // "The factor for the metalness of the material. This value defines a linear multiplier for the sampled metalness values of the metallic-roughness texture."
        },
        "roughnessFactor": {
            "type": "number",
            "description": "The factor for the roughness of the material.",
            "default": 1.0,
            "minimum": 0.0,
            "maximum": 1.0,
            // "The factor for the roughness of the material. This value defines a linear multiplier for the sampled roughness values of the metallic-roughness texture."
        },
        "metallicRoughnessTexture": {
            "allOf": [ { "$ref": "textureInfo.schema.json" } ],
            "description": "The metallic-roughness texture.",
            // "The metallic-roughness texture. The metalness values are sampled from the B channel. The roughness values are sampled from the G channel. These values **MUST** be encoded with a linear transfer function. If other channels are present (R or A), they **MUST** be ignored for metallic-roughness calculations. When undefined, the texture **MUST** be sampled as having `1.0` in G and B components."
        },
        "extensions": { },
        "extras": { }
    }
}, 
material_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "material.schema.json",
    "title": "Material",
    "type": "object",
    "description": "The material appearance of a primitive.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "name": { },
        "extensions": { },
        "extras": { },
        "pbrMetallicRoughness": {
            "allOf": [ { "$ref": "material.pbrMetallicRoughness.schema.json" } ],
            "description": "A set of parameter values that are used to define the metallic-roughness material model from Physically Based Rendering (PBR) methodology. When undefined, all the default values of `pbrMetallicRoughness` **MUST** apply."
        },
        "normalTexture": {
            "allOf": [ { "$ref": "material.normalTextureInfo.schema.json" } ],
            "description": "The tangent space normal texture.",
            // "The tangent space normal texture. The texture encodes RGB components with linear transfer function. Each texel represents the XYZ components of a normal vector in tangent space. The normal vectors use the convention +X is right and +Y is up. +Z points toward the viewer. If a fourth component (A) is present, it **MUST** be ignored. When undefined, the material does not have a tangent space normal texture."
        },
        "occlusionTexture": {
            "allOf": [ { "$ref": "material.occlusionTextureInfo.schema.json" } ],
            "description": "The occlusion texture.",
            // "The occlusion texture. The occlusion values are linearly sampled from the R channel. Higher values indicate areas that receive full indirect lighting and lower values indicate no indirect lighting. If other channels are present (GBA), they **MUST** be ignored for occlusion calculations. When undefined, the material does not have an occlusion texture."
        },
        "emissiveTexture": {
            "allOf": [ { "$ref": "textureInfo.schema.json" } ],
            "description": "The emissive texture.",
            // "The emissive texture. It controls the color and intensity of the light being emitted by the material. This texture contains RGB components encoded with the sRGB transfer function. If a fourth component (A) is present, it **MUST** be ignored. When undefined, the texture **MUST** be sampled as having `1.0` in RGB components."
        },
        "emissiveFactor": {
            "type": "array",
            "items": {
                "type": "number",
                "minimum": 0.0,
                "maximum": 1.0
            },
            "minItems": 3,
            "maxItems": 3,
            "default": [ 0.0, 0.0, 0.0 ],
            "description": "The factors for the emissive color of the material.",
            // "The factors for the emissive color of the material. This value defines linear multipliers for the sampled texels of the emissive texture."
        },
        "alphaMode": {
            "default": "OPAQUE",
            "description": "The alpha rendering mode of the material.",
            // "The material's alpha rendering mode enumeration specifying the interpretation of the alpha value of the base color.",
            "anyOf": [
                {
                    "const": "OPAQUE",
                    "description": "The alpha value is ignored, and the rendered output is fully opaque."
                },
                {
                    "const": "MASK",
                    "description": "The rendered output is either fully opaque or fully transparent depending on the alpha value and the specified `alphaCutoff` value; the exact appearance of the edges **MAY** be subject to implementation-specific techniques such as \"`Alpha-to-Coverage`\"."
                },
                {
                    "const": "BLEND",
                    "description": "The alpha value is used to composite the source and destination areas. The rendered output is combined with the background using the normal painting operation (i.e. the Porter and Duff over operator)."
                },
                {
                    "type": "string"
                }
            ]
        },
        "alphaCutoff": {
            "type": "number",
            "minimum": 0.0,
            "default": 0.5,
            "description": "The alpha cutoff value of the material.",
            // "Specifies the cutoff threshold when in `MASK` alpha mode. If the alpha value is greater than or equal to this value then it is rendered as fully opaque, otherwise, it is rendered as fully transparent. A value greater than `1.0` will render the entire material as fully transparent. This value **MUST** be ignored for other alpha modes. When `alphaMode` is not defined, this value **MUST NOT** be defined."
        },
        "doubleSided": {
            "type": "boolean",
            "default": false,
            "description": "Specifies whether the material is double sided.",
            // "Specifies whether the material is double sided. When this value is false, back-face culling is enabled. When this value is true, back-face culling is disabled and double-sided lighting is enabled. The back-face **MUST** have its normals reversed before the lighting equation is evaluated."
        }
    },
     "dependencies" : {
        "alphaCutoff" : ["alphaMode"]
    }
}
, 
mesh_primitive_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "mesh.primitive.schema.json",
    "title": "Mesh Primitive",
    "type": "object",
    "description": "Geometry to be rendered with the given material.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "attributes": {
            "type": "object",
            "description": "A plain JSON object, where each key corresponds to a mesh attribute semantic and each value is the index of the accessor containing attribute's data.",
            "minProperties": 1,
            "additionalProperties": {
                "$ref": "glTFid.schema.json"
            }
        },
        "indices": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the accessor that contains the vertex indices.",
            // "The index of the accessor that contains the vertex indices.  When this is undefined, the primitive defines non-indexed geometry.  When defined, the accessor **MUST** have `SCALAR` type and an unsigned integer component type.",
            // "`drawElements()` when defined and `drawArrays()` otherwise."
        },
        "material": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the material to apply to this primitive when rendering."
        },
        "mode": {
            "description": "The topology type of primitives to render.",
            "default": 4,
            "anyOf": [
                {
                    "const": 0,
                    "description": "POINTS",
                    "type": "integer"
                },
                {
                    "const": 1,
                    "description": "LINES",
                    "type": "integer"
                },
                {
                    "const": 2,
                    "description": "LINE_LOOP",
                    "type": "integer"
                },
                {
                    "const": 3,
                    "description": "LINE_STRIP",
                    "type": "integer"
                },
                {
                    "const": 4,
                    "description": "TRIANGLES",
                    "type": "integer"
                },
                {
                    "const": 5,
                    "description": "TRIANGLE_STRIP",
                    "type": "integer"
                },
                {
                    "const": 6,
                    "description": "TRIANGLE_FAN",
                    "type": "integer"
                },
                {
                    "type": "integer"
                }
            ]
        },
        "targets": {
            "type": "array",
            "description": "An array of morph targets.",
            "items": {
                "type": "object",
                "minProperties": 1,
                "additionalProperties": {
                    "$ref": "glTFid.schema.json"
                },
                "description": "A plain JSON object specifying attributes displacements in a morph target, where each key corresponds to one of the three supported attribute semantic (`POSITION`, `NORMAL`, or `TANGENT`) and each value is the index of the accessor containing the attribute displacements' data."
            },
            "minItems": 1
        },
        "extensions": { },
        "extras": { }
    },
    // "`drawElements()` and `drawArrays()`",
    "required": [ "attributes" ]
}
, 
mesh_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "mesh.schema.json",
    "title": "Mesh",
    "type": "object",
    "description": "A set of primitives to be rendered.  Its global transform is defined by a node that references it.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "primitives": {
            "type": "array",
            "description": "An array of primitives, each defining geometry to be rendered.",
            "items": {
                "$ref": "mesh.primitive.schema.json"
            },
            "minItems": 1
        },
        "weights": {
            "type": "array",
            "description": "Array of weights to be applied to the morph targets. The number of array elements **MUST** match the number of morph targets.",
            "items": {
                "type": "number"
            },
            "minItems": 1
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "required": [ "primitives" ]
}
, 
sampler_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "sampler.schema.json",
    "title": "Sampler",
    "type": "object",
    "description": "Texture sampler properties for filtering and wrapping modes.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "magFilter": {
            "description": "Magnification filter.",
            // "`samplerParameteri()` with pname equal to TEXTURE_MAG_FILTER",
            "anyOf": [
                {
                    "const": 9728,
                    "description": "NEAREST",
                    "type": "integer"
                },
                {
                    "const": 9729,
                    "description": "LINEAR",
                    "type": "integer"
                },
                {
                    "type": "integer"
                }
            ]
        },
        "minFilter": {
            "description": "Minification filter.",
            // "`samplerParameteri()` with pname equal to TEXTURE_MIN_FILTER",
            "anyOf": [
                {
                    "const": 9728,
                    "description": "NEAREST",
                    "type": "integer"
                },
                {
                    "const": 9729,
                    "description": "LINEAR",
                    "type": "integer"
                },
                {
                    "const": 9984,
                    "description": "NEAREST_MIPMAP_NEAREST",
                    "type": "integer"
                },
                {
                    "const": 9985,
                    "description": "LINEAR_MIPMAP_NEAREST",
                    "type": "integer"
                },
                {
                    "const": 9986,
                    "description": "NEAREST_MIPMAP_LINEAR",
                    "type": "integer"
                },
                {
                    "const": 9987,
                    "description": "LINEAR_MIPMAP_LINEAR",
                    "type": "integer"
                },
                {
                    "type": "integer"
                }
            ]
        },
        "wrapS": {
            "description": "S (U) wrapping mode.",
            "default": 10497,
            // "S (U) wrapping mode.  All valid values correspond to WebGL enums.",
            // "`samplerParameteri()` with pname equal to TEXTURE_WRAP_S",
            "anyOf": [
                {
                    "const": 33071,
                    "description": "CLAMP_TO_EDGE",
                    "type": "integer"
                },
                {
                    "const": 33648,
                    "description": "MIRRORED_REPEAT",
                    "type": "integer"
                },
                {
                    "const": 10497,
                    "description": "REPEAT",
                    "type": "integer"
                },
                {
                    "type": "integer"
                }
            ]
        },
        "wrapT": {
            "description": "T (V) wrapping mode.",
            "default": 10497,
            // "`samplerParameteri()` with pname equal to TEXTURE_WRAP_T",
            "anyOf": [
                {
                    "const": 33071,
                    "description": "CLAMP_TO_EDGE",
                    "type": "integer"
                },
                {
                    "const": 33648,
                    "description": "MIRRORED_REPEAT",
                    "type": "integer"
                },
                {
                    "const": 10497,
                    "description": "REPEAT",
                    "type": "integer"
                },
                {
                    "type": "integer"
                }
            ]
        },
        "name": { },
        "extensions": { },
        "extras": { }
    }
}
, 
scene_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "scene.schema.json",
    "title": "Scene",
    "type": "object",
    "description": "The root nodes of a scene.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "nodes": {
            "type": "array",
            "description": "The indices of each root node.",
            "items": {
                "$ref": "glTFid.schema.json"
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "name": { },
        "extensions": { },
        "extras": { }
    }
}
, 
skin_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "skin.schema.json",
    "title": "Skin",
    "type": "object",
    "description": "Joints and matrices defining a skin.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "inverseBindMatrices": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the accessor containing the floating-point 4x4 inverse-bind matrices.",
            // "The index of the accessor containing the floating-point 4x4 inverse-bind matrices. Its `accessor.count` property **MUST** be greater than or equal to the number of elements of the `joints` array. When undefined, each matrix is a 4x4 identity matrix."
        },
        "skeleton": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the node used as a skeleton root.",
            // "The index of the node used as a skeleton root. The node **MUST** be the closest common root of the joints hierarchy or a direct or indirect parent node of the closest common root."
        },
        "joints": {
            "type": "array",
            "description": "Indices of skeleton nodes, used as joints in this skin.",
            "items": {
                "$ref": "glTFid.schema.json"
            },
            "uniqueItems": true,
            "minItems": 1,
            // "Indices of skeleton nodes, used as joints in this skin."
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    "required": [ "joints" ]
}
,
texture_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "texture.schema.json",
    "title": "Texture",
    "type": "object",
    "description": "A texture and its sampler.",
    "allOf": [ { "$ref": "glTFChildOfRootProperty.schema.json" } ],
    "properties": {
        "sampler": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the sampler used by this texture. When undefined, a sampler with repeat wrapping and auto filtering **SHOULD** be used."
        },
        "source": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the image used by this texture. When undefined, an extension or other mechanism **SHOULD** supply an alternate texture source, otherwise behavior is undefined."
        },
        "name": { },
        "extensions": { },
        "extras": { }
    },
    // "`createTexture()`, `deleteTexture()`, `bindTexture()`, `texImage2D()`, and `texParameterf()`"
}
, 
textureInfo_schema= 
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "textureInfo.schema.json",
    "title": "Texture Info",
    "type": "object",
    "description": "Reference to a texture.",
    "allOf": [ { "$ref": "glTFProperty.schema.json" } ],
    "properties": {
        "index": {
            "allOf": [ { "$ref": "glTFid.schema.json" } ],
            "description": "The index of the texture."
        },
        "texCoord": {
            "type": "integer",
            "description": "The set index of texture's TEXCOORD attribute used for texture coordinate mapping.",
            "default": 0,
            "minimum": 0,
            // "This integer value is used to construct a string in the format `TEXCOORD_<set index>` which is a reference to a key in `mesh.primitives.attributes` (e.g. a value of `0` corresponds to `TEXCOORD_0`). A mesh primitive **MUST** have the corresponding texture coordinate attributes for the material to be applicable to it."
        },
        "extensions": { },
        "extras": { }
    },
    "required": [ "index" ]
};


//import Ajv library
const Ajv = window.ajv2020;
const ajv = new Ajv({
  schemas:[
    eye_point_ommatidial_schema,
    eye_schema,
    eye_shared_schema,
    eye_spherical_schema,
    eye_surface_schema,
    glTF_OCES_eyes_schema,
    mirrorPlane_schema,
    node_OCES_eyes_schema,
    ommatidialProperty_accessor_schema,
    ommatidialProperty_coarse_schema,
    ommatidialProperty_schema,
    ommatidialProperty_texture_schema,
    accessor_schema,
    accessor_sparse_indices_schema,
    accessor_sparse_schema,
    accessor_sparse_values_schema,
    animation_channel_schema,
    animation_channel_target_schema,
    animation_sampler_schema,
    animation_schema,
    asset_schema,
    buffer_schema, 
    bufferView_schema,
    camera_orthographic_schema, 
    camera_perspective_schema, 
    camera_schema, 
    extension_schema, 
    extras_schema, 
    glTF_schema, 
    glTFChildOfRootProperty_schema, 
    glTFid_schema, 
    glTFProperty_schema, 
    image_schema, 
    material_normalTextureInfo_schema, 
    material_occlusionTextureInfo_schema, 
    material_pbrMetallicRoughness_schema, 
    material_schema, 
    mesh_primitive_schema, 
    mesh_schema, 
    node_schema,  
    sampler_schema, 
    scene_schema, 
    skin_schema, 
    texture_schema, 
    textureInfo_schema, 
    ],
    allErrors: true})
    //TODO
ajv.addFormat('date-time', {
    type: 'string',
    validate: function(data) {
        // RFC3339 date-time 
        const rfc3339Regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/;
        return rfc3339Regex.test(data);
    }
});
ajv.addKeyword({
    keyword: "isImage",
    type: "string",
    // 要等待图像验证操作成功后返回验证结果，是个“异步”操作
    validate: async (schema, data) => {
      return new Promise((resolve, reject) => {
        // not image if data is not string type
        if (typeof data != 'string') {
          resolve(false);
        }
  
        const img = new Image();
        img.src = data; // check if data is valid image URL
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const isSingleChannel = width * height === data.length; // 1-channel validation
          const isThreeChannel = width * height * 3 === data.length; // 3-channel validation
          if (isSingleChannel || isThreeChannel) {
            resolve(true);
          } else {
            resolve(false);
          }
        };
        img.onerror = () => {
          resolve(false);
        }
      });
    },
    errors: true
});
const validate = ajv.getSchema("glTF.schema.json");
function readFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (!file) {
        document.getElementById('status').textContent = 'Please select file';
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var contents = event.target.result;
        try{
            const data = JSON.parse(contents);
            //validate files
            const valid = validate(data);
            if(!valid){
                console.log(validate.errors);
                document.getElementById('fileContent').textContent = 
                ajv.errorsText(validate.errors, {dataVar: "data", schemaVar: "schema", separator: '\n'});
                document.getElementById('scrollContainer').style.textAlign = 'left';
            } else {
                console.log("Valid CEM file!");
                document.getElementById('fileContent').textContent = "Valid CEM file!";
                document.getElementById('scrollContainer').style.textAlign = 'center';
            }
        } catch (error) {
            console.error("Failed parsing JSON", error);
        }
    };
    reader.readAsText(file);
}