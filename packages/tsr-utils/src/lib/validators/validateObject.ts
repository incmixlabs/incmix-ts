import {TSRObjValidator} from "../helpers/types";
import {ConcreteTsRuntimeObject, ObjectTsRuntimeObject} from "../../index";

export const validateObject: TSRObjValidator<ObjectTsRuntimeObject & ConcreteTsRuntimeObject> = (tsRuntimeObject, data) => {
    throw new Error("Validating objects is not yet supported!");
}