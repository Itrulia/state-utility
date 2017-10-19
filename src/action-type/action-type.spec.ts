import {actionType} from "./action-type";

describe("action-type", () => {

    it("should be possible to define an action", () => {
        const type = actionType("[foo] bar");
        expect(type).toEqual("[foo] bar");
    });

    it("should not be possible to define an action twice", () => {
        try {
            const type = actionType("[foo] bar");
            const type2 = actionType("[foo] bar");
            fail();
        } catch(e) {}
    });
});