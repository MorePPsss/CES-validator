// 定义 JSON Schema
const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "http://example.com/schemas/schema.json",
    "type": "object",
    "$async": true,
    "properties": {
      "ommatidialProperties": {
        "type": "object",
        "properties" : {
          "foo": {
            "description":"3D Vector",
            "type":"array",
            "items": {"type" : "number"},
            "minItems": 3,
            "maxItems": 3
          },
          "creationDatetime": {
            "description": "The date and time when the file was created.",
            "type": "string",
            "format": "date-time"
          },
          "testImage": {
            "allOf": [{"$ref":"https://example.com/testtt"}]
          }
        },
        "required": ["foo"]
      }
    }
};

const test_schema = {
  "$id": "https://example.com/testtt",
  "description": "To test custom keyword isImage.",
  "type": "string",
  "isImage": true
};

// create Ajv instance
const Ajv = window.ajv2020;
const ajv = new Ajv({schemas:{
    schema,test_schema
}});
ajv.addFormat('date-time', {
  type: 'string',
  validate: function(data) {
    // RFC3339 date-time regular expression
    const rfc3339Regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/;
    return rfc3339Regex.test(data);
  }
});
ajv.addKeyword({
  keyword: "alwaysFalse",
  // 校验函数，始终返回 false，使得数据无法通过验证
  validate: function (schema, data) {
    return false;
  },
  errors: true
});
ajv.addKeyword({
  keyword: "isImage",
  type: "string",
  schemaType: "boolean",
  async: true,
  validate: checkImage,
  errors: true
});
async function checkImage(schema, data) {
  if (typeof data !== 'string') {
    return false;
  }
  const res = await processImage(data);
  return res;
};
async function processImage(data) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = data;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let isMonochrome = true;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        if (r !== g || g !== b) {
          isMonochrome = false;
          break;
        }
      }
      console.log(isMonochrome);
      resolve(isMonochrome);
    };

    img.onerror = () => {
      console.log("error loading image!");
      resolve(false);
    };
  });
}

// 编译 JSON Schema
const validate = ajv.compile(schema);

// 测试数据
const data = {
    "ommatidialProperties": {
      "foo": [0,0,0],
      "$async": true,
      "creationDatetime" : "2023-08-27 14:32:16.1",
      "testImage" :"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC"
    }
};

// 验证数据是否符合 JSON Schema
function asyncValidation() {
  validate(data)
    .then(valid => {
      if (!valid){
        console.log(validate.errors);
      } else {
        console.log("Data is valid!");
      }
    })
    .catch(error => {
      console.error("validation failed:", error.errors);
    });
  // try {
  //   await validate(data);
  //   console.log("Data is valid!");
  // } catch (err) {
  //   console.log("Validation failed:");
  //   console.log(err.errors);
  // }
}

asyncValidation();