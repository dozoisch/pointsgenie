import { merge } from "lodash";

class Model {
  static schema = {};

  constructor(props) {
    function parseCurrent(input, schemaEntry) {
      if (schemaEntry.type === Object && schemaEntry.shape) {
        if (input !== undefined) {
          return parseObject(input, schemaEntry.shape);
        }
        return {};
      } else if (schemaEntry.type === String) {
        if (input !== undefined) {
         return input;
        }
        return "";
      } else if (schemaEntry.type === Number) {
       return input ? parseFloat(input, 10) : 0;
      } else if (schemaEntry.type === Boolean) {
        return !!input;
      } else {
        return new schemaEntry.type(input);
      }
    }
    function parseObject(input, schema) {
      let output = {};
      for (let key of Object.keys(schema)) {
        const currentInput = input[key];
        const currentSchema = schema[key];
        if (currentSchema.constructor.name === "Array") {
          output[key] = [];
          if (currentInput !== undefined) {
            output[key] = currentInput.map(e => parseCurrent(e, currentSchema[0]));
          }
        } else {
          output[key] = parseCurrent(currentInput, currentSchema);
        }
      };
      return output;
    }
    merge(this, parseObject(props, this.constructor.schema));
  }

  toJSON() {
    function parseCurrent(input, schemaEntry) {
      if (schemaEntry.type === Object && schemaEntry.shape) {
        return parseObject(input, schemaEntry.shape);
      } else {
        if (input !== undefined) {
          if (input === null) {
            return "null";
          } else if (schemaEntry.type === Number || schemaEntry.type === Boolean) {
            return input;
          } else {
            return input.toJSON ? input.toJSON() : input.toString();
          }
        }
      }
    }
    function parseObject(input, schema) {
      let output = {};
      for (let key of Object.keys(schema)) {
        let current = schema[key];
        if (current.constructor.name === "Array") {
          current = current[0];
          if (!current.private) {
            output[key] = input[key].map(currentInput => parseCurrent(currentInput, current));
          }
        } else {
          if (!current.private) {
            output[key] = parseCurrent(input[key], current);
          }
        }
      }
      return output;
    }
    return parseObject(this, this.constructor.schema);
  }
}

export default Model;
