export function catchJSON(content:string):string {
    try {
        return JSON.parse(content)   
    } catch {
        return content
    }
}