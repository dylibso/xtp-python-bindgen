import ejs from "ejs";
import { getContext, helpers, Property } from "@dylibso/xtp-bindgen";

function toPythonType(property: Property): string {
  let tp

  if (property.$ref) {
    tp = property.$ref.name
  } else {
    switch (property.type) {
      case "string":
        if (property.format === "date-time") {
          tp = "datetime"
        } else {
          tp = "str"
        }
        break
      case "number":
        // @ts-ignore
        if (property.contentType === "application/json") {
          tp = "str"
        } else if (property.format === "float" || property.format === "double") {
          tp = "float"
        } else {
          tp = "int"
        }
        break
      case "integer":
        // @ts-ignore
        if (property.contentType === "application/json") {
          tp = "str"
        } else {
          tp = "int"
        }
        break
      case "boolean":
        tp = "bool"
        break
      case "object":
        tp = "dict"
        break
      case "array":
        if (!property.items) {
          tp = "list"
        } else {
          tp = `List[${toPythonType(property.items as Property)}]`
        }
        break
      case "buffer":
        tp = "bytes"
        break
      default:
        throw new Error("Can't convert property to Python type: " + property.type);
    }
  }

  if (!tp) throw new Error("Cant convert property to Python type: " + property.type)
  if (!property.nullable) return tp
  return `Optional[${tp}]`
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
