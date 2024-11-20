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

function isOptional(type: String): boolean {
  return type.startsWith('Optional[')
}

function toPythonTypeX(type: XtpNormalizedType): string {
  const opt = (t: string) => {
    return type.nullable ? `Optional[${t}]` : t
  }
  switch (type.kind) {
    case 'string':
      return opt('str');
    case 'int32':
      return opt('int');
    case 'float':
      return opt('float');
    case 'double':
      return opt('float')
    case 'byte':
      return opt('byte');
    case 'date-time':
      return opt("datetime");
    case 'boolean':
      return opt('bool');
    case 'array':
      const arrayType = type as ArrayType
      return opt(`List[${toPythonTypeX(arrayType.elementType)}]`);
    case 'buffer':
      return opt('bytes'); 
    case 'map':
      // TODO: improve typing of dicts
      return opt('dict');
    case 'object':
      return opt(pythonTypeName((type as ObjectType).name));
    case 'enum':
      return opt(pythonTypeName((type as EnumType).name));
    default:
      throw new Error("Can't convert XTP type to Python type: " + type)
  }
}


function toPythonType(property: XtpTyped, required?: boolean): string {
  let t = toPythonTypeX(property.xtpType);
  if (required === undefined || required || isOptional(t)) return t;
  return `Optional[${t}]`;
}

function toPythonParamType(property: XtpTyped): string {
  let t = toPythonTypeX(property.xtpType);
  t = t.replace('int', 'str');
  t = t.replace('float', 'str');
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
