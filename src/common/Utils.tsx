
export class Assert {

    public static checkState = (expression: boolean, errorMessage: string): void => {
        if (!expression) {
            throw new Error(errorMessage);
        }
    }
}

export class Validator {

    public static isEmpty = (val: any): boolean => {
        if (val === undefined || val === null) return true;
        if (typeof val === 'string') return val.trim() === ""; 
        else if (typeof val === "object") return val.length === 0;
        return false;
    }

    public static isNotEmpty = (val: any): boolean => {
        return !Validator.isEmpty(val);
    }
}

export class Arrays {

    public static sort(elements: object[], field: string) {
        return elements.sort(this.comparator(field));
    }

    private static comparator = (field: string) => {
        return function(first: object, second: object) {
            return first[field] - second[field];
        }
    }
}