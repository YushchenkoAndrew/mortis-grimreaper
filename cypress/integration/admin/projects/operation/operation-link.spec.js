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

  it.skip("Check creation of Link project", () => {
    cy.visit("/admin/projects/create");
    cy.url().should("include", "/create");

    // Check if submit will failed on empty data
    cy.get("button[type=submit]").realClick();

    // Check if required error will show up
    cy.inputValue("preview_name", LINK_PROJECT, true);

    // Check if required error will show up and thumbnail card will be updated
    cy.inputValue("preview_title", "link_title", true);
    cy.get(".card div").contains("link_title").should("exist");

    // Check if required error will show up and thumbnail card will be updated
    cy.get(`textarea[name=preview_desc]`)
      .parent("div")
      .within(() => {
        cy.get("div").should("be.visible");
        cy.get("textarea")
          .clear()
          .type("link_desc")
          .should("have.value", "link_desc")
          .blur();
      });

    cy.get(".card div").contains("link_desc").should("exist");

    cy.get("input[name=preview_thumbnail]")
      .attachFile("../downloads/E1KMKoDVgAM5zII.jpg")
      .wait(500);

    // Check if setting different flag will change window mode
    cy.get("input[name=preview_flag_Link]").realClick();
    cy.get("input[name=main_window_Code]").should("not.exist");
    cy.get("input[name=main_window_Config]").should("not.exist");

    // Check if by changing note field will show it preview in footer
    cy.contains("textarea[preview_note]").should("not.exist");

    // Check if by changing note field will show it preview in footer
    cy.inputValue(
      "preview_links_main",
      `{{FILE_SERVER}}/${JS_PROJECT}/src/test.html`,
      true,
      `{{FILE_SERVER}}/${JS_PROJECT}/src/test.html`
    );
    cy.contains("footer").should("not.exist");

    // Submit project
    cy.get("button[type=submit]").realClick();

    // FIXME: Somehow to check toastify
    cy.wait(10000);

    // Check if project exists and there not any server errors
    cy.request({ url: "/" + LINK_PROJECT, followRedirect: false }).then(
      (res) => {
        expect(res.status).equal(307);
        expect(res.headers.location).not.include("{{FILE_SERVER}}");
      }
    );
  });
});
