describe("Check different operations on projects", () => {
  beforeEach(() => {
    cy.visit("/admin");

    cy.login(Cypress.env("ADMIN_USER"), Cypress.env("ADMIN_PASS"), true);
    cy.url().should("not.include", "/admin/login");
  });

  it("Check creation of JS project", () => {
    cy.visit("/admin/projects/operation");
    cy.url().should("include", "?type=add");

    cy.get("input[name=preview_name]").clear().type("test_js").blur();
    cy.get("input[name=preview_title]").clear().type("js_title").blur();
    cy.get("textarea[name=preview_desc]").clear().type("js_desc").blur();

    // cy.get("input[name=preview_flag_JS]").focused().click("center");
    cy.get("input[name=preview_flag_Markdown]").realClick();
    cy.get("input[name=main_window_Config]").should("not.exist");

    cy.get("textarea[name=preview_note]").clear().type("js_note");
    cy.get("input[name=preview_links_main]")
      .clear()
      .type("http://js_link")
      .should("have.value", "js_link");

    // cy.get("input[name=temp_preview_links]").clear().type("js_note");
    // cy.get("input[name=temp_preview_links]").clear().type("js_note");
  });
});
