// 定义 JSON Schema
const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "http://example.com/schemas/schema.json",
    "type": "object",
    "properties": {
      "foo": {"$ref": "defs.json#/definitions/int"},
      "bar": {"$ref": "defs.json#/definitions/str"},
    },
    "required": ["foo"]
};
  
  const defsSchema = {
    "$id": "http://example.com/schemas/defs.json",
    "definitions": {
      "int": {"type": "integer"},
      "str": {"type": "string"},
    },
};

// 创建 Ajv 实例
const Ajv = window.ajv2020;
const ajv = new Ajv({schemas:{
    schema,defsSchema
}});

// 编译 JSON Schema
const validate = ajv.compile(schema);

// 测试数据
const data = {
    foo: 25
};

// 验证数据是否符合 JSON Schema
const valid = validate(data);
if (valid) {
    console.log("数据有效");
} else {
    console.log("数据无效");
    console.log(validate.errors);
}