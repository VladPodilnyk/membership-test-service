interface ResultBase {
    kind: "success" | "failure";
}

interface Failure extends ResultBase {
    kind: "failure";
    message: string;
}

interface Success<T> extends ResultBase {
    kind: "success";
    data: any;
}

export type Result<T> = Success<T> | Failure;

export class ResultF {
    public static success<T>(data: T): Success<T> {
        return {
            kind: "success",
            data,
        };
    }

    public static failure(message: string): Failure {
        return {
            kind: "failure",
            message,
        };
    }
}
