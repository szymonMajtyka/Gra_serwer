function isSegmentsIntersect(a0, a1, b0, b1) {
    if((a0 < b0) && (b0 < a1 )) { // l1 < l2 && l2 < r1
        return true;
    }
    if ((a0 < b1) && (b1 < a1)) { // l1 < r2 && r2 < r1
        return true;
    }
    if ((b0 < a0) && (a0 < b1)) { // l2 < l1 && l1 < r2
        return true;
    }
    return false;
}

export { isSegmentsIntersect as default }