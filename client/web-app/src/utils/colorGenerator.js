import convert from "color-convert";

export const getRGBARainbowArray = (
    quantity,
    { range = null, offset = null } = {}
) => {
    if (!Number.isInteger(quantity)) return false;

    const colorArray = [];
    for (let i = 0; i < quantity; i++) {
        colorArray.push(getRGBAColor(i, quantity, { range, offset }));
    }

    return colorArray;
};

export const getRGBAColor = (index, parts, { range, offset = 0 } = {}) => {
    const totalDegrees = range?.max && range?.min ? range.max - range.min : 360;
    offset = range?.max && range?.min ? offset + range.min : offset;
    const hue = (totalDegrees / parts) * index + offset;
    return `rgba(${convert.hsv.rgb(hue, 75, 97).join()},1)`;
};
