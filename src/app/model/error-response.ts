import { ErrorCodeMessage } from "./error-code-message.model";
export interface ErrorResponse {
    errors?: ErrorCodeMessage[];
}