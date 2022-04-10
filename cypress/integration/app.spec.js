describe("Navigation", () => {
  it("should navigate to the about page", () => {
    // Start from the index page
    cy.visit("http://127.0.0.1:8000/projects/projects");

    // Find a link with an href attribute containing "about" and click it
    // cy.get('a[href*="about"]').click();

    // The new url should include "/about"
    cy.url().should("include", "/projects");

    // The new page should contain an h1 with "About page"
    cy.get("h1").contains("About Page");
  });
});
