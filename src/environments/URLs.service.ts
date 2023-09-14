import { environment } from "./environment";

const services = {
    login: "/auth/authenticate",
    refreshToken: "/auth/refreshtoken",

    programs: "/programs/public",
    program: "/programs/public/{{programId}}",
};

type possibleValues = keyof typeof services



export function getUrl(serviceName: possibleValues, ...keyValues: { key: string, value: string }[]) {
    let fullUrl: string = environment.host + services[serviceName]
    if (keyValues) {
        keyValues.forEach(keyValue => {
            fullUrl = fullUrl.replace(keyValue.key, keyValue.value)
        })
    }
    return fullUrl;
}