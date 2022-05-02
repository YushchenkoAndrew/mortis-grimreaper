const JS_PROJECT = "test_js8";
const MARKDOWN_PROJECT = "test_markdown11";
const LINK_PROJECT = "test_link2";
const DOCKER_PROJECT = "test_docker33";
const DOCKER_VERSION = "0.0.5";

const DOCKER_HOST = "192.168.1.2";
const DOCKER_PORT = "8888";

describe("Check different operations on projects", () => {
  beforeEach(() => {
    cy.visit("/admin");

    cy.login(Cypress.env("ADMIN_USER"), Cypress.env("ADMIN_PASS"), true);
    cy.url().should("not.include", "/admin/login");
  });

  it("Check creation of Pattern", () => {
    cy.visit("/admin/settings");
    cy.contains("Patterns").parent().realClick();
    cy.get("button[name=create]").realClick();

    // TODO: Add small tests ....
    cy.inputValue("pattern_colors", "a5", false, "5");
    cy.inputValue("pattern_scale", "a16", false, "16");
    cy.inputValue("pattern_stroke", "6.5", false, "6.5");
    cy.inputValue("pattern_spacing_x", "0", false, "0");
    cy.inputValue("pattern_spacing_y", "10", false, "10");
    cy.inputValue("pattern_width", "p120", false, "120");
    cy.inputValue("pattern_height", "p80", false, "80");

    cy.get("#code-area")
      .clear()
      .type(`<path />`, { parseSpecialCharSequences: false });

    cy.get("button[type=submit]").realClick();

    cy.wait(1000);
  });
});
