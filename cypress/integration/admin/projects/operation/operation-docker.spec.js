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

  it("Check creation of Docker project", () => {
    cy.visit("/admin/projects/create");
    cy.url().should("include", "/create");

    // Check if submit will failed on empty data
    cy.get("button[type=submit]").realClick();

    // Check if required error will show up
    cy.inputValue("preview_name", DOCKER_PROJECT, true);

    // Check if required error will show up and thumbnail card will be updated
    cy.inputValue("preview_title", "docker_title", true);
    cy.get(".card div").contains("docker_title").should("exist");

    // Check if required error will show up and thumbnail card will be updated
    cy.get(`textarea[name=preview_desc]`)
      .parent("div")
      .within(() => {
        cy.get("div").should("be.visible");
        cy.get("textarea")
          .clear()
          .type("docker_desc")
          .should("have.value", "docker_desc")
          .blur();
      });

    cy.get(".card div").contains("docker_desc").should("exist");

    cy.get("input[name=preview_thumbnail]")
      .attachFile("../downloads/E1KMKoDVgAM5zII.jpg")
      .wait(500);

    // Check if setting different flag will change window mode
    cy.get("input[name=preview_flag_Docker]").realClick();
    cy.get("input[name=main_window_Config]").should("exist");

    // Check if flag will change preview window structure
    cy.inputValue(
      "preview_links_main",
      `http://${DOCKER_HOST}:${DOCKER_PORT}/test`,
      true,
      `${DOCKER_HOST}:${DOCKER_PORT}/test`
    );

    cy.contains("textarea[preview_note]").should("not.exist");
    cy.contains("footer").should("not.exist");

    // Config docker container name
    cy.get("input[name=preview_repo_name]")
      .clear()
      .type("grimreapermortis/kubernetes-test");
    cy.get("input[name=preview_repo_version]").clear().type(DOCKER_VERSION);

    // Change  Metrics
    cy.get("input[name=preview_cron_day]").clear().type("*");
    cy.get("input[name=preview_cron_hour]").clear().type("*");
    cy.get("input[name=preview_cron_min]").clear().type("*/2");
    cy.get("input[name=preview_cron_sec]").clear().type("0");

    // Start checking Code window
    cy.get("input[name=main_window_Code]").realClick();

    // Add assets files
    cy.get("input[name=code_role_assets]").realClick();
    cy.get("input[name=code_dir]").clear().blur();
    cy.get("input[name=code_file]").attachFile(
      "../downloads/E1KMKoDVgAM5zII.jpg"
    );

    // Add src files
    cy.get("input[name=code_role_src]").realClick();
    cy.get("input[name=code_dir]").clear().blur();
    cy.get("input[name=code_file]").attachFile([
      "../downloads/index.css",
      "../downloads/index.html",
    ]);

    // Check if uploaded files has been visible in the TreeViewer
    cy.get("ul[class^=TreeView]").within(() => {
      cy.contains("assets").parent().realClick();
      cy.contains("E1KMKoDVgAM5zII.jpg").should("exist");

      cy.contains("src")
        .parent()
        .within(() => {
          cy.contains("index.css").should("exist");
          cy.contains("index.html").should("exist");
        });

      cy.contains("thumbnail").parent().realClick();
      cy.contains("thumbnail")
        .parent()
        .contains("E1KMKoDVgAM5zII.jpg")
        .should("exist");

      cy.contains("Dockerfile").should("exist").realClick();
    });

    cy.get("#code-area")
      .clear()
      .type(
        `FROM nginx:latest

COPY src/* /usr/share/nginx/html/test/
COPY assets/* /usr/share/nginx/html/test/

EXPOSE 80
`,
        { parseSpecialCharSequences: false }
      );

    // Start checking Config window
    cy.get("input[name=main_window_Config]").realClick();

    // Add deployment config
    cy.contains("Deployment").parent().realHover();
    cy.get("button[name=Deployment_add]").realClick();

    // Config deployment Metadata
    cy.inputValue("config_deployment_0_metadata_name", "kube-test-d");
    cy.inputValue("config_deployment_0_metadata_namespace", "demo");

    // Config deployment Spec
    cy.inputValue("config_deployment_0_spec_replicas", "a5", false, "5");
    cy.get(
      "input[name=config_deployment_0_spec_strategy_type_RollingUpdate]"
    ).realClick();

    cy.inputValue(
      "temp_config_deployment_0_spec_selector_matchLabels_0",
      "app"
    );
    cy.inputValue(
      "temp_config_deployment_0_spec_selector_matchLabels_1",
      "kube-test"
    );

    cy.get(
      "button[name=temp_config_deployment_0_spec_selector_matchLabels_0]"
    ).realClick();

    // Add New container
    cy.get("button[name=config_deployment_0_container_add]").realClick();

    // Config container
    cy.inputValue(
      "config_deployment_0_spec_template_spec_containers_0_name",
      "kube-test"
    );

    cy.inputValue(
      "config_deployment_0_spec_template_spec_containers_0_image",
      `grimreapermortis/kubernetes-test:${DOCKER_VERSION}`
    );

    cy.get(
      "input[name=config_deployment_0_spec_template_spec_containers_0_imagePullPolicy_Always]"
    ).realClick();

    // Add New Container Port
    cy.get(
      "button[name=config_deployment_0_spec_template_spec_containers_0_port_add]"
    ).realClick();

    cy.inputValue(
      "config_deployment_0_spec_template_spec_containers_0_ports_0_containerPort",
      "b80",
      false,
      "80"
    );

    // Add Service config
    cy.contains("Service").parent().realHover();
    cy.get("button[name=Service_add]").realClick();

    // Config service Metadata
    cy.inputValue("config_service_0_metadata_name", "kube-test-s");
    cy.inputValue("config_service_0_metadata_namespace", "demo");

    cy.inputValue("temp_config_service_0_spec_selector_0", "app");
    cy.inputValue("temp_config_service_0_spec_selector_1", "kube-test");
    cy.get("button[name=temp_config_service_0_spec_selector_0]").realClick();

    cy.get("button[name=config_service_0_port_add]").realClick();

    cy.inputValue("config_service_0_spec_ports_0_port", DOCKER_PORT);
    cy.inputValue("config_service_0_spec_ports_0_targetPort", "80");

    // NOTE: Dont have to check ingress on local server, there for maybe one day

    // Submit project
    cy.get("button[type=submit]").realClick();

    // FIXME: Somehow to check toastify
    cy.wait(60000);

    // Check if project exists and there not any server errors
    cy.request({ url: "/" + DOCKER_PROJECT, followRedirect: false }).then(
      (res) => {
        expect(res.status).equal(307);
        expect(res.headers.location).include(`${DOCKER_HOST}:${DOCKER_PORT}`);
      }
    );
  });
});
