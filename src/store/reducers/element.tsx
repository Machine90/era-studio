import { AsuraAction } from "../common/Types";

export const selectElement = (selectedElementSeq: string): AsuraAction => {
    return {
        type: "SELECT_ELEMENT",
        payload: {
            focusElementSeq: selectedElementSeq
        }
    };
};

export default function selectedElement(state = "", action: AsuraAction) {
    switch (action.type) {
        case "SELECT_ELEMENT":
            const { focusElementSeq } = action.payload;
            return focusElementSeq;
        case "REMOVE_ELEMENT":
            return '';
        default:
            return state;
    }
}
