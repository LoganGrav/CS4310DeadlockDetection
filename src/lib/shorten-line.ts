export function shortenLine(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    targetKind: "process" | "resource"
) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) return { x2: toX, y2: toY };


    const offset =
        targetKind === "process"
            ? 18
            : Math.sqrt(2 * 16 * 16);

    const ratio = (len - offset) / len;

    return {
        x2: fromX + dx * ratio,
        y2: fromY + dy * ratio,
    };
}