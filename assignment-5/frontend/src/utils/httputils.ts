import axios from 'axios'

const dockerCompiler = axios.create({
    baseURL: "http://localhost:8088",
    headers: {
        "Content-Type": "application/json"
    }
})

export const postCode = (code: string, language: string) => {
    return dockerCompiler.post("/compile", {code, language})
}