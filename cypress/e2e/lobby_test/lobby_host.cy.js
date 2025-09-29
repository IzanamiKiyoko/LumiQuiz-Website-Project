describe('lobby for role host demonstation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/lobby/host');
        cy.get('input[name="input name"]').type('Cypress Tester');
        cy.get('button[name="btn enter lobby"]').click();
        cy.wait(3000);
    });
    it('Test case 1: Host lobby include some detail', () => {
        cy.get('[name="title"]')
            .invoke('text')
            .should((text) => {
                expect([
                    "Cypress Tester's lobby",
                    "Phòng chờ của Cypress Tester"
                ]).to.include(text);
            });

        cy.get('[name="player_count"]').should('contain', "1");

        cy.get('[name="pin_code"]')
            .should("not.be.empty")
            .and("not.contain", "------");
    });
});
describe('Lobby for role host feature', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/lobby/host');
        cy.get('input[name="input name"]').type('Cypress Tester');
        cy.get('button[name="btn enter lobby"]').click();
    });
    it('Test case 2: Show/Hide Pin Feature', () => {
        cy.get('button[name="btn_hide_pin"]').click();
        cy.get('[name="pin_code"]').should('have.text', "******");
    });

    it('Test case 3: Copy Feature', () => {
        cy.window().then((win) => {
            cy.stub(win.navigator.clipboard, "writeText").as("writeText");
        });

        cy.get('button[name="btn_copy_pin"]').click();
        cy.get("@writeText").should("have.been.called");

        cy.get('button[name="btn_share_lobby"]').click();
        cy.get("@writeText").should("have.been.called");
    });

    it('Test case 4: Check user list', () => {
        cy.get('[name="player_count"]').click();

        cy.get('[name="nav_board"]').should('have.class', 'sidebar open');

        cy.get('[name="nav_title"]')
            .invoke('text')
            .should((text) => {
                expect(["Players", "Người chơi"]).to.include(text);
            });

        cy.get('[name="card_Cypress Tester"]').should('have.text', "Cypress Tester");
    });

    it('Test case 5: Play with everyone feature', () => {
        cy.wait(5000);
        cy.get('button[name="playWith"]').click();
        cy.get('[name="toast_notification"]').should('exist');
        cy.get('button[name="playWith"]')
            .invoke('text')
            .should("be.oneOf", ["Status viewer", "Trạng thái người xem"]);
        cy.get('#player-list').find('[name="player_Cypress Tester"]').should("exist");

        cy.get('button[name="playWith"]').click();
        cy.get('[name="toast_notification"]').should('exist');
        cy.get('button[name="playWith"]')
            .invoke('text')
            .should("be.oneOf", ["Play with everyone", "Chơi với mọi người"]);
        cy.get('#player-list').find('[name="player_Cypress Tester"]').should("not.exist");
    });


});

describe('Setting feature', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/lobby/host');
        cy.get('input[name="input name"]').type('Cypress Tester');
        cy.get('button[name="btn enter lobby"]').click();
        cy.get('button[name="btn_setting"]').click();
    });
    it('Test case 6: open sidebar', () => {
        cy.get('[name="nav_board"]').should('have.class', 'sidebar open');

        cy.get('[name="nav_title"]')
            .invoke('text')
            .should((text) => {
                expect(["Setting", "Cài đặt"]).to.include(text);
            });
    });
    

    // test
    // it('Test case 7: Music - Sound working', () => {
    //     // Music
    //     cy.get('[name="st_music"] input[type="range"]')
    //         .invoke('val', 70)
    //         .trigger('input')
    //         .trigger('change')
    //         .should('have.value', '70');

    //     cy.getLocalStorage("musicVolume").should("eq", "70");

    //     // Sound
    //     cy.get('[name="st_sound"] input[type="range"]')
    //         .invoke('val', 60)
    //         .trigger('input')
    //         .trigger('change')
    //         .should('have.value', '60');

    //     cy.getLocalStorage("soundVolume").should("eq", "60");
    // });


    it("Test case 8: Switch Minus Point", () => {
        //-Enable
        cy.get('[name="st_minusPoint"]')
            .find('[name="sw_minusPoint"]')
            .click()
            .should("have.attr", "aria-checked", "true");
        cy.get('[name="modal"]').should('not.exist');
        cy.get('[name="toast_notification"]').should('exist');
        cy.get('[name="toast_notification"]')
            .invoke('text')
            .should((text) => {
                expect(text).to.satisfy((t) =>
                    ["has turned on the minus point feature", "đã bật tính năng trừ điểm"].some(opt => t.includes(opt))
                );
            });
        //-Disable
        cy.get('[name="st_minusPoint"]')
            .find('[name="sw_minusPoint"]')
            .click()
            .should("have.attr", "aria-checked", "false");
        cy.get('[name="modal"]').should('not.exist');
        cy.get('[name="toast_notification"]').should('exist');
        cy.get('[name="toast_notification"]')
            .invoke('text')
            .should((text) => {
                expect(text).to.satisfy((t) =>
                    ["has turned off the minus point feature", "đã tắt tính năng trừ điểm"].some(opt => t.includes(opt))
                );
            });
    });

    it("Test case 9: Dropdown time per slide", () => {
        //Default
        cy.get('button[name="btn_dd_tps"]').find('span').should("contain.text", "20s");
        //Select 1 of them
        cy.get('button[name="btn_dd_tps"]').click();
        cy.get('ul[name="list_dd_tps"]').find("li").contains("45s").click();
        cy.get('button[name="btn_dd_tps"]').find('span').should("contain.text", "45s");
        cy.get('button[name="btn_dd_tps"]').click();
        cy.get('ul[name="list_dd_tps"] li')
            .contains("45s")
            .parent()                // quay lên li chứa text
            .find(".icon svg")
            .should("exist");
        cy.get('[name="modal"]').should('not.exist');
        cy.get('[name="toast_notification"]').should('exist');
        cy.get('[name="toast_notification"]')
            .invoke('text')
            .should((text) => {
                expect(text).to.satisfy((t) =>
                    ["changed the time of each slide to 45s", "đã thay đổi thời gian mỗi slide thành 45s"].some(opt => t.includes(opt))
                );
            });

    });
});