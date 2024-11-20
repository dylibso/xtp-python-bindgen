import ejs from "ejs";
import { 
  helpers, 
  getContext, 
  ObjectType, 
  EnumType, 
  ArrayType, 
  XtpNormalizedType, 
  MapType, 
  Parameter, 
  Property, 
  XtpTyped 
} from "@dylibso/xtp-bindgen"

function pythonTypeName(s: string): string {
  return helpers.snakeToPascalCase(s);
}

function pythonFunctionName(s: string): string {
  return helpers.camelToSnakeCase(s);
}


function toPythonTypeX(type: XtpNormalizedType): string {
  switch (type.kind) {
    case 'string':
      return 'str';
    case 'int32':
      return 'int';
    case 'float':
      return 'float';
    case 'double':
      return 'float'
    case 'byte':
      return 'byte';
    case 'date-time':
      return "datetime";
    case 'boolean':
      return 'bool';
    case 'array':
      const arrayType = type as ArrayType
      return `List[${toPythonTypeX(arrayType.elementType)}]`
    case 'buffer':
      return 'bytes'; 
    case 'map':
      // TODO: improve typing of dicts
      return 'dict';
    case 'object':
      return pythonTypeName((type as ObjectType).name);
    case 'enum':
      return pythonTypeName((type as EnumType).name);
    default:
      throw new Error("Can't convert XTP type to Python type: " + type)
  }
}


function toPythonType(property: XtpTyped, required?: boolean): string {
  let t = toPythonTypeX(property.xtpType);
  if (property.xtpType.nullable) {
    t = `Optional[${t}]`;
  }
  if (required === undefined || required) return t;

  if (!property.xtpType.nullable) {
    t = `Optional[${t}]`;
  }
  return t;
}

function toPythonParamType(property: XtpTyped): string {
  let t = toPythonTypeX(property.xtpType);
  if (t === 'int' || t === 'float'){
    t = 'str';
  }
  if (property.xtpType.nullable) {
    t = `Optional[${t}]`;
  }
  return t;
}

export function render() {
  const tmpl = Host.inputString();
  const ctx = {
    ...helpers,
    ...getContext(),
    toPythonType,
    toPythonParamType,
    pythonTypeName,
    pythonFunctionName
  };

  const output = ejs.render(tmpl, ctx);
  Host.outputString(output);
}
