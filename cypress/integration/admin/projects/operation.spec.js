const JS_PROJECT = "test_js5";
const MARKDOWN_PROJECT = "test_markdown1";
const LINK_PROJECT = "test_link1";

describe("Check different operations on projects", () => {
  beforeEach(() => {
    cy.visit("/admin");

    cy.login(Cypress.env("ADMIN_USER"), Cypress.env("ADMIN_PASS"), true);
    cy.url().should("not.include", "/admin/login");
  });

  it("Check creation of JS project", () => {
    cy.visit("/admin/projects/create");
    cy.url().should("include", "/create");

    // Check if submit will failed on empty data
    cy.get("button[type=submit]").realClick();

    // Check if required error will show up
    cy.inputValue("preview_name", JS_PROJECT, true);

    // Check if required error will show up and thumbnail card will be updated
    cy.inputValue("preview_title", "js_title", true);
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

    cy.get("input[name=preview_thumbnail]")
      .attachFile("../downloads/E1KMKoDVgAM5zII.jpg")
      .wait(500);

    // Check if setting different flag will change window mode
    cy.get("input[name=preview_flag_JS]").realClick();
    cy.get("input[name=main_window_Config]").should("not.exist");

    // Check if by changing note field will show it preview in footer
    cy.get("textarea[name=preview_note]").clear().type("js_note");
    cy.get("footer").contains("js_note").should("exist");

    // Check if by changing note field will show it preview in footer
    cy.inputValue("preview_links_main", "http://js_link", true, "js_link");
    cy.get("footer")
      .contains("Github")
      .should("have.prop", "href")
      .and("equal", "http://js_link/");

    cy.inputValue("temp_preview_links_0", "http://link", true, "link");
    cy.inputValue("temp_preview_links_1", "link2", true);
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
    cy.get("input[name=preview_name]").should("have.value", JS_PROJECT);
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

    // Start checking Code window
    cy.get("input[name=main_window_Code]").realClick();

    // Add simple src file
    cy.get("input[name=code_dir]").clear();
    cy.get("input[name=code_role_src]").realClick();
    cy.get("input[name=code_file]")
      .attachFile("../downloads/test.html")
      .wait(1000);

    cy.get("input[name=code_role_assets]").realClick();
    cy.get("input[name=code_dir]").clear().type("test").blur();
    cy.get("input[name=code_file]")
      .attachFile([
        "../downloads/E1KMKoDVgAM5zII.jpg",
        "../downloads/5ca927abbd24b66dc7f8ca79d7357356.jpg",
      ])
      .wait(1000);

    // Check if uploaded files has been visible in the TreeViewer
    cy.get("ul[class^=TreeView]").within(() => {
      cy.contains("test").should("exist");
      cy.contains("E1KMKoDVgAM5zII.jpg").should("exist");
      cy.contains("5ca927abbd24b66dc7f8ca79d7357356.jpg").should("exist");

      // cy.contains("thumbnail").parent();
      cy.contains("thumbnail").parent().realClick();
      cy.contains("thumbnail")
        .parent()
        .contains("E1KMKoDVgAM5zII.jpg")
        .should("exist");

      // cy.contains("src").parent().;
      cy.contains("src").parent().realClick();
      cy.contains("src").parent().contains("test.html").should("exist");

      cy.contains("template").parent().realClick();
      cy.contains("template")
        .parent()
        .contains("index.html")
        .should("exist")
        .realClick();
    });

    cy.get("#code-area")
      .clear()
      .type(
        `<!DOCTYPE html><html><body><div id="HEADER"></div><div id="BODY"><a href="{{FILE_SERVER}}/{{PROJECT_NAME}}/src/test.html">HELLO WORLD</a><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/test/E1KMKoDVgAM5zII.jpg" alt="test1"><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/test/5ca927abbd24b66dc7f8ca79d7357356.jpg" alt="test1"></div><div id="FOOTER"></div></body></html>`,
        { parseSpecialCharSequences: false }
      );

    cy.get("ul[class^=TreeView]")
      .contains("src")
      .parent()
      .contains("test.html")
      .parent()
      .realClick();

    // Add new code to the src/test.html
    cy.get("#code-area")
      .clear()
      .type(
        `<!DOCTYPE html><html><body><div id="HEADER"></div><div id="BODY">HELLO WORLD</div><div id="FOOTER"></div></body></html>`,
        { parseSpecialCharSequences: false }
      );

    // Submit project
    cy.get("button[type=submit]").realClick();

    // FIXME: Somehow to check toastify
    cy.wait(10000);

    // Check if project exists and there not any server errors
    cy.request({ url: "/" + JS_PROJECT, failOnStatusCode: false })
      .its("status")
      .should("eq", 200);

    cy.visit("/" + JS_PROJECT);

    // Check if alt value is presented instead of img
    cy.contains("test1").should("not.exist");

    cy.get(`img[src$="/assets/test/E1KMKoDVgAM5zII.jpg"]`).should("be.visible");
    cy.get(
      `img[src$="/assets/test/5ca927abbd24b66dc7f8ca79d7357356.jpg"]`
    ).should("be.visible");

    cy.contains("HELLO WORLD")
      .should("have.prop", "href")
      .and("include", "/test.html");

    cy.contains("HELLO WORLD").click();
    cy.get("#BODY").should("have.text", "HELLO WORLD");
  });

  it.skip("Check creation of Markdown project", () => {
    cy.visit("/admin/projects/create");
    cy.url().should("include", "/create");

    // Check if submit will failed on empty data
    cy.get("button[type=submit]").realClick();

    // Check if required error will show up
    cy.inputValue("preview_name", MARKDOWN_PROJECT, true);

    // Check if required error will show up and thumbnail card will be updated
    cy.inputValue("preview_title", "markdown_title", true);
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

    cy.get("input[name=preview_thumbnail]")
      .attachFile("../downloads/E1KMKoDVgAM5zII.jpg")
      .wait(500);

    // Check if setting different flag will change window mode
    cy.get("input[name=preview_flag_Markdown]").realClick();
    cy.get("input[name=main_window_Config]").should("not.exist");

    // Check if by changing note field will show it preview in footer
    cy.get("textarea[name=preview_note]").clear().type("markdown_note");
    cy.get("footer").contains("markdown_note").should("exist");

    // Check if by changing note field will show it preview in footer
    cy.inputValue("preview_links_main", "http://m_link", true, "m_link");
    cy.get("footer")
      .contains("Github")
      .should("have.prop", "href")
      .and("equal", "http://m_link/");

    cy.inputValue("temp_preview_links_0", "http://link", true, "link");
    cy.inputValue("temp_preview_links_1", "link2", true);
    cy.get(".btn-primary").realClick();

    cy.get(".list-group li").contains("link").should("exist");
    cy.get(".list-group li").contains("link2").should("exist");

    cy.get("footer")
      .contains("link2")
      .should("have.prop", "href")
      .and("equal", "http://link/");

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
        `# {{PROJECT_NAME}}

HELLO WORLD 

## Look this is an image
![image info]({{FILE_SERVER}}/{{PROJECT_NAME}}/assets/E1KMKoDVgAM5zII.jpg)

## Look this is a link
* [READ MORE]({{FILE_SERVER}}/{{PROJECT_NAME}}/assets/5ca927abbd24b66dc7f8ca79d7357356.jpg)
`,
        { parseSpecialCharSequences: false }
      );

    // Submit project
    cy.get("button[type=submit]").realClick();

    // FIXME: Somehow to check toastify
    cy.wait(10000);

    // Check if project exists and there not any server errors
    cy.request({ url: "/" + MARKDOWN_PROJECT, failOnStatusCode: false })
      .its("status")
      .should("eq", 200);

    cy.visit("/" + MARKDOWN_PROJECT);

    cy.get(`img[src$="/assets/E1KMKoDVgAM5zII.jpg"]`).should("be.visible");
    cy.contains("HELLO WORLD").should("exist");

    cy.contains("READ MORE")
      .should("have.prop", "href")
      .and("include", "/assets/5ca927abbd24b66dc7f8ca79d7357356.jpg");

    cy.contains("h1", MARKDOWN_PROJECT).should("exist");
    cy.contains("p", "HELLO WORLD").should("exist");
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

  it("Check update the JS project", () => {
    cy.visit(`/admin/projects/update/${JS_PROJECT}`);
    cy.url().should("include", "/update");

    // Check if name was loaded correctly
    cy.get("input[name=preview_name]").should("have.value", JS_PROJECT);
    cy.get("input[name=preview_name]").should("be.disabled");

    // Check if title was loaded correctly
    cy.get("input[name=preview_title]").should("have.value", "js_title");
    cy.get(".card div").contains("js_title").should("exist");

    // Check if desc was loaded correctly
    cy.get("textarea[name=preview_desc]").should("have.value", "js_desc");
    cy.get(".card div").contains("js_desc").should("exist");

    // Check if flag was loaded correctly
    cy.get("input[name=main_window_Config]").should("not.exist");
    cy.get("input[name=preview_flag_JS]")
      .parent("label")
      .should("have.class", "active");

    // Check if note was loaded correctly
    cy.get("textarea[name=preview_note]").should("have.value", "js_note");
    cy.get("footer").contains("js_note").should("exist");

    // Check if links was loaded correctly
    cy.get("input[name=preview_links_main]").should("have.value", "js_link");
    cy.get("footer")
      .contains("Github")
      .should("have.prop", "href")
      .and("equal", "http://js_link/");

    cy.get(".list-group li").contains("link").should("exist");
    cy.get(".list-group li").contains("link2").should("exist");

    cy.get("footer")
      .contains("link2")
      .should("have.prop", "href")
      .and("equal", "http://link/");

    // Start checking Code window
    cy.get("input[name=main_window_Code]").realClick();

    // Check if uploaded files has been visible in the TreeViewer
    cy.get("ul[class^=TreeView]").within(() => {
      cy.contains("test").should("exist");
      cy.contains("E1KMKoDVgAM5zII.jpg").should("exist");
      cy.contains("5ca927abbd24b66dc7f8ca79d7357356.jpg").should("exist");

      // cy.contains("thumbnail").parent();
      cy.contains("thumbnail").parent().realClick();
      cy.contains("thumbnail")
        .parent()
        .contains("E1KMKoDVgAM5zII.jpg")
        .should("exist");

      cy.contains("src").parent().realClick();
      cy.contains("src").parent().contains("test.html").should("exist");

      cy.contains("template").parent().realClick();
      cy.contains("template")
        .parent()
        .contains("index.html")
        .should("exist")
        .realClick();
    });

    cy.get("#code-area").should(
      "have.value",
      `<!DOCTYPE html><html><body><div id="HEADER"></div><div id="BODY"><a href="{{FILE_SERVER}}/{{PROJECT_NAME}}/src/test.html">HELLO WORLD</a><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/test/E1KMKoDVgAM5zII.jpg" alt="test1"><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/test/5ca927abbd24b66dc7f8ca79d7357356.jpg" alt="test1"></div><div id="FOOTER"></div></body></html>`
    );

    // Add simple file
    cy.get("input[name=code_role_assets]").realClick();
    cy.get("input[name=code_dir]").clear();
    cy.get("input[name=code_file]")
      .attachFile("../downloads/E9a0aDUVEAAjMXj.jpeg")
      .wait(1000);

    cy.get("#code-area")
      .clear()
      .type(
        `<!DOCTYPE html><html><body><div id="HEADER"></div><div id="BODY"><a href="{{FILE_SERVER}}/{{PROJECT_NAME}}/src/test.html">HELLO WORLD</a><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/E9a0aDUVEAAjMXj.jpeg" alt="test1"><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/test/E1KMKoDVgAM5zII.jpg" alt="test1"><img src="{{FILE_SERVER}}/{{PROJECT_NAME}}/assets/test/5ca927abbd24b66dc7f8ca79d7357356.jpg" alt="test1"></div><div id="FOOTER"></div></body></html>`,
        { parseSpecialCharSequences: false }
      );

    // Submit project
    cy.get("button[type=submit]").realClick();

    // FIXME: Somehow to check toastify
    cy.wait(10000);

    // Check if project exists and there not any server errors
    cy.request({ url: "/" + JS_PROJECT, failOnStatusCode: false })
      .its("status")
      .should("eq", 200);

    cy.visit("/" + JS_PROJECT);

    // Check if alt value is presented instead of img
    cy.contains("test1").should("not.exist");

    cy.get(`img[src$="/assets/E9a0aDUVEAAjMXj.jpeg"]`).should("be.visible");
    cy.get(`img[src$="/assets/test/E1KMKoDVgAM5zII.jpg"]`).should("be.visible");
    cy.get(
      `img[src$="/assets/test/5ca927abbd24b66dc7f8ca79d7357356.jpg"]`
    ).should("be.visible");

    cy.contains("HELLO WORLD")
      .should("have.prop", "href")
      .and("include", "/test.html");
  });
});
