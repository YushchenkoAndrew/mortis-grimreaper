const EXISTED_ADMIN_PAGES = [
  "/admin",
  "/admin/logout",
  "/admin/settings",
  "/admin/projects",
  // "/admin/projects/metrics",
  "/admin/projects/create",
];

const NOT_EXISTED_ADMIN_PAGES = [
  "/admin/index",
  "/admin/check2",
  // "/admin/projects/index",
];

describe("Admin login page", () => {
  it("Check redirect to the pages", () => {
    EXISTED_ADMIN_PAGES.forEach((path) => {
      cy.visit(path);

      // Should be created a redirect to the login page
      cy.url().should("include", "/admin/login");
    });
  });

  it("Check some not existed pages", () => {
    NOT_EXISTED_ADMIN_PAGES.forEach((path) => {
      cy.request({ url: path, failOnStatusCode: false })
        .its("status")
        .should("eq", 404);
    });
  });

  it("Check if admin auth req is limited", () => {
    for (let i = 0; i < 20; i++) {
      cy.login("admin", "a", true, "So your name is Mr.admin, huh...");
    }

    cy.login("admin", "a", true, "You can't go EVEN FURTHER BEYOND");
  });

  it("Check admin auth", () => {
    cy.visit("/admin");
    cy.wait(5000);

    cy.login("", "", false, "Please verify that you are not a bot");
    cy.login("", "admin", false, "Please verify that you are not a bot");
    cy.login("admin", "", false, "Please verify that you are not a bot");
    cy.login("admin", "admin", false, "Please verify that you are not a bot");

    cy.login("", "", true, "User name can't be blank");
    cy.login("", "admin", true, "User name can't be blank");
    cy.login("admin", "", true, "Password can't be blank");
    cy.login("admin", "a", true, "So your name is Mr.admin, huh...");

    cy.login(Cypress.env("ADMIN_USER"), Cypress.env("ADMIN_PASS"), true);
    cy.url().should("not.include", "/admin/login");

    cy.visit("/admin/login");
    cy.url().should("not.include", "/admin/login");
  });

  it("Check admin logout", () => {
    cy.visit("/admin");
    cy.url().should("include", "/admin/login");

    cy.login(Cypress.env("ADMIN_USER"), Cypress.env("ADMIN_PASS"), true);
    cy.url().should("not.include", "/admin/login");

    cy.visit("/admin/logout");
    cy.url().should("not.include", "/admin");

    EXISTED_ADMIN_PAGES.forEach((path) => {
      cy.visit(path);

      // Should be created a redirect to the login page
      cy.url().should("include", "/admin/login");
    });
  });
});
