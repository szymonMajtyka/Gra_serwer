import isSegmentsIntersect from "./isSegmentsIntersect.js"

function areBoundingBoxesIntersect(akvBoundingBoxA, akvBoundingBoxB) {
    if(!isSegmentsIntersect(akvBoundingBoxA.xLeft, akvBoundingBoxA.xRight, akvBoundingBoxB.xLeft, akvBoundingBoxB.xRight)) {
        return false;
    }
    if(!isSegmentsIntersect(akvBoundingBoxA.yTop, akvBoundingBoxA.yBottom, akvBoundingBoxB.yTop, akvBoundingBoxB.yBottom)) {
        return false;
    }
    return true;

}
export { areBoundingBoxesIntersect as default }