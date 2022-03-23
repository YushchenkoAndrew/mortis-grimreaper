describe("Check different operations on projects", () => {
  beforeEach(() => {
    cy.visit("/admin");

    cy.login(Cypress.env("ADMIN_USER"), Cypress.env("ADMIN_PASS"), true);
    cy.url().should("not.include", "/admin/login");
  });

  it("Check creation of JS project", () => {
    cy.visit("/admin/projects/operation");
    cy.url().should("include", "?type=add");

    const projectName = "test_js5";

    // Check if submit will failed on empty data
    cy.get("button[type=submit]").realClick();

    // Check if required error will show up
    cy.checkInputValue("preview_name", projectName, true);

    // Check if required error will show up and thumbnail card will be updated
    cy.checkInputValue("preview_title", "js_title", true);
    cy.get(".card div").contains("js_title").should("exist");

    // Check if required error will show up and thumbnail card will be updated
    cy.get(`textarea[name=preview_desc]`)
      .parent("div")
      .within(() => {
        cy.get("div").should("be.visible");
        cy.get("textarea")
          .clear()
          .type("js_desc")
          .should("have.value", "js_desc")
          .blur();
      });

    cy.get(".card div").contains("js_desc").should("exist");

    // TODO: Add caching functionality to the file !!!
    // cy.get("input[name=preview_thumbnail]").attachFile(
    //   "../downloads/E1KMKoDVgAM5zII.jpg"
    // );

    // Check if setting different flag will change window mode
    cy.get("input[name=preview_flag_JS]").realClick();
    cy.get("input[name=main_window_Config]").should("not.exist");

    // Check if by changing note field will show it preview in footer
    cy.get("textarea[name=preview_note]").clear().type("js_note");
    cy.get("footer").contains("js_note").should("exist");

    // Check if by changing note field will show it preview in footer
    cy.checkInputValue("preview_links_main", "http://js_link", true, "js_link");
    cy.get("footer")
      .contains("Github")
      .should("have.prop", "href")
      .and("equal", "http://js_link/");

    cy.checkInputValue("temp_preview_links_0", "http://link", true, "link");
    cy.checkInputValue("temp_preview_links_1", "link2", true);
    cy.get(".btn-primary").realClick();

    cy.get(".list-group li").contains("link").should("exist");
    cy.get(".list-group li").contains("link2").should("exist");

    cy.get("footer")
      .contains("link2")
      .should("have.prop", "href")
      .and("equal", "http://link/");

    // Make a small delay for cached data to be saved successfully
    cy.wait(2000).reload().wait(2000);

    // Check caching !!
    cy.get("input[name=preview_name]").should("have.value", projectName);
    cy.get("input[name=preview_title]").should("have.value", "js_title");
    cy.get("textarea[name=preview_desc]").should("have.value", "js_desc");
    cy.get("input[name=preview_links_main]").should("have.value", "js_link");
    cy.get("textarea[name=preview_note]").should("have.value", "js_note");

    cy.get(".list-group li").contains("link").should("exist");
    cy.get(".list-group li").contains("link2").should("exist");

    cy.get("footer")
      .contains("link2")
      .should("have.prop", "href")
      .and("equal", "http://link/");

    // FIXME: Somehow save uploaded file
    cy.get("input[name=preview_thumbnail]")
      .attachFile("../downloads/E1KMKoDVgAM5zII.jpg")
      .wait(500);

    // Start checking Code window
    cy.get("input[name=main_window_Code]").realClick();

    cy.get("input[name=code_dir]").clear().type("test").blur();
    cy.get("input[name=code_file]").attachFile([
      "../downloads/E1KMKoDVgAM5zII.jpg",
      "../downloads/5ca927abbd24b66dc7f8ca79d7357356.jpg",
    ]);

    // Check if uploaded files has been visible in the TreeViewer
    cy.get("ul[class^=TreeView]").within(() => {
      cy.contains("test").should("exist");
      cy.contains("E1KMKoDVgAM5zII.jpg").should("exist");
      cy.contains("5ca927abbd24b66dc7f8ca79d7357356.jpg").should("exist");

      cy.contains("thumbnail").parent().realClick();
      cy.contains("thumbnail")
        .parent()
        .contains("E1KMKoDVgAM5zII.jpg")
        .should("exist");
    });

    cy.get("#code-area")
      .clear()
      .type(
        `<!DOCTYPE html><html><body><div id="HEADER"></div><div id="BODY"><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/E1KMKoDVgAM5zII.jpg" alt="test1"><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/5ca927abbd24b66dc7f8ca79d7357356.jpg" alt="test1"></div><div id="FOOTER"></div></body></html>`,
        { parseSpecialCharSequences: false }
      );

    // Submit project
    cy.get("button[type=submit]").realClick();

    // FIXME: Somehow to check toastify
    cy.wait(5000);

    // Check if project exists and there not any server errors
    cy.request({ url: "/" + projectName, failOnStatusCode: false })
      .its("status")
      .should("eq", 200);

    cy.visit("/" + projectName);
    cy.get(`img[src$="/assets/E1KMKoDVgAM5zII.jpg"]`).should("exist");
    cy.get(`img[src$="/assets/5ca927abbd24b66dc7f8ca79d7357356.jpg"]`).should(
      "exist"
    );
  });

  it("Check creation of Markdown project", () => {
    cy.visit("/admin/projects/operation");
    cy.url().should("include", "?type=add");

    const projectName = "test_markdown";

    // Check if submit will failed on empty data
    cy.get("button[type=submit]").realClick();

    // Check if required error will show up
    cy.checkInputValue("preview_name", projectName, true);

    // Check if required error will show up and thumbnail card will be updated
    cy.checkInputValue("preview_title", "markdown_title", true);
    cy.get(".card div").contains("markdown_title").should("exist");

    // Check if required error will show up and thumbnail card will be updated
    cy.get(`textarea[name=preview_desc]`)
      .parent("div")
      .within(() => {
        cy.get("div").should("be.visible");
        cy.get("textarea")
          .clear()
          .type("markdown_desc")
          .should("have.value", "markdown_desc")
          .blur();
      });

    cy.get(".card div").contains("markdown_desc").should("exist");

    // TODO: Add caching functionality to the file !!!
    // cy.get("input[name=preview_thumbnail]").attachFile(
    //   "../downloads/E1KMKoDVgAM5zII.jpg"
    // );

    // Check if setting different flag will change window mode
    cy.get("input[name=preview_flag_Markdown]").realClick();
    cy.get("input[name=main_window_Config]").should("not.exist");

    // Check if by changing note field will show it preview in footer
    cy.get("textarea[name=preview_note]").clear().type("markdown_note");
    cy.get("footer").contains("markdown_note").should("exist");

    // Check if by changing note field will show it preview in footer
    cy.checkInputValue("preview_links_main", "http://m_link", true, "m_link");
    cy.get("footer")
      .contains("Github")
      .should("have.prop", "href")
      .and("equal", "http://m_link/");

    cy.checkInputValue("temp_preview_links_0", "http://link", true, "link");
    cy.checkInputValue("temp_preview_links_1", "link2", true);
    cy.get(".btn-primary").realClick();

    cy.get(".list-group li").contains("link").should("exist");
    cy.get(".list-group li").contains("link2").should("exist");

    cy.get("footer")
      .contains("link2")
      .should("have.prop", "href")
      .and("equal", "http://link/");

    // Make a small delay for cached data to be saved successfully
    cy.wait(2000).reload().wait(2000);

    // Check caching !!
    cy.get("input[name=preview_name]").should("have.value", projectName);
    cy.get("input[name=preview_title]").should("have.value", "markdown_title");
    cy.get("textarea[name=preview_desc]").should("have.value", "markdown_desc");
    cy.get("input[name=preview_links_main]").should("have.value", "m_link");
    cy.get("textarea[name=preview_note]").should("have.value", "markdown_note");

    cy.get(".list-group li").contains("link").should("exist");
    cy.get(".list-group li").contains("link2").should("exist");

    cy.get("footer")
      .contains("link2")
      .should("have.prop", "href")
      .and("equal", "http://link/");

    // FIXME: Somehow save uploaded file
    cy.get("input[name=preview_thumbnail]")
      .attachFile("../downloads/E1KMKoDVgAM5zII.jpg")
      .wait(500);

    // Start checking Code window
    cy.get("input[name=main_window_Code]").realClick();

    cy.get("input[name=code_dir]").clear().type("test").blur();
    cy.get("input[name=code_file]").attachFile([
      "../downloads/E1KMKoDVgAM5zII.jpg",
      "../downloads/5ca927abbd24b66dc7f8ca79d7357356.jpg",
    ]);

    // Check if uploaded files has been visible in the TreeViewer
    cy.get("ul[class^=TreeView]").within(() => {
      cy.contains("test").should("exist");
      cy.contains("E1KMKoDVgAM5zII.jpg").should("exist");
      cy.contains("5ca927abbd24b66dc7f8ca79d7357356.jpg").should("exist");

      cy.contains("thumbnail").parent().realClick();
      cy.contains("thumbnail")
        .parent()
        .contains("E1KMKoDVgAM5zII.jpg")
        .should("exist");
    });

    // TODO: !!!
    // cy.get("#code-area")
    //   .clear()
    //   .type(
    //     `<!DOCTYPE html><html><body><div id="HEADER"></div><div id="BODY"><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/E1KMKoDVgAM5zII.jpg" alt="test1"><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/5ca927abbd24b66dc7f8ca79d7357356.jpg" alt="test1"></div><div id="FOOTER"></div></body></html>`,
    //     { parseSpecialCharSequences: false }
    //   );

    // // Submit project
    // cy.get("button[type=submit]").realClick();

    // // FIXME: Somehow to check toastify
    // cy.wait(5000);

    // // Check if project exists and there not any server errors
    // cy.request({ url: "/" + projectName, failOnStatusCode: false })
    //   .its("status")
    //   .should("eq", 200);

    // cy.visit("/" + projectName);
    // cy.get(`img[src$="/assets/E1KMKoDVgAM5zII.jpg"]`).should("exist");
    // cy.get(`img[src$="/assets/5ca927abbd24b66dc7f8ca79d7357356.jpg"]`).should(
    //   "exist"
    // );
  });
});
