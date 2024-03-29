export function radToString(angle: number): string {
    return degreesToString(angle * 180 / Math.PI);
}

export function radToHourString(angle: number): string {
    return hoursToString(angle * 12 / Math.PI);
}

export function hoursToString(hours: number): string {

    const h = Math.abs(hours);
    const min = (h * 60) % 60;
    const sec = (min * 60) % 60;

    return ((hours < 0) ? "-" : "") + Math.floor(h) + "h " + Math.floor(min) + "m " + (Math.round(sec * 100) / 100) + "s";
}
export function degreesToString(degree: number): string {
    const deg = Math.abs(degree);
    const min = (deg * 60) % 60;
    const sec = (min * 60) % 60;

    return ((degree < 0) ? "-" : "") + Math.floor(deg) + "° " + Math.floor(min) + "\' " + (Math.round(sec * 100) / 100) + "\'\'";
}