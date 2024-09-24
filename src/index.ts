import ejs from "ejs";
import { getContext, helpers, Property } from "@dylibso/xtp-bindgen";

function toPythonType(property: Property): string {
  if (property.$ref) return property.$ref.name;
  switch (property.type) {
    case "string":
      if (property.format === "date-time") {
        return "datetime";
      }
      return "str";
    case "number":
      if (property.format === "float" || property.format === "double") {
        return "float";
      }
      return "int";
    case "integer":
      return "int";
    case "boolean":
      return "bool";
    case "object":
      return "dict";
    case "array":
      // if (!property.items) 
      return "list";
    case "buffer":
      return "bytes";
    default:
      throw new Error("Can't convert property to Python type: " + property.type);
  }
}

export function render() {
  const tmpl = Host.inputString();
  const ctx = {
    ...helpers,
    ...getContext(),
    toPythonType,
  };

  const output = ejs.render(tmpl, ctx);
  Host.outputString(output);
}
